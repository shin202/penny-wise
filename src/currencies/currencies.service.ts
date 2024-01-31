import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const currency: Currency =
      this.currencyRepository.create(createCurrencyDto);

    return this.currencyRepository.save(currency);
  }

  findAll(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  findOne(id: number): Promise<Currency> {
    return this.currencyRepository.findOne({
      where: { id },
    });
  }

  findByCode(code: string): Promise<Currency> {
    return this.currencyRepository.findOne({
      where: { code },
    });
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyRepository.update(id, updateCurrencyDto);
  }

  remove(id: number) {
    return this.currencyRepository.delete(id);
  }
}
