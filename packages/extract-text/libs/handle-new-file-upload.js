const { loadFileFromS3 } = require('../../utilities/aws-sdk-utilities');
const {
  writeFileToLocalStorage,
  extractTextFromFile,
} = require('../../utilities/generic-utilities');
const logger = require('../../utilities/logger');
const elasticClient = require('../../elastic');

const handleNewFile = async ({ bucketName, fileName }) => {
  logger.info('new file upoad found: ', { bucketName, fileName });

  const fileBuffer = await loadFileFromS3({ bucketName, fileName });

  const localLocationOfFile = await writeFileToLocalStorage({
    fileBuffer,
    fileName,
  });

  logger.info('file written to', localLocationOfFile);
  const text = await extractTextFromFile({ fileLocation: localLocationOfFile });

  await elasticClient.indexDocument({ indexName: fileName, data: text });

};

module.exports = { handleNewFile };
