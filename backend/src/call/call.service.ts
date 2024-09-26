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
        content: `Analise a seguinte transcrição de chamada de vendas e forneça um feedback detalhado em português no formato JSON:

        Transcrição:
        ${transcription}

        O feedback deve seguir estritamente este formato JSON, e o JSON deve ser bem formado:

        {
        "score": Um valor entre 1 e 10 de nota geral para o desempenho do vendedor,
        "feedback": { "positivo": "Texto destacando os pontos positivos do vendedor", "negativo": "Texto destacando os pontos que poderiam ser melhorados"}
        "metricas": {
          "duracaoDaLigacao": "Tempo total da ligação em minutos",
          "palavrasPorMinuto": "Velocidade média de fala do representante",
          "tempoFalando": "Porcentagem de tempo que o representante falou",
          "tempoOuvindo": "Porcentagem de tempo que o representante escutou o cliente"
        },
        "sugestões": "Sugestões específicas para melhorar futuras chamadas"
        }

        O JSON deve ser retornado completamente em formato válido e legível.`,
      },
    ];

    const responseAI = await this.openAiService.createChatCompletion({
      messages: promptCallAnalysis,
      model: 'gpt-4o-mini',
      temperature: 1,
      max_tokens: 500,
    });
    const rawContent = responseAI.choices[0].message.content;

    try {
      const parsedContent = JSON.parse(rawContent);

      if (
        parsedContent &&
        typeof parsedContent.score === 'number' &&
        parsedContent.feedback &&
        parsedContent.metricasDaConversa &&
        typeof parsedContent.sugestoesMelhorias === 'string'
      ) {
        return parsedContent;
      } else {
        throw new Error('Invalid JSON structure returned by OpenAI.');
      }
    } catch (error) {
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  }
}
