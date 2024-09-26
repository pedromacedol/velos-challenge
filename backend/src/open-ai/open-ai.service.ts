import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async createChatCompletion(params: {
    messages: any;
    model: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  }): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        ...params,
      });
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'OpenAI Failed response: ${error.message}',
      );
    }
  }
}
