import { Module } from '@nestjs/common';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { DataExtractionModule } from 'src/data-extraction/data-extraction.module';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { DataPipelineService } from './data-pipeline.service';

@Module({
  imports: [AwsS3Module, DataExtractionModule, DynamodbModule],
  providers: [DataPipelineService],
  exports: [DataPipelineService],
})
export class DataPipelineModule {}
