import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerifyTokensService } from './email-verify-tokens.service';

describe('EmailVerifyTokensService', () => {
  let service: EmailVerifyTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerifyTokensService],
    }).compile();

    service = module.get<EmailVerifyTokensService>(EmailVerifyTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
