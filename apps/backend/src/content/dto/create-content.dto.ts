import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}
