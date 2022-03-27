const { startExtractText } = require('../../utilities/aws-sdk-utilities');
const logger = require('../../utilities/logger');

const startExtraction = async ({ bucketName, fileName }) => {
  logger.info('starting text extraction from : ', { bucketName, fileName });
  await startExtractText({ bucketName, fileName });
};

module.exports = { startExtraction };
