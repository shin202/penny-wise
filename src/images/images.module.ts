import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UploadService } from './upload/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { StreamingService } from './streaming/streaming.service';
import { IconsService } from './icons/icons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService, UploadService, StreamingService, IconsService],
  exports: [ImagesService, UploadService],
})
export class ImagesModule {}
