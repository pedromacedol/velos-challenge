import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CallService } from './call.service';

@Controller('call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post('analysis')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.callService.callAnalysis(file);
  }
}
