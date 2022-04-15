/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-inner-declarations */
const _ = require('lodash');
const { RequestParametersMissing, RequestParametersInvalid, ExternalError } = require('../../errors/externalErrors');
const {
  buildSuccessOkResponse,
  buildInternalFailureResponse,
  getParameters,
  buildExternalFailureResponse,
} = require('../../utilities/api');
const logger = require('../../utilities/logger');
const { get } = require('../libs/get');

const handler = async (event, _context) => {
  let response;
  let queryString;
  try {
    logger.info('lambda event: ', event);
    const { queryStringParameters } = getParameters(event);

    queryString = _.get(queryStringParameters, 'q');

    logger.info('query String: ', queryString);

    if (queryString === undefined) {
      throw new RequestParametersMissing({
        details: 'The search query is missing the search term',
      });
    }

    if (_isInvalidSearchTerm()) {
      throw new RequestParametersInvalid({
        details: 'The search term provided is invalid',
      });
    }

    response = await get({ queryString });

    return buildSuccessOkResponse({
      data: response,
      metadata: {
        request: { queryStringParameters },
      },
    });

    function _isInvalidSearchTerm() {
      return ['', ' '].includes(queryString);
    }
  } catch (error) {
    logger.error('Uh Oh ! Error occurred while processing the request', error);
    if (error instanceof ExternalError)
      return buildExternalFailureResponse(error);
    return buildInternalFailureResponse(error);
  }
};

module.exports = { handler };
