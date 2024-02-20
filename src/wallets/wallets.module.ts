import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { CurrenciesModule } from '../currencies/currencies.module';
import { UpdateBalanceService } from './update-balance/update-balance.service';
import { WalletReportService } from './wallet-report/wallet-report.service';
import { CalculateTotalBalanceService } from './wallet-report/calculate-total-balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), CurrenciesModule],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    UpdateBalanceService,
    CalculateTotalBalanceService,
    WalletReportService,
  ],
  exports: [WalletsService],
})
export class WalletsModule {}
