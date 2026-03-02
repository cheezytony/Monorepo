import {
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AuthType, PlatformType } from '../platform-connection.entity';

export class CreatePlatformConnectionDto {
  @IsIn(['youtube', 'instagram', 'tiktok', 'x'])
  platform: PlatformType;

  @IsIn(['oauth', 'api_key'])
  authType: AuthType;

  @ValidateIf((o: CreatePlatformConnectionDto) => o.authType === 'api_key')
  @IsString()
  @MinLength(1)
  apiKey?: string;

  @ValidateIf((o: CreatePlatformConnectionDto) => o.authType === 'oauth')
  @IsString()
  @MinLength(1)
  oauthToken?: string;

  @IsOptional()
  @IsString()
  oauthTokenSecret?: string;
}
