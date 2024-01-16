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
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Transform } from 'class-transformer';
import { Currency } from '../../currencies/entities/currency.entity';
import { Category } from '../../categories/entities/category.entity';
import { Image } from '../../images/entities/image.entity';

@Entity({ name: 'expenses' })
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ManyToOne(() => Currency, (currency) => currency.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ManyToOne(() => Category, (category) => category.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'transaction_date', type: 'datetime' })
  transactionDate: Date;

  @Column({
    name: 'notes',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  notes: string;

  @OneToMany(() => Image, (image) => image.expense)
  images: Image[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
