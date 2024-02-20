import { Test, TestingModule } from '@nestjs/testing';
import { WalletReportService } from './wallet-report.service';

describe('WalletReportService', () => {
  let service: WalletReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletReportService],
    }).compile();

    service = module.get<WalletReportService>(WalletReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
