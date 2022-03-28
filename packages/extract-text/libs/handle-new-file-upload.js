const { loadFileFromS3 } = require('../../utilities/aws-sdk-utilities');
const {
  writeFileToLocalStorage,
  extractTextFromFile,
} = require('../../utilities/generic-utilities');
const logger = require('../../utilities/logger');

const handleNewFile = async ({ bucketName, fileName }) => {
  logger.info('new file upoad found: ', { bucketName, fileName });

  const fileBuffer = await loadFileFromS3({ bucketName, fileName });
  logger.info('fileBuffer', fileBuffer);
  const localLocationOfFile = await writeFileToLocalStorage({
    fileBuffer,
    fileName,
  });
  logger.info('file written to', localLocationOfFile);
  const textArray = await extractTextFromFile({ fileLocation: localLocationOfFile });
  logger.info(textArray);
};

module.exports = { handleNewFile };
