import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlatformConnection } from './platform-connection.entity';
import { PlatformConnectionsService } from './platform-connections.service';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockConnection: PlatformConnection = {
  id: 'conn-1',
  userId: 'user-1',
  user: {} as never,
  platform: 'youtube',
  authType: 'api_key',
  credential: 'secret-key-1234',
  maskedCredential: '****1234',
  credentialSecret: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PlatformConnectionsService', () => {
  let service: PlatformConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatformConnectionsService,
        { provide: getRepositoryToken(PlatformConnection), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PlatformConnectionsService>(
      PlatformConnectionsService,
    );
    jest.clearAllMocks();
  });

  describe('findAllForUser', () => {
    it('returns connections for the user', async () => {
      mockRepo.find.mockResolvedValue([mockConnection]);
      const result = await service.findAllForUser('user-1');
      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('create', () => {
    it('creates a connection with masked credential', async () => {
      mockRepo.create.mockReturnValue(mockConnection);
      mockRepo.save.mockResolvedValue(mockConnection);

      const result = await service.create('user-1', {
        platform: 'youtube',
        authType: 'api_key',
        apiKey: 'secret-key-1234',
      });

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ maskedCredential: '****1234' }),
      );
      expect(result.maskedCredential).toBe('****1234');
    });

    it('uses oauthToken when authType is oauth', async () => {
      mockRepo.create.mockReturnValue({ ...mockConnection, authType: 'oauth' });
      mockRepo.save.mockResolvedValue({ ...mockConnection, authType: 'oauth' });

      await service.create('user-1', {
        platform: 'x',
        authType: 'oauth',
        oauthToken: 'tok-abcd',
        oauthTokenSecret: 'sec',
      });

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credential: 'tok-abcd' }),
      );
    });
  });

  describe('remove', () => {
    it('removes a connection belonging to the user', async () => {
      mockRepo.findOne.mockResolvedValue(mockConnection);
      mockRepo.remove.mockResolvedValue(undefined);
      await service.remove('conn-1', 'user-1');
      expect(mockRepo.remove).toHaveBeenCalledWith(mockConnection);
    });

    it('throws NotFoundException when connection does not belong to user', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('conn-1', 'other-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
