export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
});
