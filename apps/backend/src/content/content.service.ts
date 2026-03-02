import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformConnectionsService } from '../platform-connections/platform-connections.service';
import { Content } from './content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { PublishContentDto } from './dto/publish-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    private readonly platformConnectionsService: PlatformConnectionsService,
  ) {}

  findAllForUser(userId: string): Promise<Content[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Content> {
    const content = await this.repo.findOne({ where: { id, userId } });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async create(userId: string, dto: CreateContentDto): Promise<Content> {
    const content = this.repo.create({
      userId,
      title: dto.title,
      body: dto.body,
      mediaUrl: dto.mediaUrl ?? null,
      status: 'draft',
    });
    return this.repo.save(content);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findOne(id, userId);
    Object.assign(content, dto);
    return this.repo.save(content);
  }

  async remove(id: string, userId: string): Promise<void> {
    const content = await this.findOne(id, userId);
    await this.repo.remove(content);
  }

  async publish(
    id: string,
    userId: string,
    dto: PublishContentDto,
  ): Promise<Content> {
    const content = await this.findOne(id, userId);

    const connections = await this.platformConnectionsService.findByIds(
      dto.platformConnectionIds,
      userId,
    );

    if (connections.length === 0) {
      throw new BadRequestException(
        'No valid active platform connections found',
      );
    }

    // In a real implementation this would call each platform's API.
    // Here we record the intent and mark the content as published.
    content.status = 'published';
    content.publishedToConnectionIds = connections.map((c) => c.id);
    return this.repo.save(content);
  }
}
