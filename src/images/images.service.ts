import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  create(createImageDto: CreateImageDto): Promise<Image> {
    const image: Image = this.imageRepository.create(createImageDto);
    return this.imageRepository.save(image);
  }

  findByName(name: string): Promise<Image> {
    return this.imageRepository.findOne({
      where: { name },
    });
  }
}
