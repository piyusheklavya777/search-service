const {
  handler,
} = require('../../../../../packages/extract-text/lambda/extract');
const {
  handleExtractedText,
} = require('../../../../../packages/extract-text/libs/get-extracted-text');
const { handleNewFile } = require('../../../../../packages/extract-text/libs/handle-new-file-upload');
const {
  startExtraction,
} = require('../../../../../packages/extract-text/libs/start-extraction');

jest.mock('../../../../../packages/extract-text/libs/start-extraction');
jest.mock('../../../../../packages/extract-text/libs/get-extracted-text');
jest.mock('../../../../../packages/extract-text/libs/handle-new-file-upload');

describe('when the extract lambda is invoked', () => {
  let error;
  let response;
  beforeEach(() => {
    error = undefined;
    response = undefined;
    jest.clearAllMocks();
    jest.resetAllMocks();
    process.env = {};
  });
  describe('when the invocation source is aws s3', () => {
    test('if aws textract functionality is enabled', async () => {
      process.env.EXTRACT_TEXT_WITH_AWS_TEXTRACT = 'true';
      try {
        const event = {
          Records: [
            {
              eventVersion: '2.1',
              eventSource: 'aws:s3',
              awsRegion: 'ap-southeast-1',
              eventTime: '2022-03-26T21:49:11.438Z',
              eventName: 'ObjectCreated:Put',
              userIdentity: {
                principalId: 'AWS:AIDA4AEM5VLOCO2F3IWG4',
              },
              requestParameters: {
                sourceIPAddress: '122.167.45.45',
              },
              responseElements: {
                'x-amz-request-id': '40S5A8F7NV1FYQZD',
                'x-amz-id-2':
                  'kOJN69jQbMnGiYqKxji8QsHB3Ec6N6LcIEddr/9ppcs7LLbJMzgoch4lKg0trTWSnKvjX+GSgFVuNLfwmQkF2KvRbiBtA5mb',
              },
              s3: {
                s3SchemaVersion: '1.0',
                configurationId:
                  'search-service-apple-extractText-68a737133cefb25bff959852b8f04754',
                bucket: {
                  name: 'search-service-apple-824929266396-bucket',
                  ownerIdentity: {
                    principalId: 'A3G5AKHROFS09V',
                  },
                  arn: 'arn:aws:s3:::search-service-apple-824929266396-bucket',
                },
                object: {
                  key: 'pfdFileOne.pdf',
                  size: 141952,
                  eTag: '2c0c20dcf84a68f0db8e8916351d65f7',
                  sequencer: '00623F8A56CAC33D2A',
                },
              },
            },
          ],
        };
        response = await handler(event, {});
      } catch (e) {
        error = e;
      }
      expect(error).toBeUndefined();
      expect(response).toBeUndefined();
      expect(handleNewFile).toBeCalledTimes(0);
      expect(startExtraction).toBeCalledTimes(1);
      expect(startExtraction).toBeCalledWith({
        bucketName: 'search-service-apple-824929266396-bucket',
        fileName: 'pfdFileOne.pdf',
      });
    });
    test('if aws textract functionality is disabled', async () => {
      try {
        const event = {
          Records: [
            {
              eventVersion: '2.1',
              eventSource: 'aws:s3',
              awsRegion: 'ap-southeast-1',
              eventTime: '2022-03-26T21:49:11.438Z',
              eventName: 'ObjectCreated:Put',
              userIdentity: {
                principalId: 'AWS:AIDA4AEM5VLOCO2F3IWG4',
              },
              requestParameters: {
                sourceIPAddress: '122.167.45.45',
              },
              responseElements: {
                'x-amz-request-id': '40S5A8F7NV1FYQZD',
                'x-amz-id-2':
                  'kOJN69jQbMnGiYqKxji8QsHB3Ec6N6LcIEddr/9ppcs7LLbJMzgoch4lKg0trTWSnKvjX+GSgFVuNLfwmQkF2KvRbiBtA5mb',
              },
              s3: {
                s3SchemaVersion: '1.0',
                configurationId:
                  'search-service-apple-extractText-68a737133cefb25bff959852b8f04754',
                bucket: {
                  name: 'search-service-apple-824929266396-bucket',
                  ownerIdentity: {
                    principalId: 'A3G5AKHROFS09V',
                  },
                  arn: 'arn:aws:s3:::search-service-apple-824929266396-bucket',
                },
                object: {
                  key: 'pfdFileOne.pdf',
                  size: 141952,
                  eTag: '2c0c20dcf84a68f0db8e8916351d65f7',
                  sequencer: '00623F8A56CAC33D2A',
                },
              },
            },
          ],
        };
        response = await handler(event, {});
      } catch (e) {
        error = e;
      }
      expect(error).toBeUndefined();
      expect(response).toBeUndefined();
      expect(startExtraction).toBeCalledTimes(0);
      expect(handleNewFile).toBeCalledTimes(1);
      expect(handleNewFile).toBeCalledWith({
        bucketName: 'search-service-apple-824929266396-bucket',
        fileName: 'pfdFileOne.pdf',
      });
    });
  });

  test('when the invocation source is aws sns', async () => {
    try {
      const event = {
        Records: [
          {
            EventSource: 'aws:sns',
            EventVersion: '1.0',
            EventSubscriptionArn:
              'arn:aws:sns:ap-southeast-1:824929266396:AmazonTextract-apple-text-extracted-notification:2b085979-b900-442e-8b10-ad4aceab98c3',
            Sns: {
              Type: 'Notification',
              MessageId: 'fe481cd9-dff1-5453-930c-46605ee53ce8',
              TopicArn:
                'arn:aws:sns:ap-southeast-1:824929266396:AmazonTextract-apple-text-extracted-notification',
              Subject: null,
              Message:
                '{"JobId":"074b689acea5557d0e670801b80fa277d7d34bbf423c2696a5a9e747c9a7143b","Status":"SUCCEEDED","API":"StartDocumentAnalysis","Timestamp":1648328404900,"DocumentLocation":{"S3ObjectName":"pfdFileOne.pdf","S3Bucket":"search-service-apple-824929266396-bucket"}}',
              Timestamp: '2022-03-26T21:00:04.958Z',
              SignatureVersion: '1',
              Signature:
                'Q2s+LeI21D/xEHNdgqToapHNN9Ki8fnpYGz37byWJWrgDwuG+kky8FFFWBe6o4jEqx5kgzGkNRRg7pqyAui6leMX8YcpWol2ObXDtqj+0Pq/cX1A8PwSmpFA024OyVp1UffSbSk6qQRfKhHyB2Xh4B0DIlb+AgCNAEV6kfd4lUzGiOMS7EdSGk8bLG2DeUNzgL/me0qaa4k8j9iJNXSmPJLD1nVJ2gSXxMao1DFd+c9MzTUSqIaqGxuCNdHZmIizSta1ipJ07l1t8gsxyzB3yMwOXRqunf47XqhKCTBnrJgD//Z7pQDKstz65dJ9VbI7Alm3lHciQnspnX0RiG9uZA==',
              SigningCertUrl:
                'https://sns.ap-southeast-1.amazonaws.com/SimpleNotificationService-7ff5318490ec183fbaddaa2a969abfda.pem',
              UnsubscribeUrl:
                'https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:824929266396:AmazonTextract-apple-text-extracted-notification:2b085979-b900-442e-8b10-ad4aceab98c3',
              MessageAttributes: {},
            },
          },
        ],
      };
      response = await handler(event, {});
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
    expect(response).toBeUndefined();
    expect(startExtraction).toBeCalledTimes(0);
    expect(handleExtractedText).toBeCalledTimes(1);
    expect(handleExtractedText).toBeCalledWith({
      jobId: '074b689acea5557d0e670801b80fa277d7d34bbf423c2696a5a9e747c9a7143b',
      bucketName: 'search-service-apple-824929266396-bucket',
      fileName: 'pfdFileOne.pdf',
    });
  });
});
