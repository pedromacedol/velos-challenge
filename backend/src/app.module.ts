import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { CallModule } from './call/call.module';
import { configuration } from './config/configuration';
import { DataExtractionModule } from './data-extraction/data-extraction.module';
import { DataPipelineModule } from './data-pipeline/data-pipeline.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { OpenAiModule } from './open-ai/open-ai.module';

@Module({
  imports: [
    AwsS3Module,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      load: [configuration],
    }),
    DataExtractionModule,
    DataPipelineModule,
    DynamodbModule,
    OpenAiModule,
    CallModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
