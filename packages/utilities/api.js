/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const logger = require('./logger/index');

const getParameters = (event) => {
  const queryStringParameters = _.get(event, 'queryStringParameters');
  const pathParameter = _.get(event, 'pathParameters');

  return {
    queryStringParameters,
    pathParameter,
  };
};

const _buildResponse = ({ statusCode, body }) => ({
  statusCode,
  body: JSON.stringify(body),
});

const buildSuccessOkResponse = (body) => {
  logger.info('returning the response with statusCode 200: ', body);
  return _buildResponse({
    statusCode: '200',
    body: body || 'empty response',
  });
};

const buildExternalFailureResponse = (error) => {
  logger.info(
    `${error.description} occured. Sending response with statuscode ${error.httpCodeMapping}`,
  );
  return _buildResponse({
    statusCode: error.httpCodeMapping,
    body: {
      code: error.code,
      description: error.description,
      details: error.details,
    },
  });
};

const buildInternalFailureResponse = (error) => {
  logger.info('returning the response with statusCode 500: ', error);
  return _buildResponse({
    statusCode: '500',
    body: {
      message:
        'An Internal Error occurred while processing the request. Please contact the development team for remediation',
      details: `${error.details || error.message}`,
    },
  });
};

module.exports = {
  buildSuccessOkResponse,
  buildExternalFailureResponse,
  buildInternalFailureResponse,
  getParameters,
};
