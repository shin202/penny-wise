import { ImageType } from '../image.interface';

export class CreateImageDto {
  name: string;
  path: string;
  type: ImageType;
  mimeType: string;
}
