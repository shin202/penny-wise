import { join } from 'path';
import { createReadStream } from 'fs';
import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from '../images.service';
import { Image } from '../entities/image.entity';
import * as process from 'process';

@Injectable()
export class StreamingService {
  constructor(private readonly imageService: ImagesService) {}

  async streaming(name: string, res: Response): Promise<StreamableFile> {
    const image: Image = await this.imageService.findByName(name);
    const imageStream = createReadStream(
      join(process.cwd(), 'public', image.path),
    );

    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Content-Disposition', `inline; filename=${image.name}`);

    return new StreamableFile(imageStream);
  }
}
