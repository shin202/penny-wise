import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';
import { CategoryType } from '../../categories/category.interface';

export default setSeederFactory(Category, (faker) => {
  const category = new Category();

  category.name = faker.lorem.word(5);
  category.description = faker.lorem.sentence(3);
  category.type = faker.helpers.enumValue(CategoryType);

  return category;
});
