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

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mediaFilter } from '../lib/media-filter/mediaFilter';

import { DataSource } from 'typeorm';
import { PublicKey } from '@solana/web3.js';

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
  constructor(
    private readonly gcService: GcService,
    private readonly dataSource: DataSource
  ) {}

  @Get('/submission/last')
  async getLastSubmission() {
    return await this.dataSource.transaction(this.gcService.getLastSubmissions);
  }

  @Get('/:pubkey')
  async getGcs(@Query('pubkey') pubkey: string) {
    console.log(pubkey);
    return { gcs: await this.gcService.getGcsByPubkey({ pubkey: new PublicKey(pubkey) }) };
  }

  @Get('/')
  async getAllGcs() {
    return { gcs: await this.gcService.getGcs() };
  }

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
