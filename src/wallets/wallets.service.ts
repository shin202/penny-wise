import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { CurrenciesService } from '../currencies/currencies.service';
import { Currency } from '../currencies/entities/currency.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly currencyService: CurrenciesService,
  ) {}

  async create(
    createWalletDto: CreateWalletDto,
    req: Request & { user: User },
  ): Promise<Wallet> {
    const { currencyId, ...rest } = createWalletDto;

    const currency: Currency = await this.currencyService.findOne(currencyId);
    const wallet = this.walletRepository.create({
      ...rest,
      currency,
      user: req.user,
    });

    return await this.walletRepository.save(wallet);
  }

  findAll(req: Request & { user: User }): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: {
        user: {
          username: req.user.username,
        },
      },
      relations: {
        currency: true,
      },
      select: {
        id: true,
        name: true,
        balance: true,
        status: true,
        currency: {
          name: true,
          symbol: true,
          code: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number, req: Request & { user: User }) {
    return this.walletRepository.findOne({
      where: {
        id,
        user: {
          username: req.user.username,
        },
      },
      relations: {
        currency: true,
      },
      select: {
        id: true,
        name: true,
        balance: true,
        description: true,
        status: true,
        currency: {
          name: true,
          symbol: true,
          code: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: number,
    updateWalletDto: UpdateWalletDto,
    req: Request & { user: User },
  ) {
    const { currencyId, ...rest } = updateWalletDto;

    const currency: Currency = await this.currencyService.findOne(currencyId);

    return this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({
        ...rest,
        currency,
      })
      .where('id = :id', { id })
      .andWhere('user_id', { user_id: req.user.id })
      .execute();
  }

  remove(id: number, req: Request & { user: User }) {
    return this.walletRepository
      .createQueryBuilder()
      .delete()
      .from(Wallet)
      .where('id = :id', { id })
      .andWhere('user_id', { user_id: req.user.id })
      .execute();
  }
}
