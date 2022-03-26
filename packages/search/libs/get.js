const { ResultNotFound } = require('../../errors/externalErrors');
const logger = require('../../utilities/logger');

const get = async ({ queryString }) => {
  logger.info('query string: ', { queryString });
  throw new ResultNotFound({
    details: `No result found for the query string ${queryString}`,
  });
};

module.exports = { get };
