import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Transform } from '../common/interceptors/transform.interface';
import { Income } from './entities/income.entity';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';
import { UploadService } from '../images/upload/upload.service';
import { IncomeGuard } from './income.guard';
import { RequiresPermission } from '../common/decorators/requires-permission';
import { Action } from '../common/constants';

@Controller('incomes')
@UseGuards(AuthGuard, IncomeGuard)
export class IncomesController {
  constructor(
    private readonly incomesService: IncomesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  async create(
    @Body() createIncomeDto: CreateIncomeDto,
    @Req() req: Request & { user: User },
  ): Promise<Transform<Income>> {
    const income: Income = await this.incomesService.create(
      createIncomeDto,
      req,
    );

    return {
      status: 'success',
      message: 'Income created successfully.',
      data: income,
    };
  }

  @Get()
  async findAll(
    @Req() req: Request & { user: User },
  ): Promise<Transform<Income[]>> {
    const incomes: Income[] = await this.incomesService.findAll(req);

    return {
      status: 'success',
      message: 'Incomes retrieved successfully.',
      data: incomes,
    };
  }

  @Get(':id')
  @RequiresPermission(Action.READ)
  async findOne(@Param('id') id: string): Promise<Transform<Income>> {
    const income = await this.incomesService.findOneOrFail(+id);

    return {
      status: 'success',
      message: 'Income retrieved successfully.',
      data: income,
    };
  }

  @Patch(':id')
  @RequiresPermission(Action.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<Transform<any>> {
    const income = await this.incomesService.update(+id, updateIncomeDto);

    return {
      status: 'success',
      message: 'Income updated successfully.',
      data: income,
    };
  }

  @Delete(':id')
  @RequiresPermission(Action.DELETE)
  async remove(@Param('id') id: string): Promise<Transform<any>> {
    await this.incomesService.remove(+id);

    return {
      status: 'success',
      message: 'Income deleted successfully.',
      data: null,
    };
  }

  @Post('image')
  @Version('1')
  @UseInterceptors(FilesInterceptor('images', 3, multerOptions('incomes')))
  @UseFilters(DeleteFileOnFailFilter)
  async uploadImage(
    @UploadedFiles(ParseFilePipe) files: Array<Express.Multer.File>,
  ) {
    return this.uploadService.uploadMultiple(files);
  }
}
