import { Injectable } from '@nestjs/common';
import { ImagesService } from '../images.service';
import { Transform } from '../../common/interceptors/transform.interface';
import { Image } from '../entities/image.entity';

@Injectable()
export class IconsService {
  constructor(private readonly imageService: ImagesService) {}

  async findAll(): Promise<Transform<Image[]>> {
    const icons: Image[] = await this.imageService.findAllIcons();

    return {
      status: 'success',
      message: 'Icons retrieved successfully',
      data: icons,
    };
  }
}
