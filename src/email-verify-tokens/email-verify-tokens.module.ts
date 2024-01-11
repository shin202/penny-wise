import { Module } from '@nestjs/common';
import { EmailVerifyTokensService } from './email-verify-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerifyToken } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerifyToken])],
  controllers: [],
  providers: [EmailVerifyTokensService],
  exports: [EmailVerifyTokensService],
})
export class EmailVerifyTokensModule {}
