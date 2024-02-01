import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Transform } from '../common/interceptors/transform.interface';
import { Wallet } from './entities/wallet.entity';
import { UploadService } from '../images/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';
import { WalletGuard } from './wallet.guard';
import { Action } from '../common/constants';
import { RequiresPermission } from '../common/decorators/requires-permission';

@Controller('wallets')
@UseGuards(AuthGuard, WalletGuard)
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Version('1')
  async create(
    @Body() createWalletDto: CreateWalletDto,
    @Req() req: Request & { user: User },
  ): Promise<Transform<Wallet>> {
    const wallet: Wallet = await this.walletService.create(
      createWalletDto,
      req,
    );

    return {
      status: 'success',
      message: 'Wallet created successfully',
      data: wallet,
    };
  }

  @Get()
  @Version('1')
  async findAll(
    @Req() req: Request & { user: User },
  ): Promise<Transform<Wallet[]>> {
    const wallets: Wallet[] = await this.walletService.findAll(req);

    return {
      status: 'success',
      message: 'Wallets retrieved successfully',
      data: wallets,
    };
  }

  @Get(':id')
  @Version('1')
  @RequiresPermission(Action.READ)
  async findOne(@Param('id') id: string) {
    const wallet: Wallet = await this.walletService.findOrFail(+id);

    return {
      status: 'success',
      message: 'Wallet retrieved successfully',
      data: wallet,
    };
  }

  @Patch(':id')
  @Version('1')
  @RequiresPermission(Action.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: Request & { user: User },
  ): Promise<Transform<any>> {
    await this.walletService.update(+id, updateWalletDto, req);

    return {
      status: 'success',
      message: 'Wallet updated successfully',
      data: null,
    };
  }

  @Delete(':id')
  @Version('1')
  @RequiresPermission(Action.DELETE)
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ): Promise<Transform<any>> {
    await this.walletService.remove(+id, req);

    return {
      status: 'success',
      message: 'Wallet deleted successfully',
      data: null,
    };
  }

  @Post('image')
  @Version('1')
  @UseInterceptors(FileInterceptor('image', multerOptions('wallets')))
  @UseFilters(DeleteFileOnFailFilter)
  async uploadImage(@UploadedFile(ParseFilePipe) file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }
}
