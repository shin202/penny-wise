import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Transform } from '../common/interceptors/transform.interface';
import { Category } from './entities/category.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UploadService } from '../images/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Version('1')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Transform<Category>> {
    const category: Category =
      await this.categoriesService.create(createCategoryDto);

    return {
      status: 'success',
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get()
  @Version('1')
  async findAll(): Promise<Transform<Category[]>> {
    const categories: Category[] = await this.categoriesService.findAll();

    return {
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param('id') id: string): Promise<Transform<Category>> {
    const category: Category = await this.categoriesService.findOneOrFail(+id);

    return {
      status: 'success',
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  @Patch(':id')
  @Version('1')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoriesService.update(+id, updateCategoryDto);

    return {
      status: 'success',
      message: 'Category updated successfully',
      data: null,
    };
  }

  @Delete(':id')
  @Version('1')
  async destroy(@Param('id') id: string) {
    await this.categoriesService.delete(+id);

    return {
      status: 'success',
      message: 'Category deleted successfully',
      data: null,
    };
  }

  @Post('image')
  @Version('1')
  @UseInterceptors(FileInterceptor('image', multerOptions('categories')))
  @UseFilters(DeleteFileOnFailFilter)
  async uploadImage(@UploadedFile(ParseFilePipe) file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }
}
