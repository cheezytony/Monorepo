import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlatformConnectionsService } from '../platform-connections/platform-connections.service';
import { ContentService } from './content.service';
import { Content } from './content.entity';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockPlatformConnectionsService = {
  findByIds: jest.fn(),
};

const mockContent: Content = {
  id: 'content-1',
  userId: 'user-1',
  user: {} as never,
  title: 'My Post',
  body: 'Hello world',
  mediaUrl: null,
  status: 'draft',
  publishedToConnectionIds: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getRepositoryToken(Content), useValue: mockRepo },
        {
          provide: PlatformConnectionsService,
          useValue: mockPlatformConnectionsService,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    jest.clearAllMocks();
  });

  describe('findAllForUser', () => {
    it('returns content list for the user', async () => {
      mockRepo.find.mockResolvedValue([mockContent]);
      const result = await service.findAllForUser('user-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('returns the content item', async () => {
      mockRepo.findOne.mockResolvedValue(mockContent);
      const result = await service.findOne('content-1', 'user-1');
      expect(result.title).toBe('My Post');
    });

    it('throws NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a draft content item', async () => {
      mockRepo.create.mockReturnValue(mockContent);
      mockRepo.save.mockResolvedValue(mockContent);

      const result = await service.create('user-1', {
        title: 'My Post',
        body: 'Hello world',
      });

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'draft', userId: 'user-1' }),
      );
      expect(result.status).toBe('draft');
    });
  });

  describe('publish', () => {
    it('marks content as published with valid connections', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockContent });
      mockPlatformConnectionsService.findByIds.mockResolvedValue([
        { id: 'conn-1' },
      ]);
      mockRepo.save.mockResolvedValue({
        ...mockContent,
        status: 'published',
        publishedToConnectionIds: ['conn-1'],
      });

      const result = await service.publish('content-1', 'user-1', {
        platformConnectionIds: ['conn-1'],
      });

      expect(result.status).toBe('published');
    });

    it('throws BadRequestException when no valid connections exist', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockContent });
      mockPlatformConnectionsService.findByIds.mockResolvedValue([]);

      await expect(
        service.publish('content-1', 'user-1', {
          platformConnectionIds: ['bad-id'],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
