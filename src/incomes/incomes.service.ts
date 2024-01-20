import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  INCOME_CREATED,
  INCOME_DELETED,
  INCOME_UPDATED,
} from '../common/constants/events.constant';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    private readonly imageService: ImagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createIncomeDto: CreateIncomeDto,
    req: Request & { user: User },
  ) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      createIncomeDto;

    const images: Image[] = await this.imageService.findInNames(imageNames);

    const income: Income = this.incomeRepository.create({
      category: { id: categoryId },
      currency: { id: currencyId },
      wallet: { id: walletId },
      user: { id: req.user.id },
      images,
      ...rest,
    });

    const savedIncome: Income = await this.incomeRepository.save(income);

    this.eventEmitter.emit(INCOME_CREATED, savedIncome);

    return savedIncome;
  }

  findAll(req: Request & { user: User }) {
    return this.incomeRepository.find({
      where: {
        user: { username: req.user.username },
      },
      relations: {
        category: true,
        currency: true,
      },
    });
  }

  findOne(id: number, req: Request & { user: User }) {
    return this.incomeRepository.findOne({
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
    updateIncomeDto: UpdateIncomeDto,
    req: Request & { user: User },
  ) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      updateIncomeDto;

    const images: Image[] = await this.imageService.findInNames(imageNames);

    const income: Income = await this.findOne(id, req);

    const savedIncome: Income = await this.incomeRepository.save({
      ...income,
      ...rest,
      images,
      wallet: { id: walletId || income.wallet.id },
      category: { id: categoryId || income.category.id },
      currency: { id: currencyId || income.currency.id },
      user: { id: req.user.id },
    });

    this.eventEmitter.emit(INCOME_UPDATED, savedIncome);

    return savedIncome;
  }

  async remove(id: number) {
    await this.incomeRepository.delete(id);
    this.eventEmitter.emit(INCOME_DELETED, id);
  }
}
