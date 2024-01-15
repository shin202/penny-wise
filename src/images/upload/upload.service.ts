import { Injectable } from '@nestjs/common';
import { ImagesService } from '../images.service';
import { Image } from '../entities/image.entity';
import { ImageType } from '../image.interface';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class UploadService {
  constructor(private readonly imageService: ImagesService) {}

  async upload(file: Express.Multer.File): Promise<Transform<Image>> {
    const image: Image = await this.imageService.create({
      name: file.filename,
      mimeType: file.mimetype,
      type: ImageType.IMAGE,
      path: this.getImagePath(file.path),
    });

    return {
      status: 'success',
      message: 'Image uploaded successfully',
      data: image,
    };
  }

  private getImagePath(path: string): string {
    const pathRegex = /uploads\\(?:[\w]+)\\?(?:\w+)\.\w+$/;

    return pathRegex.exec(path)[0];
  }
}
