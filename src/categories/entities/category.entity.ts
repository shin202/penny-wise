import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryType } from '../category.interface';
import { Transform } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Income } from '../../incomes/entities/income.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: 'categories' })
@Tree('closure-table')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  description: string;

  @Column({ name: 'type', type: 'varchar' })
  type: CategoryType;

  @TreeParent({ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @TreeChildren()
  children: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Image, (image) => image.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.category)
  incomes: Income[];

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
