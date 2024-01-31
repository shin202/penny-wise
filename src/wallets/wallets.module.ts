import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { CurrenciesModule } from '../currencies/currencies.module';
import { UpdateBalanceService } from './update-balance/update-balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), CurrenciesModule],
  controllers: [WalletsController],
  providers: [WalletsService, UpdateBalanceService],
})
export class WalletsModule {}
