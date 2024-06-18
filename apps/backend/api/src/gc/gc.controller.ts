import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { GcService } from './gc.service';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { DataSource } from 'typeorm';

export const GC_API_TAG = 'GC';

export class PublishGcDTO {
  @ApiProperty({ type: String, nullable: true, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;
}

const fileValidationPipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|avi|mp4|webm)/,
  })
  .addMaxSizeValidator({
    maxSize: 100_000_000, // 100mb
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

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

  @Post('/')
  @UseUserAuthGuard()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 2 },
      { name: 'videos', maxCount: 3 },
    ])
  )
  async postCastVote(
    @Body() { description }: PublishGcDTO,
    @RequestUser() user: UserClaims,
    @UploadedFiles(fileValidationPipe)
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
