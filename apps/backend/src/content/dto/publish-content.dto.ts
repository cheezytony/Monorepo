import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class PublishContentDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  platformConnectionIds: string[];
}
