import { Module } from '@nestjs/common';
import { DataPipelineModule } from 'src/data-pipeline/data-pipeline.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { CallController } from './call.controller';
import { CallService } from './call.service';

@Module({
  imports: [OpenAiModule, DataPipelineModule],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
