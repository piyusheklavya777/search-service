const _ = require('lodash');
const logger = require('../../utilities/logger');
const { AWSEventSource, AWSServices } = require('../../utilities/enums');
const {
  AWSLambdaIllegalInvocation,
  AWSServiceInternalFailure,
} = require('../../errors/externalErrors');
const { handleExtractedText } = require('../libs/get-extracted-text');
const { handleNewFile } = require('../libs/handle-new-file-upload');
const { startExtraction } = require('../libs/start-extraction');

const handler = async (event, context) => {
  logger.info('lambda event: ', event);
  logger.info('lambda context', context);
  try {
    const invocationSource = _findInvocationSource(event);
    if (invocationSource === AWSServices.S3) {
      const fileName = _.get(event, ['Records', '0', 's3', 'object', 'key']);
      const bucketName = _.get(event, ['Records', '0', 's3', 'bucket', 'name']);

      logger.info('New file upload detected.', { bucketName, fileName });
      const { EXTRACT_TEXT_WITH_AWS_TEXTRACT } = process.env;
      if (EXTRACT_TEXT_WITH_AWS_TEXTRACT === 'true') {
        logger.info('text extractio redirecting to aws textract');
        await startExtraction({ bucketName, fileName });
      } else {
        logger.info('handling text extraction locally');
        await handleNewFile({ bucketName, fileName });
      }
    } else if (invocationSource === AWSServices.SNS)
      await _handleAsyncTextExtractCompleteNotification(event);
  } catch (error) {
    logger.error('An error occurred while processing the event', error);
  }

  function _findInvocationSource() {
    const eventSource =
      _.get(event, ['Records', '0', 'eventSource']) ||
      _.get(event, ['Records', '0', 'EventSource']);
    logger.info(`invoked by: ${eventSource}`);
    if (eventSource === AWSEventSource.S3) return AWSServices.S3;
    if (eventSource === AWSEventSource.SNS) return AWSServices.SNS;
    throw new AWSLambdaIllegalInvocation({
      details: `lambda invoked with illegal eventSource: ${eventSource}`,
    });
  }
};

// helper functions
/**
 * When SNS notification comes for the asynchronous text detection operation done by AWS Textract, this lambda gets the results from textract
 * and processes it.
 */
async function _handleAsyncTextExtractCompleteNotification(event) {
  const message = JSON.parse(_.get(event, ['Records', '0', 'Sns', 'Message']));
  const jobId = _.get(message, 'JobId');
  const status = _.get(message, 'Status');
  const fileName = _.get(message, ['DocumentLocation', 'S3ObjectName']);
  const bucketName = _.get(message, ['DocumentLocation', 'S3Bucket']);
  logger.info('AWS Textract response: ', {
    jobId,
    status,
    fileName,
    bucketName,
  });
  if (status !== 'SUCCEEDED')
    throw new AWSServiceInternalFailure({
      details: `The file ${fileName} at ${bucketName} is could not be processed`,
    });
  await handleExtractedText({
    jobId,
    fileName,
    bucketName,
  });
}

module.exports = { handler };
