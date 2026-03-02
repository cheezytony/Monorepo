import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformConnectionsModule } from '../platform-connections/platform-connections.module';
import { ContentController } from './content.controller';
import { Content } from './content.entity';
import { ContentService } from './content.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), PlatformConnectionsModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
