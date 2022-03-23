const AWS = require('aws-sdk');
const logger = require('./logger');

// AWS.config.update({ region: 'ap-southeast-1' });

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
    logger.error('Error occurred while trying to fetch object list from s3: ', e);
    return [];
  }
  return response;
}

async function loadFileFromS3({ bucketName, fileName }) {
  const s3 = new AWS.S3();
  let response;
  try {
    response = await s3.getObject({
      Bucket: bucketName,
      Key: fileName,
    }).promise();
  } catch (e) {
    logger.error('Error occurred while trying to load files from s3: ', e);
  }
  return response;
}

module.exports = {
  listFilesFromS3Bucket,
  loadFileFromS3,
};
