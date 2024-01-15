import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Transform } from '../common/interceptors/transform.interface';
import { Wallet } from './entities/wallet.entity';

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Post()
  @Version('1')
  async create(
    @Body() createWalletDto: CreateWalletDto,
    @Req() req: Request & { user: User },
  ): Promise<Transform<Wallet>> {
    const wallet: Wallet = await this.walletService.create(
      createWalletDto,
      req,
    );

    return {
      status: 'success',
      message: 'Wallet created successfully',
      data: wallet,
    };
  }

  @Get()
  @Version('1')
  async findAll(
    @Req() req: Request & { user: User },
  ): Promise<Transform<Wallet[]>> {
    const wallets: Wallet[] = await this.walletService.findAll(req);

    return {
      status: 'success',
      message: 'Wallets retrieved successfully',
      data: wallets,
    };
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const wallet: Wallet = await this.walletService.findOne(+id, req);

    return {
      status: 'success',
      message: 'Wallet retrieved successfully',
      data: wallet,
    };
  }

  @Patch(':id')
  @Version('1')
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: Request & { user: User },
  ): Promise<Transform<any>> {
    await this.walletService.update(+id, updateWalletDto, req);

    return {
      status: 'success',
      message: 'Wallet updated successfully',
      data: null,
    };
  }

  @Delete(':id')
  @Version('1')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ): Promise<Transform<any>> {
    await this.walletService.remove(+id, req);

    return {
      status: 'success',
      message: 'Wallet deleted successfully',
      data: null,
    };
  }
}
