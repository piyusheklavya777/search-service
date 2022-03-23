// const fs = require('fs');
const _ = require('lodash');

const bucketName = 'apple-search-service';

const {
  listFilesFromS3Bucket,
  loadFileFromS3,
} = require('../../utilities/aws-sdk-utilities');
const logger = require('../../utilities/logger');

const get = async ({ queryString }) => {
  const files = await _loadFilesFromStorageService();
  logger.info('files retrieved', files);
  // const extractedText;
};

async function _loadFilesFromStorageService() {
  const fileList = await listFilesFromS3Bucket({
    bucketName,
  });
  if (!fileList || !fileList.Contents || !Array.isArray(fileList.Contents)) {
    return [];
  }

  const fileNames = _.map(fileList.Contents, ({ Key }) => Key);

  logger.info(`${fileNames.length} files found. Extracting their content.`);

  const filesFromS3Bucket = await Promise.all(
    _.map(fileNames, (file) => loadFileFromS3({ bucketName, fileName: file })),
  );

  return filesFromS3Bucket;
}

// async function _extractText

module.exports = { get };
