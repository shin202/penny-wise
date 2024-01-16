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
import { CategoryType } from '../category.interface';
import { Transform } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity({ name: 'categories' })
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

  @Column({ name: 'type', type: 'smallint' })
  @Transform(({ value }) => CategoryType[value])
  type: CategoryType;

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
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
}
