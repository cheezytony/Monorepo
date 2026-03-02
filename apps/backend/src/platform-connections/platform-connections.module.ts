import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformConnection } from './platform-connection.entity';
import { PlatformConnectionsController } from './platform-connections.controller';
import { PlatformConnectionsService } from './platform-connections.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformConnection])],
  controllers: [PlatformConnectionsController],
  providers: [PlatformConnectionsService],
  exports: [PlatformConnectionsService],
})
export class PlatformConnectionsModule {}
