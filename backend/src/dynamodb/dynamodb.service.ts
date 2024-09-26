import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DynamoDBService {
  private dynamoDb: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(private readonly configService: ConfigService) {
    this.dynamoDb = new DynamoDB.DocumentClient({
      region: this.configService.get<string>('DYNAMODB_REGION_NAME'),
      accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
    });
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
  }

  async insertConversation(messages: string): Promise<string> {
    const conversationId = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: {
        conversationId: conversationId,
        Messages: messages,
        CreatedAt: new Date().toISOString(),
      },
    };

    try {
      await this.dynamoDb.put(params).promise();
      return conversationId;
    } catch (error) {
      throw new Error(
        `Error inserting conversation into DynamoDB: ${error.message}`,
      );
    }
  }

  async getConversation(conversationId: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: {
        ConversationId: conversationId,
      },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      return result.Item;
    } catch (error) {
      throw new Error(
        `Error retrieving conversation from DynamoDB: ${error.message}`,
      );
    }
  }
}
