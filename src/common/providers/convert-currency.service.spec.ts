import { Test, TestingModule } from '@nestjs/testing';
import { ConvertCurrencyService } from './convert-currency.service';

describe('ConvertCurrencyService', () => {
  let service: ConvertCurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvertCurrencyService],
    }).compile();

    service = module.get<ConvertCurrencyService>(ConvertCurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
