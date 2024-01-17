import { setSeederFactory } from 'typeorm-extension';
import { Expense } from '../../expenses/entities/expense.entity';

export default setSeederFactory(Expense, (faker) => {
  const expense = new Expense();

  expense.amount = Number(faker.finance.amount(10000, 500000, 2));
  expense.transactionDate = faker.date.past();
  expense.notes = faker.lorem.sentence(10);

  return expense;
});
