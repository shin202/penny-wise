import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { TreeRepository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly imageService: ImagesService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, imageName, ...rest } = createCategoryDto;

    let parentCategory: Category = null;

    if (parentId) {
      parentCategory = await this.findOneOrFail(parentId);
    }

    const image: Image = await this.imageService.findByName(imageName);
    const category: Category = this.categoryRepository.create({
      ...rest,
      parent: parentCategory,
      image,
    });

    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.findTrees();
  }

  findOneOrFail(id: number) {
    return this.categoryRepository.findOneOrFail({
      where: { id },
    });
  }

  async updateOrFail(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { parentId, imageName, ...rest } = updateCategoryDto;

    const category: Category = await this.findOneOrFail(id);

    const parentCategory: Category = parentId
      ? await this.findOneOrFail(parentId)
      : category.parent;

    const image: Image = imageName
      ? await this.imageService.findByName(imageName)
      : category.image;

    return this.categoryRepository.save({
      ...category,
      ...rest,
      parent: parentCategory,
      image,
    });
  }

  async deleteOrFail(id: number) {
    const category: Category = await this.findOneOrFail(id);
    return this.categoryRepository.remove(category);
  }
}
