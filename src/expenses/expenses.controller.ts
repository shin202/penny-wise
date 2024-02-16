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
import { ExpenseGuard } from './expense.guard';
import { Action } from '../common/constants';
import { RequiresPermission } from '../common/decorators/requires-permission';

@Controller('expenses')
@UseGuards(AuthGuard, ExpenseGuard)
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
  @RequiresPermission(Action.READ)
  async findOne(@Param('id') id: string) {
    const expense = await this.expensesService.findOneOrFail(+id);

    return {
      status: 'success',
      message: 'Expense retrieved successfully',
      data: expense,
    };
  }

  @Patch(':id')
  @RequiresPermission(Action.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const expense = await this.expensesService.update(+id, updateExpenseDto);

    return {
      status: 'success',
      message: 'Expense updated successfully',
      data: expense,
    };
  }

  @Delete(':id')
  @RequiresPermission(Action.DELETE)
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
