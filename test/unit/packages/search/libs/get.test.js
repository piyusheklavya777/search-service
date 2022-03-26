const { get } = require('../../../../../packages/search/libs/get');
const {
  listFilesFromS3Bucket,
  loadFileFromS3,
} = require('../../../../../packages/utilities/aws-sdk-utilities');

const { loadFileBufferFromPath } = require('../../../../../packages/utilities/generic-utilities');

jest.mock('../../../../../packages/utilities/aws-sdk-utilities');

describe.skip('when search library is called ', () => {
  let error;
  let response;
  beforeEach(() => {
    error = undefined;
    response = undefined;
  });
  test('the aws sdk utilities should be called with proper values', async () => {
    listFilesFromS3Bucket.mockImplementationOnce(() =>
      Promise.resolve({
        IsTruncated: false,
        Contents: [
          {
            Key: 'fileOne.txt',
            LastModified: '2022-03-22T13:51:32.000Z',
            ETag: '"194577a7e20bdcc7afbb718f502c134c"',
            ChecksumAlgorithm: [],
            Size: 6148,
            StorageClass: 'STANDARD',
          },
          {
            Key: 'fileTwo.pdf',
            LastModified: '2022-03-22T07:43:02.000Z',
            ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
            ChecksumAlgorithm: [],
            Size: 0,
            StorageClass: 'STANDARD',
          },
        ],
        Name: 'apple-search-service',
        Prefix: '',
        MaxKeys: 1000,
        CommonPrefixes: [],
        KeyCount: 7,
      }),
    );
    const fileOneBuffer = await loadFileBufferFromPath({ // <Buffer d0 cf 11 e0 a1 00 00 00 00 00 00 00 00 01 00 00 00 63 00 ... 53710 more bytes>
      dir: __dirname,
      subdir: '../../../../mock-data/data/textFileOne.doc',
    });

    const fileTwoBuffer = await loadFileBufferFromPath({
      dir: __dirname,
      subdir: '../../../../mock-data/data/textFileTwo.doc',
    });

    loadFileFromS3.mockImplementationOnce(() =>
      Promise.resolve(fileOneBuffer),
    );
    loadFileFromS3.mockImplementationOnce(() =>
      Promise.resolve(fileTwoBuffer),
    );
    try {
      response = await get({ queryString: 'applepie' });
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
    expect(listFilesFromS3Bucket).toBeCalledTimes(1);
    expect(listFilesFromS3Bucket).toBeCalledWith({
      bucketName: 'apple-search-service',
    });
    expect(loadFileFromS3).toBeCalledTimes(2);
    expect(loadFileFromS3).toBeNthCalledWith(1, { bucketName: 'apple-search-service', fileName: 'fileOne.txt' });
    expect(loadFileFromS3).toBeNthCalledWith(2, { bucketName: 'apple-search-service', fileName: 'fileTwo.txt' });
    expect(response).toEqual(['fileOne.txt', 'fileTwo.pdf']);
  });
  // test({});
});
