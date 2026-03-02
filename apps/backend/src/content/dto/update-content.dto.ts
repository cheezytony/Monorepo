import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}
