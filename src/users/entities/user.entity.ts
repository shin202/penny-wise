import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as dayjs from 'dayjs';

import { PasswordUtils } from '../../utils';
import { EmailVerifyToken } from '../../email-verify-tokens';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  @Exclude()
  password: string;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isVerified: boolean;

  @Column({
    name: 'email_verified_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  emailVerifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => EmailVerifyToken,
    (emailVerifyToken) => emailVerifyToken.user,
  )
  emailVerifyTokens: EmailVerifyToken[];

  @BeforeInsert()
  hashPassword(): void {
    this.password = PasswordUtils.hashPassword(this.password);
  }

  validatePassword(password: string): boolean {
    return PasswordUtils.comparePassword(password, this.password);
  }

  markAsVerified(): void {
    this.isVerified = true;
    this.emailVerifiedAt = dayjs().toDate();
  }
}
