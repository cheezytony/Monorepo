import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { CreatePlatformConnectionDto } from './dto/create-platform-connection.dto';
import { PlatformConnectionsService } from './platform-connections.service';

@UseGuards(AuthGuard('jwt'))
@Controller('platform-connections')
export class PlatformConnectionsController {
  constructor(private readonly service: PlatformConnectionsService) {}

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.service.findAllForUser(req.user.id);
  }

  @Post()
  create(
    @Request() req: { user: User },
    @Body() dto: CreatePlatformConnectionDto,
  ) {
    return this.service.create(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: User }, @Param('id') id: string) {
    return this.service.remove(id, req.user.id);
  }
}
