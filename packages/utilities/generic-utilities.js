const fs = require('fs');
const path = require('path');
const reader = require('any-text');
const logger = require('./logger');

const loadFileBufferFromPath = async ({ dir, subdir, encoding = 'utf8' }) => {
  const location = path.join(dir, subdir);
  const file = await fs.readFileSync(location);
  return Buffer.from(file, encoding);
};

const writeFileToLocalStorage = async ({
  fileBuffer,
  fileName = 'newFile',
  location = '/tmp/',
}) => {
  if (!fileBuffer)
    throw new Error('InSufficient parameters supplied to function');
  await fs.writeFileSync(`${location}${fileName}`, fileBuffer);
  return `${location}${fileName}`;
};

const extractTextFromFile = async ({ fileLocation }) => {
  if (!fileLocation)
    throw new Error('InSufficient parameters supplied to function');
  try {
    const rawText = await reader.getText(fileLocation);
    logger.info('text retrieved from document successfully');
    return rawText;
  } catch (error) {
    logger.error('Error while extracting raw text from file', error);
  }
};

module.exports = { loadFileBufferFromPath, writeFileToLocalStorage, extractTextFromFile };
