import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageService: ImagesService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, imageName, ...rest } = createCategoryDto;

    const image: Image = await this.imageService.findByName(imageName);
    const category: Category = this.categoryRepository.create({
      ...rest,
      parent: {
        id: parentId,
      },
      image,
    });

    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
