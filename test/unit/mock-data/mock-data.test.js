const fs = require('fs');
const path = require('path');
const logger = require('../../../packages/utilities/logger/index');

describe('the mock data folder', () => {
  let error;
  let response;
  afterEach(() => {
    error = undefined;
  });
  const filesToCheck = [
    '../../mock-data/data/text-file-one.txt',
    '../../mock-data/data/text-file-two.txt',
    '../../mock-data/data/pdf-file-one.pdf',
    '../../mock-data/data/pdf-file-two.pdf',
  ];

  test('should contain the expected test files', async () => {
    try {
      filesToCheck.map((file) => {
        const fileLocation = path.join(__dirname,file);
        if (!fs.existsSync(fileLocation)) {
          throw new Error(`test file missing: ${fileLocation}`);
        }
      });
    } catch (e) {
        logger.info(e);
       error = e;
    }
    expect(error).toBeUndefined();
  });
});
