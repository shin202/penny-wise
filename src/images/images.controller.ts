import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';
import { StreamingService } from './streaming/streaming.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ImageType } from './image.interface';
import { IconsService } from './icons/icons.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly streamingService: StreamingService,
    private readonly iconService: IconsService,
  ) {}

  @Post()
  @Version('1')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('icons')))
  @UseFilters(DeleteFileOnFailFilter)
  upload(
    @UploadedFiles(ParseFilePipe)
    images: Array<Express.Multer.File>,
  ) {
    return this.uploadService.uploadMultiple(images, ImageType.ICON);
  }

  @Get('icons')
  @Version('1')
  findAllIcons() {
    return this.iconService.findAll();
  }

  @Get(':name')
  @Version('1')
  getImage(
    @Param('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.streamingService.streaming(name, res);
  }
}
