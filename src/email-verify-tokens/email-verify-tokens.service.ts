import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { CreateEmailVerifyTokenDto } from './dto/create-email-verify-token.dto';
import { UpdateEmailVerifyTokenDto } from './dto/update-email-verify-token.dto';
import { EmailVerifyToken } from './entities/email-verify-token.entity';
import { RandomUtils } from '../utils';
import * as dayjs from 'dayjs';

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

  findAll() {
    return `This action returns all emailVerifyTokens`;
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

  update(id: number, updateEmailVerifyTokenDto: UpdateEmailVerifyTokenDto) {
    return `This action updates a #${id} emailVerifyToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailVerifyToken`;
  }
}
