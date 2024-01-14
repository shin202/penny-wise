import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { Transform } from '../common/interceptors/transform.interface';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async create(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<Transform<Currency>> {
    const currency: Currency =
      this.currencyRepository.create(createCurrencyDto);

    const savedCurrency: Currency =
      await this.currencyRepository.save(currency);

    return {
      status: 'success',
      message: 'Currency created successfully',
      data: savedCurrency,
    };
  }

  async findAll(): Promise<Transform<Currency[]>> {
    const currencies: Currency[] = await this.currencyRepository.find();

    return {
      status: 'success',
      message: 'All currencies fetched successfully',
      data: currencies,
    };
  }

  async findOne(id: number): Promise<Transform<Currency>> {
    const currency: Currency = await this.currencyRepository.findOne({
      where: {
        id,
      },
    });

    return {
      status: 'success',
      message: 'Currency fetched successfully',
      data: currency,
    };
  }

  async update(
    id: number,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Transform<any>> {
    const updatedResult = await this.currencyRepository.update(
      id,
      updateCurrencyDto,
    );

    if (updatedResult.affected > 0) {
      return {
        status: 'success',
        message: 'Currency updated successfully',
        data: null,
      };
    }
  }

  async remove(id: number) {
    const deleteResult = await this.currencyRepository.delete(id);

    if (deleteResult.affected > 0) {
      return {
        status: 'success',
        message: 'Currency deleted successfully',
        data: null,
      };
    }
  }
}
