import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity({ name: 'currencies' })
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  @Column({ name: 'symbol', type: 'varchar' })
  symbol: string;

  @Column({ name: 'code', type: 'varchar', unique: true })
  code: string;

  @Column({ name: 'decimal_digits', type: 'int' })
  decimalDigits: number;

  @Column({ name: 'rounding', type: 'int' })
  rounding: number;

  @Column({ name: 'name_plural', type: 'varchar' })
  namePlural: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];

  @OneToMany(() => Expense, (expense) => expense.currency)
  expenses: Expense[];
}
