import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import {
  globalConfig,
  httpConfig,
  jwtConfig,
  mailerConfig,
  multerConfig,
  typeormConfig,
} from './config';
import { IsExistsConstraint } from './shared/validation/is-exists.constraint';
import { IsUniqueConstraint } from './shared/validation/is-unique.constraint';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { PasswordResetsModule } from './password-resets/password-resets.module';
import { IsEqualConstraint } from './shared/validation/is-equal.constraint';
import { CurrenciesModule } from './currencies/currencies.module';
import { WalletsModule } from './wallets/wallets.module';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';
import { MulterModule } from '@nestjs/platform-express';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        globalConfig,
        typeormConfig,
        mailerConfig,
        jwtConfig,
        multerConfig,
        httpConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('multer'),
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    AuthModule,
    EmailVerificationModule,
    PasswordResetsModule,
    CurrenciesModule,
    WalletsModule,
    CategoriesModule,
    ImagesModule,
    ExpensesModule,
    IncomesModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [
    Logger,
    IsUniqueConstraint,
    IsExistsConstraint,
    IsEqualConstraint,
  ],
})
export class AppModule {}
