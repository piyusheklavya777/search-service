const _ = require('lodash');
const { ResultNotFound } = require('../../errors/externalErrors');
const logger = require('../../utilities/logger');
const elasticClient = require('../../elastic');

const get = async ({ queryString }) => {
  let response;

  try {
    logger.info('query string: ', { queryString });
    response = await elasticClient.textSearch({ searchQuery: queryString });
    logger.info('raw response: ', response);

    return _translateResponse();
  } catch (error) {
    logger.error('error while trying to search for the query string', error);
    throw error;
  }
  function _translateResponse() {
    const hits = _.get(response, ['hits', 'total', 'value'], 0);
    const results = _.get(response, ['hits', 'hits'], []);
    if (!hits || hits === '0' || results.length === 0)
      throw new ResultNotFound({
        details: `No result found for the query string ${queryString}`,
      });

    return results;
  }
};

module.exports = { get };
