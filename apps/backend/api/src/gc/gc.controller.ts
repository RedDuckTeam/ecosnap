import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { GcService } from './gc.service';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PublicKey } from '@solana/web3.js';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mediaFilter } from '../lib/media-filter/mediaFilter';

export const GC_API_TAG = 'GC';

export class PublishGcDTO {
  @ApiProperty({ type: String, nullable: true, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;
}

const mediaOptions: MulterOptions = {
  limits: { fileSize: 100_000_000 },
  fileFilter: mediaFilter,
};

@Controller('gc')
@ApiTags(GC_API_TAG)
export class GcController {
  constructor(private readonly gcService: GcService) {}

  @Post('/')
  @UseUserAuthGuard()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photos', maxCount: 3 },
        { name: 'videos', maxCount: 2 },
      ],
      mediaOptions
    )
  )
  async postCastVote(
    @Body() { description }: PublishGcDTO,
    @RequestUser() user: UserClaims,
    @UploadedFiles()
    { photos, videos }: { photos?: Express.Multer.File[]; videos?: Express.Multer.File[] }
  ) {
    const gc = await this.gcService.publish({
      publisher: user.pubKey,
      description,
      files: {
        photos: photos ?? [],
        videos: videos ?? [],
      },
    });

    return {
      gcId: gc.id,
    };
  }
}
