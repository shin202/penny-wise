import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users';
import * as dayjs from 'dayjs';

@Entity({ name: 'email_verify_tokens' })
export class EmailVerifyToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.emailVerifyTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'token', type: 'varchar', unique: true })
  token: string;

  @Column({
    name: 'expires_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  expiresAt: Date;

  @Column({ name: 'is_used', type: 'boolean', nullable: true, default: false })
  isUsed: boolean;

  @Column({ name: 'used_at', type: 'datetime', nullable: true, default: null })
  usedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isExpired(): boolean {
    return this.expiresAt < dayjs().toDate();
  }

  markAsUsed(): void {
    this.isUsed = true;
    this.usedAt = dayjs().toDate();
  }
}
