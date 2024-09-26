import {
  FileTypeValidator,
  Injectable,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

import { DataPipelineService } from 'src/data-pipeline/data-pipeline.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Injectable()
export class CallService {
  constructor(
    private readonly openAiService: OpenAiService,
    private dataPipelineService: DataPipelineService,
  ) {}

  async callAnalysis(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const transcription: string = await this.dataPipelineService.upload(file);

    const promptCallAnalysis = [
      {
        role: 'system',
        content:
          'Você é um assistente útil que analisa transcrições de chamadas de vendas.',
      },
      {
        role: 'user',
        content: `Analise a seguinte transcrição de chamada e forneça um feedback detalhado em português no formato JSON para ser utilizado como response do backend, e siga rigorosamente este formato:
    
        {
          "score": número de 1 a 10,
          "feedback": {
              "positivo": "Aspectos positivos da chamada",
              "negativo": "Aspectos negativos da chamada"
          },
          "metricas": {
              "duracaoDaLigacao": "Duração da ligação",
              "palavrasPorMinuto": "Número de palavras por minuto",
              "tempoFalando": "Porcentagem do tempo que o vendedor estava falando",
              "tempoOuvindo": "Porcentagem do tempo que o vendedor estava ouvindo"
          },
          "sugestoes": "Sugestões para melhorar o desempenho"
        }
    
        Transcrição da Chamada:
        ${transcription}
        `,
      },
    ];

    const responseAI = await this.openAiService.createChatCompletion({
      messages: promptCallAnalysis,
      model: 'gpt-4o-mini',
      temperature: 1,
      max_tokens: 500,
    });
    const rawContent = responseAI.choices[0].message.content;
    console.log(rawContent);
    try {
      const parsedContent = JSON.parse(rawContent);

      return parsedContent;
    } catch (error) {
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  }
}
