const _ = require('lodash');
const AWS = require('aws-sdk');
const logger = require('./logger');

const {
  ACCOUNT_ID,
  TEXT_EXTRACTED_NOTIFICATION_SNS,
  REGION,
  PUBLISH_TO_SNS_ROLE,
} = process.env;

async function listFilesFromS3Bucket({ bucketName }) {
  const s3 = new AWS.S3();
  let response;
  try {
    response = await s3
      .listObjectsV2({
        Bucket: bucketName,
      })
      .promise();
  } catch (e) {
    logger.error(
      'Error occurred while trying to fetch object list from s3: ',
      e,
    );
    return [];
  }
  return response;
}

async function loadFileFromS3({ bucketName, fileName }) {
  const s3 = new AWS.S3();
  let response;
  try {
    response = await s3
      .getObject({
        Bucket: bucketName,
        Key: fileName,
      })
      .promise();
  } catch (e) {
    logger.error('Error occurred while trying to load files from s3: ', e);
  }
  return _.get(response, 'Body');
}

async function startExtractText({ bucketName, fileName }) {
  if (!fileName || !bucketName)
    throw new Error('call to extractText function missing necessary params: ', {
      bucketName,
      fileName,
    });

  logger.info(
    `calling aws textract sdk to find text from the document ${fileName}`,
  );

  const textract = new AWS.Textract();

  const params = {
    DocumentLocation: {
      S3Object: {
        Bucket: bucketName,
        Name: fileName,
      },
    },
    FeatureTypes: ['TABLES', 'FORMS'],
    NotificationChannel: {
      RoleArn: `arn:aws:iam::${ACCOUNT_ID}:role/${PUBLISH_TO_SNS_ROLE}`,
      SNSTopicArn: `arn:aws:sns:${REGION}:${ACCOUNT_ID}:${TEXT_EXTRACTED_NOTIFICATION_SNS}`,
    },
  };

  logger.info('parameters for aws textract startDocumentAnalysis: ', params);

  try {
    const syncResponse = await textract.startDocumentAnalysis(params).promise();
    logger.info('response from AWS Textract', syncResponse);
    return syncResponse;
  } catch (error) {
    logger.silly(
      'error while calling AWS textract startDocumentAnalysis',
      error,
    );
    throw error;
  }
}

module.exports = {
  listFilesFromS3Bucket,
  loadFileFromS3,
  startExtractText,
};
