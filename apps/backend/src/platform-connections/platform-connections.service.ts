import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformConnection, PlatformType } from './platform-connection.entity';
import { CreatePlatformConnectionDto } from './dto/create-platform-connection.dto';

@Injectable()
export class PlatformConnectionsService {
  constructor(
    @InjectRepository(PlatformConnection)
    private readonly repo: Repository<PlatformConnection>,
  ) {}

  findAllForUser(userId: string): Promise<PlatformConnection[]> {
    return this.repo.find({ where: { userId } });
  }

  async create(
    userId: string,
    dto: CreatePlatformConnectionDto,
  ): Promise<PlatformConnection> {
    const credential =
      dto.authType === 'api_key' ? (dto.apiKey ?? '') : (dto.oauthToken ?? '');
    const maskedCredential = this.mask(credential);

    const connection = this.repo.create({
      userId,
      platform: dto.platform as PlatformType,
      authType: dto.authType,
      credential,
      maskedCredential,
      credentialSecret: dto.oauthTokenSecret ?? null,
    });
    return this.repo.save(connection);
  }

  async remove(id: string, userId: string): Promise<void> {
    const connection = await this.repo.findOne({ where: { id, userId } });
    if (!connection) {
      throw new NotFoundException('Platform connection not found');
    }
    await this.repo.remove(connection);
  }

  async findByIds(
    ids: string[],
    userId: string,
  ): Promise<PlatformConnection[]> {
    if (ids.length === 0) return [];
    return this.repo
      .createQueryBuilder('pc')
      .where('pc.id IN (:...ids)', { ids })
      .andWhere('pc.userId = :userId', { userId })
      .andWhere('pc.isActive = true')
      .getMany();
  }

  private mask(value: string): string {
    if (value.length <= 4) return '****';
    return `****${value.slice(-4)}`;
  }
}
