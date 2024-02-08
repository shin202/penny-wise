import { CategoryType } from '../category.interface';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { Category } from '../entities/category.entity';
import { Image } from '../../images/entities/image.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;

  @IsExists(Category, 'id')
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsExists(Image, 'name')
  @IsString()
  @IsNotEmpty()
  imageName: string;
}
