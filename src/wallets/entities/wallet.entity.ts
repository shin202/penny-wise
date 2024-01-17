import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WalletStatus } from '../wallet.interface';
import { Transform } from 'class-transformer';
import { Currency } from '../../currencies/entities/currency.entity';
import { Image } from '../../images/entities/image.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Income } from '../../incomes/entities/income.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: 'wallets' })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  balance: number;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  description: string;

  @Column({
    name: 'status',
    type: 'smallint',
    nullable: true,
    default: WalletStatus.ACTIVE,
  })
  @Transform(({ value }) => WalletStatus[value])
  status: WalletStatus;

  @ManyToOne(() => User, (user) => user.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Currency, (currency) => currency.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Image, (image) => image.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @OneToMany(() => Expense, (expense) => expense.wallet)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.wallet)
  incomes: Income[];

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
