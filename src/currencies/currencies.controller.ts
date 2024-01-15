import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Transform } from '../common/interceptors/transform.interface';
import { Currency } from './entities/currency.entity';

@Controller('currencies')
@UseGuards(AuthGuard)
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @Version('1')
  async create(
    @Body() createCurrencyDto: CreateCurrencyDto,
  ): Promise<Transform<Currency>> {
    const currency: Currency =
      await this.currenciesService.create(createCurrencyDto);

    return {
      status: 'success',
      message: 'Currency created successfully',
      data: currency,
    };
  }

  @Get()
  @Version('1')
  async findAll(): Promise<Transform<Currency[]>> {
    const currencies: Currency[] = await this.currenciesService.findAll();

    return {
      status: 'success',
      message: 'Currencies retrieved successfully',
      data: currencies,
    };
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param('id') id: string): Promise<Transform<Currency>> {
    const currency: Currency = await this.currenciesService.findOne(+id);

    return {
      status: 'success',
      message: 'Currency retrieved successfully',
      data: currency,
    };
  }

  @Patch(':id')
  @Version('1')
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Transform<any>> {
    await this.currenciesService.update(+id, updateCurrencyDto);

    return {
      status: 'success',
      message: 'Currency updated successfully',
      data: null,
    };
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: string): Promise<Transform<any>> {
    await this.currenciesService.remove(+id);

    return {
      status: 'success',
      message: 'Currency removed successfully',
      data: null,
    };
  }
}
