import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
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
import { EmailVerifyToken } from '../../email-verify-tokens/entities/email-verify-token.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Income } from '../../incomes/entities/income.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  private tempPassword: string;

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

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

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

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  private checkPasswordChanged(): void {
    if (this.tempPassword !== this.password) {
      this.password = PasswordUtils.hashPassword(this.password);
    }
  }
}
