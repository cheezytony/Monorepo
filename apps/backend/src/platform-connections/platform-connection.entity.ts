import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type PlatformType = 'youtube' | 'instagram' | 'tiktok' | 'x';
export type AuthType = 'oauth' | 'api_key';

@Entity('platform_connections')
export class PlatformConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  platform: PlatformType;

  @Column({ type: 'varchar' })
  authType: AuthType;

  /** Stored credential (API key or OAuth token). Never returned to clients. */
  @Column({ select: false })
  credential: string;

  /** Last-4-char mask shown in the UI. */
  @Column()
  maskedCredential: string;

  /** For OAuth flows: optional secondary token (e.g. token secret). */
  @Column({ nullable: true, select: false })
  credentialSecret: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
