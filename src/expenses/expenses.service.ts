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
} from '../common/constants/events.constant';

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

    const images: Image[] = await this.imageService.findInNames(imageNames);

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

  findOne(id: number, req: Request & { user: User }) {
    return this.expenseRepository.findOne({
      where: {
        id,
        user: { username: req.user.username },
      },
      relations: {
        wallet: true,
        currency: true,
        category: true,
        images: true,
      },
    });
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
    req: Request & { user: User },
  ) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      updateExpenseDto;

    const images: Image[] = await this.imageService.findInNames(imageNames);

    const expense: Expense = await this.findOne(id, req);

    const savedExpense: Expense = await this.expenseRepository.save({
      ...expense,
      ...rest,
      images,
      category: { id: categoryId || expense.category.id },
      currency: { id: currencyId || expense.currency.id },
      wallet: { id: walletId || expense.wallet.id },
      user: { id: req.user.id },
    });

    this.eventEmitter.emit(EXPENSE_UPDATED, savedExpense);

    return savedExpense;
  }

  async remove(id: number) {
    await this.expenseRepository.delete(id);
    this.eventEmitter.emit(EXPENSE_DELETED, id);
  }
}
