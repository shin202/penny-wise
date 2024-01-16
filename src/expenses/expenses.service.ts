import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import * as dayjs from 'dayjs';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly imageService: ImagesService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    req: Request & { user: User },
  ) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      createExpenseDto;

    const images: Image[] = await Promise.all(
      imageNames.map(async (name) => {
        return await this.imageService.findByName(name);
      }),
    );

    const expense: Expense = this.expenseRepository.create({
      category: { id: categoryId },
      currency: { id: currencyId },
      wallet: { id: walletId },
      user: { id: req.user.id },
      transactionDate: dayjs().toDate(),
      images,
      ...rest,
    });

    return this.expenseRepository.save(expense);
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
        currency: true,
        category: true,
        images: true,
      },
    });
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  remove(id: number) {
    return this.expenseRepository.delete(id);
  }
}
