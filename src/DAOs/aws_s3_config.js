const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv").config();

// AWS S3
const clientS3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

exports.module = clientS3;
