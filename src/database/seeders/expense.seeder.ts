import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Expense } from '../../expenses/entities/expense.entity';

export class ExpenseSeeder implements Seeder {
  track?: boolean;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const expenseFactory = factoryManager.get(Expense);
    await expenseFactory.saveMany(30);
  }
}
