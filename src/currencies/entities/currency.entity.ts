import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
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
}
