const { get } = require('../../../../../packages/search/libs/get');
const {
  listFilesFromS3Bucket,
  loadFileFromS3,
} = require('../../../../../packages/utilities/aws-sdk-utilities');

jest.mock('../../../../../packages/utilities/aws-sdk-utilities');

describe('when search library is called ', () => {
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
    loadFileFromS3.mockImplementationOnce(() =>
      Promise.resolve({
        AcceptRanges: 'bytes',
        LastModified: '2022-03-23T13:08:57.000Z',
        ContentLength: 53760,
        ETag: '"42613201d48b13cab91b6ff6953a88fc"',
        ContentType: 'application/msword',
        Metadata: {},
        Body: 'data buffer will be receiced here', // actual: <Buffer d0 cf 11 e0 a1 00 00 00 00 00 00 00 00 01 00 00 00 63 00 ... 53710 more bytes>
      }),
    );
    loadFileFromS3.mockImplementationOnce(() =>
      Promise.resolve({
        AcceptRanges: 'bytes',
        LastModified: '2022-03-23T13:08:58.000Z',
        ContentLength: 6098,
        ETag: '"42613201d48b13cab91b6ff695335gy6"',
        ContentType: 'application/msword',
        Metadata: {},
        Body: 'data buffer will be receiced here', // actual: <Buffer d0 cf 11 e0 a1 00 fe ff 09 00 06 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 63 00 ... 53710 more bytes>
      }),
    );
    try {
      response = await get({ queryString: 'applepie' });
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
    expect(listFilesFromS3Bucket).toBeCalledWith({
      bucketName: 'apple-search-service',
    });
    expect(response).toEqual(['fileOne.txt', 'fileTwo.pdf']);
  });
  test({});
});
