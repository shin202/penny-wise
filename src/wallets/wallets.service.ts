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
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly currencyService: CurrenciesService,
    private readonly imageService: ImagesService,
  ) {}

  async create(
    createWalletDto: CreateWalletDto,
    req: Request & { user: User },
  ): Promise<Wallet> {
    const { currencyCode, imageName, ...rest } = createWalletDto;

    const currency: Currency =
      await this.currencyService.findByCode(currencyCode);
    const image: Image = await this.imageService.findByName(imageName);

    const wallet = this.walletRepository.create({
      ...rest,
      currency,
      image,
      user: req.user,
    });

    return this.walletRepository.save(wallet);
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
        image: true,
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
        image: {
          name: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOrFail(id: number) {
    return this.walletRepository.findOneOrFail({
      where: { id },
      relations: {
        user: true,
        currency: true,
        image: true,
      },
      select: {
        id: true,
        name: true,
        balance: true,
        description: true,
        status: true,
        user: {
          id: true,
          username: true,
        },
        currency: {
          name: true,
          symbol: true,
          code: true,
        },
        image: {
          name: true,
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
    const { imageName, currencyCode, ...rest } = updateWalletDto;

    const currency: Currency = currencyCode
      ? await this.currencyService.findByCode(currencyCode)
      : undefined;

    const image: Image = imageName
      ? await this.imageService.findByName(imageName)
      : undefined;

    return this.walletRepository.update(id, {
      ...rest,
      currency,
      image,
    });
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
