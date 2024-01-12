import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { CreateEmailVerifyTokenDto } from './dto/create-email-verify-token.dto';
import { EmailVerifyToken } from './entities/email-verify-token.entity';
import { RandomUtils } from '../utils';
import * as dayjs from 'dayjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmailVerifyTokensService {
  constructor(
    @InjectRepository(EmailVerifyToken)
    private readonly emailVerifyTokenRepository: Repository<EmailVerifyToken>,
    private readonly configService: ConfigService,
  ) {}

  create(
    createEmailVerifyTokenDto: CreateEmailVerifyTokenDto,
  ): Promise<EmailVerifyToken> {
    const { userId } = createEmailVerifyTokenDto;
    const emailVerifyTokenTtl: number = this.configService.get<number>(
      'emailVerifyTokenTtl',
    );
    const emailVerifyTokenPayload = {
      user: { id: userId },
      token: RandomUtils.generateRandomHex(),
      expiresAt: dayjs().add(emailVerifyTokenTtl, 'm').toDate(),
    };

    const emailVerifyToken: EmailVerifyToken =
      this.emailVerifyTokenRepository.create(emailVerifyTokenPayload);

    return this.emailVerifyTokenRepository.save(emailVerifyToken);
  }

  findOne(id: number) {
    return `This action returns a #${id} emailVerifyToken`;
  }

  findByToken(token: string): Promise<EmailVerifyToken> {
    return this.emailVerifyTokenRepository.findOne({
      where: {
        token,
      },
      relations: {
        user: true,
      },
    });
  }

  existsByToken(token: string): Promise<boolean> {
    return this.emailVerifyTokenRepository.existsBy({
      token,
    });
  }

  markAsUsed(emailVerifyToken: EmailVerifyToken): Promise<EmailVerifyToken> {
    emailVerifyToken.markAsUsed();
    return this.emailVerifyTokenRepository.save(emailVerifyToken);
  }

  deleteAllByUser(user: User) {
    return this.emailVerifyTokenRepository.remove(user.emailVerifyTokens);
  }
}
