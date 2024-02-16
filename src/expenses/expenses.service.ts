import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EXPENSE_CREATED,
  EXPENSE_DELETED,
  EXPENSE_UPDATED,
} from '../common/constants';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly imageService: ImagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    req: Request & { user: User },
  ) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      createExpenseDto;

    const images: Image[] = imageNames
      ? await this.imageService.findInNames(imageNames)
      : undefined;

    const expense: Expense = this.expenseRepository.create({
      category: { id: categoryId },
      currency: { id: currencyId },
      wallet: { id: walletId },
      user: { id: req.user.id },
      images,
      ...rest,
    });

    const savedExpense: Expense = await this.expenseRepository.save(expense);

    this.eventEmitter.emit(EXPENSE_CREATED, savedExpense);

    return savedExpense;
  }

  findAll(req: Request & { user: User }) {
    return this.expenseRepository.find({
      where: {
        user: { username: req.user.username },
      },
      relations: {
        currency: true,
        category: true,
      },
    });
  }

  findOneOrFail(id: number) {
    return this.expenseRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        user: true,
        wallet: true,
        currency: true,
        category: true,
        images: true,
      },
      select: {
        id: true,
        amount: true,
        notes: true,
        transactionDate: true,
        wallet: {
          id: true,
          name: true,
        },
        currency: {
          id: true,
          name: true,
          code: true,
        },
        category: {
          id: true,
          name: true,
        },
        images: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          username: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      updateExpenseDto;

    const expense: Expense = await this.findOneOrFail(id);

    const images: Image[] = imageNames
      ? await this.imageService.findInNames(imageNames)
      : undefined;

    const category = categoryId ? { id: categoryId } : undefined;
    const currency = currencyId ? { id: currencyId } : undefined;
    const wallet = walletId ? { id: walletId } : undefined;

    const savedExpense: Expense = await this.expenseRepository.save({
      ...expense,
      ...rest,
      images,
      category,
      currency,
      wallet,
    });

    this.eventEmitter.emit(EXPENSE_UPDATED, savedExpense);

    return savedExpense;
  }

  async remove(id: number) {
    await this.expenseRepository.delete(id);
    this.eventEmitter.emit(EXPENSE_DELETED, id);
  }
}
