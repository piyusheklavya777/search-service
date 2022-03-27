/* eslint-disable consistent-return */
const { getExtractionResult } = require('../../utilities/aws-sdk-utilities');
const logger = require('../../utilities/logger');

const handleExtractedText = async ({ jobId, fileName, bucketName }) => {
  if (!jobId || !fileName || !bucketName) {
    logger.info('Inufficient parameters received', {
      jobId,
      fileName,
      bucketName,
    });
    return;
  }

  const data = await getExtractionResult({ jobId });
  logger.info(data);
};

module.exports = { handleExtractedText };
