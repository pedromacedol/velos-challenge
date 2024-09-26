import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataExtractionService {
  private async extractContent(file: Buffer) {
    const fileBlob = new Blob([file], { type: 'application/pdf' });

    const pdfLoader = new PDFLoader(fileBlob);
    const documents = await pdfLoader.load();

    return documents.reduce((acc, doc) => acc + doc.pageContent + '\n', '');
  }

  async extractMessages(file: Buffer) {
    const fileContent = await this.extractContent(file);

    const lines = fileContent.split('\n').filter((line) => line.trim());

    let isUserTurn = true;
    const messages = lines.map((line) => {
      const role = isUserTurn ? 'Agent' : 'Customer';
      isUserTurn = !isUserTurn;
      return `${role}: ${line}`;
    });

    return messages.join('\n');
  }
}
