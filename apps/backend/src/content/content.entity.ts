import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type ContentStatus = 'draft' | 'published' | 'failed';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  mediaUrl: string | null;

  @Column({ type: 'varchar', default: 'draft' })
  status: ContentStatus;

  /**
   * IDs of the PlatformConnection rows this content was published to.
   * Stored as a comma-separated list for simplicity.
   */
  @Column({ type: 'simple-array', nullable: true })
  publishedToConnectionIds: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
