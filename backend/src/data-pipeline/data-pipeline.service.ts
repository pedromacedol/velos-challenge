import {
  FileTypeValidator,
  Injectable,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { DataExtractionService } from 'src/data-extraction/data-extraction.service';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class DataPipelineService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly dynamoDbService: DynamoDBService,
    private readonly dataExtractionService: DataExtractionService,
  ) {}

  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const [uploadResponse, extractedMessages] = await Promise.all([
      this.awsS3Service.upload(file.buffer, file.originalname),
      this.dataExtractionService.extractMessages(file.buffer),
    ]);

    const conversationId =
      await this.dynamoDbService.insertConversation(extractedMessages);

    return { conversationId, extractedMessages };
  }
}
