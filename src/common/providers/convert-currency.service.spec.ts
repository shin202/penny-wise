import { Test, TestingModule } from '@nestjs/testing';
import { ConvertCurrencyProvider } from './convert-currency.provider';

describe('ConvertCurrencyService', () => {
  let service: ConvertCurrencyProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvertCurrencyProvider],
    }).compile();

    service = module.get<ConvertCurrencyProvider>(ConvertCurrencyProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
