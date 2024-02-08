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
    return this.categoryRepository.findTrees({
      relations: ['image'],
      depth: 2,
    });
  }

  findOneOrFail(id: number) {
    return this.categoryRepository.findOneOrFail({
      where: { id },
      relations: {
        image: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        parent: {
          id: true,
          name: true,
        },
        image: {
          name: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { parentId, imageName, ...rest } = updateCategoryDto;

    const parentCategory: Category = parentId
      ? await this.findOneOrFail(parentId)
      : undefined;

    const image: Image = imageName
      ? await this.imageService.findByName(imageName)
      : undefined;

    return this.categoryRepository.update(id, {
      ...rest,
      parent: parentCategory,
      image,
    });
  }

  async delete(id: number) {
    return this.categoryRepository.delete(id);
  }
}
