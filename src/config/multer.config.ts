import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { registerAs } from '@nestjs/config';
import { diskStorage } from 'multer';
import { RandomUtils } from '../utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ParseFilePipeBuilder } from '@nestjs/common';

const UPLOAD_DIR = join(__dirname, '../../public/uploads');
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_FILE_TYPES = /image\/(jpg|jpeg|png)$/;

export const ParseFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: ALLOWED_FILE_TYPES,
  })
  .addMaxSizeValidator({
    maxSize: MAX_FILE_SIZE,
    message: 'Maximum file size is 5MB',
  })
  .build({
    errorHttpStatusCode: 400,
  });

export const multerOptions = (dest: string = ''): MulterOptions => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, getDestination(dest));
    },
    filename(req, file, cb) {
      cb(null, generateFileName(file));
    },
  }),
});

const getDestination = (dest: string): string => {
  const dir = join(UPLOAD_DIR, dest);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return dir;
};

const generateFileName = (file: Express.Multer.File): string => {
  const fileName = RandomUtils.generateRandomHex(16);
  const extension = extname(file.originalname);
  return `${fileName}${extension}`;
};

export const multerConfig = registerAs('multer', () => multerOptions());
