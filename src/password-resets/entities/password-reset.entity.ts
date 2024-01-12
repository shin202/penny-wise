import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'password_resets' })
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar' })
  @Index()
  email: string;

  @Column({ name: 'token', type: 'varchar', unique: true })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
