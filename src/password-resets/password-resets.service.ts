import { Injectable } from '@nestjs/common';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RandomUtils } from '../utils';

@Injectable()
export class PasswordResetsService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {}

  create(createPasswordResetDto: CreatePasswordResetDto) {
    const { email } = createPasswordResetDto;
    const passwordReset: PasswordReset = this.passwordResetRepository.create({
      email,
      token: RandomUtils.generateRandomHex(),
    });

    return this.passwordResetRepository.save(passwordReset);
  }
}
