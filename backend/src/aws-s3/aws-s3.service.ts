import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get<string>('AWS_S3_REGION');
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async upload(file: Buffer, fileName: string) {
    const contentType = 'application/pdf';

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    try {
      const response = await this.client.send(new PutObjectCommand(params));
      this.logger.log(`File uploaded successfully: ${fileName}`);
      return response;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new Error('File upload failed');
    }
  }
}
