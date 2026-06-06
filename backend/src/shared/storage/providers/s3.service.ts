import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageServiceInterface } from '../storage.interface';
import { S3_CLIENT } from '../configs/s3.config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { StorageUploadException } from '../exceptions/storage-upload.exception';

@Injectable()
export class S3StorageService implements StorageServiceInterface {
  private readonly bucketName: string;
  private readonly logger = new Logger(S3StorageService.name);
  constructor(
    @Inject(S3_CLIENT)
    private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error(
        `Failed to upload file ${file.originalname}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new StorageUploadException('Failed to upload file', error);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3.send(command);
  }
}
