import { Module } from '@nestjs/common';
import { PasswordResetsService } from './password-resets.service';
import { PasswordResetsController } from './password-resets.controller';
import { ForgotService } from './forgot/forgot.service';
import { ResetService } from './reset/reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [PasswordResetsController],
  providers: [PasswordResetsService, ForgotService, ResetService],
})
export class PasswordResetsModule {}
