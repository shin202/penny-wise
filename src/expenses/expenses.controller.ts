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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UploadService } from '../images/upload/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';

@Controller('expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: Request & { user: User },
  ) {
    const expense = await this.expensesService.create(createExpenseDto, req);

    return {
      status: 'success',
      message: 'Expense created successfully',
      data: expense,
    };
  }

  @Get()
  async findAll(@Req() req: Request & { user: User }) {
    const expenses = await this.expensesService.findAll(req);

    return {
      status: 'success',
      message: 'Expenses retrieved successfully',
      data: expenses,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const expense = this.expensesService.findOne(+id, req);

    return {
      status: 'success',
      message: 'Expense retrieved successfully',
      data: expense,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: Request & { user: User },
  ) {
    const expense = await this.expensesService.update(
      +id,
      updateExpenseDto,
      req,
    );

    return {
      status: 'success',
      message: 'Expense updated successfully',
      data: expense,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.expensesService.remove(+id);

    return {
      status: 'success',
      message: 'Expense deleted successfully',
      data: null,
    };
  }

  @Post('image')
  @Version('1')
  @UseInterceptors(FilesInterceptor('images', 3, multerOptions('expenses')))
  @UseFilters(DeleteFileOnFailFilter)
  async uploadImage(
    @UploadedFiles(ParseFilePipe) files: Array<Express.Multer.File>,
  ) {
    return this.uploadService.uploadMultiple(files);
  }
}
