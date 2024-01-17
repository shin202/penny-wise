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

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    private readonly imageService: ImagesService,
  ) {}

  async create(createIncomeDto: CreateIncomeDto) {
    const { walletId, categoryId, currencyId, imageNames, ...rest } =
      createIncomeDto;

    const images: Image[] = await Promise.all(
      imageNames.map(async (name) => {
        return await this.imageService.findByName(name);
      }),
    );

    const income: Income = this.incomeRepository.create({
      category: { id: categoryId },
      currency: { id: currencyId },
      wallet: { id: walletId },
      images,
      ...rest,
    });

    return this.incomeRepository.save(income);
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
        currency: true,
        category: true,
        images: true,
      },
    });
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return this.incomeRepository.update(id, updateIncomeDto);
  }

  remove(id: number) {
    return this.incomeRepository.delete(id);
  }
}
