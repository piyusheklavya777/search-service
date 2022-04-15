const _ = require('lodash');
const AWS = require('aws-sdk');
const logger = require('./logger');

const {
  ACCOUNT_ID,
  TEXT_EXTRACTED_NOTIFICATION_SNS,
  REGION,
  PUBLISH_TO_SNS_ROLE,
  DYNAMO_DB_TABLE_NAME,
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
  logger.info(
    `file buffer downloaded successfully from s3 ${bucketName}/${fileName}`,
  );
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
    NotificationChannel: {
      RoleArn: `arn:aws:iam::${ACCOUNT_ID}:role/${PUBLISH_TO_SNS_ROLE}`,
      SNSTopicArn: `arn:aws:sns:${REGION}:${ACCOUNT_ID}:${TEXT_EXTRACTED_NOTIFICATION_SNS}`,
    },
  };

  logger.info('parameters for aws textract startDocumentAnalysis: ', params);

  try {
    const syncResponse = await textract
      .startDocumentTextDetection(params)
      .promise();
    logger.info('response from AWS Textract', syncResponse);
    return syncResponse;
  } catch (error) {
    logger.error(
      'error while calling AWS textract startDocumentAnalysis',
      error,
    );
    throw error;
  }
}

async function getExtractionResult({ jobId }) {
  const textract = new AWS.Textract();

  const params = { JobId: jobId };

  try {
    const data = await textract.getDocumentTextDetection(params).promise();
    logger.info('response from AWS Textract', data);
    return data;
  } catch (error) {
    logger.error('error while calling AWS textract getDocumentAnalysis', error);
    throw error;
  }
}

async function createFileAttributes({ elasticId, fileName, bucketName }) {
  if (!elasticId || !bucketName || !fileName || !DYNAMO_DB_TABLE_NAME)
    throw new Error(
      'Insufficient parameters provided for creating a record in dynamoDB table',
    );

  const params = {
    TableName: DYNAMO_DB_TABLE_NAME,
    Item: {
      elasticId: {
        S: elasticId,
      },
      fileName: {
        S: fileName,
      },
      bucketName: {
        S: bucketName,
      },
    },
  };
  logger.info('item to upload to dynamodb: ', params);

  const dynamoDB = new AWS.DynamoDB();
  let response;
  try {
    response = await dynamoDB.putItem(params).promise();
    logger.info(
      'successfully created record in dynamoDB. SDK response: ',
      response,
    );
    return response;
  } catch (error) {
    logger.error('ERROR while trying to create record in DynamoDB', error);
    throw error;
  }
}

async function getFileAttributes({ elasticId }) {
  if (!elasticId || !DYNAMO_DB_TABLE_NAME)
    throw new Error(
      'Insufficient parameters provided for querying dynamoDB table',
    );
  const dynamoDB = new AWS.DynamoDB();
  const params = {
    TableName: DYNAMO_DB_TABLE_NAME,
    Key: {
      elasticId: { S: elasticId },
    },
  };
  logger.info('Querying dynamoDB with params: ', params);

  let response;
  try {
    response = await dynamoDB.getItem(params).promise();
    logger.info('raw respone form dynamo db', response);
    if (response === {}) return undefined;
    return response;
  } catch (error) {
    logger.error('error while querying data from the dynamoDB table', error);
    throw error;
  }
}

async function checkIfFileNameExists({ fileName }) {
  if (!fileName || !DYNAMO_DB_TABLE_NAME)
    throw new Error(
      'Insufficient parameters provided for querying dynamoDB table',
    );
  const dynamoDB = new AWS.DynamoDB();
  const params = {
    TableName: DYNAMO_DB_TABLE_NAME,
    Key: {
      fileName: { S: fileName },
    },
  };
  logger.info('Querying dynamoDB with params: ', params);

  let response;
  try {
    response = await dynamoDB.getItem(params).promise();
    logger.info('raw respone form dynamo db', response);
    if (response === {}) return undefined;
    return response;
  } catch (error) {
    logger.error('error while querying data from the dynamoDB table', error);
    throw error;
  }
}

module.exports = {
  listFilesFromS3Bucket,
  getExtractionResult,
  loadFileFromS3,
  startExtractText,
  createFileAttributes,
  getFileAttributes,
  checkIfFileNameExists,
};
