import { HttpException, HttpStatus } from '@nestjs/common';

export const mediaFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|avi|mp4|webm)/))) {
    callback(new HttpException('Invalid media type!', HttpStatus.UNPROCESSABLE_ENTITY), false);
  } else {
    callback(null, true);
  }
};
