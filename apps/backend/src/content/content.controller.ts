import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { PublishContentDto } from './dto/publish-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.contentService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: { user: User }, @Param('id') id: string) {
    return this.contentService.findOne(id, req.user.id);
  }

  @Post()
  create(@Request() req: { user: User }, @Body() dto: CreateContentDto) {
    return this.contentService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
  ) {
    return this.contentService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: User }, @Param('id') id: string) {
    return this.contentService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  publish(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() dto: PublishContentDto,
  ) {
    return this.contentService.publish(id, req.user.id, dto);
  }
}
