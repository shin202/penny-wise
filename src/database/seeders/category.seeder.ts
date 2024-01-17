import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export class CategorySeeder implements Seeder {
  track?: boolean;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const categoryFactory = factoryManager.get(Category);
    await categoryFactory.saveMany(10);
  }
}
