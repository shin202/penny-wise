import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { ImageType } from './image.interface';

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

  findInNames(names: string[]): Promise<Image[]> {
    return this.imageRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  findAllIcons(): Promise<Image[]> {
    return this.imageRepository.find({
      where: { type: ImageType.ICON },
    });
  }
}
