import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, ParseFilePipe } from '../config';
import { DeleteFileOnFailFilter } from '../common/filters/delete-file-on-fail.filter';
import { StreamingService } from './streaming/streaming.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('images')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly streamingService: StreamingService,
  ) {}

  @Post()
  @Version('1')
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  @UseFilters(DeleteFileOnFailFilter)
  upload(
    @UploadedFile(ParseFilePipe)
    image: Express.Multer.File,
  ) {
    return this.uploadService.upload(image);
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
