import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageType } from '../image.interface';
import { Transform } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  @Column({ name: 'path', type: 'varchar' })
  path: string;

  @Column({ name: 'type', type: 'smallint' })
  @Transform(({ value }) => ImageType[value])
  type: ImageType;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.image)
  categories: Category[];

  @OneToMany(() => Wallet, (wallet) => wallet.image)
  wallets: Wallet[];
}
