const _ = require('lodash');
const { ResultNotFound } = require('../../errors/externalErrors');
const logger = require('../../utilities/logger');
const elasticClient = require('../../elastic');

const { REGION } = process.env;

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
    const [properResponses, malformedResponses] = _.reduce(
      response,
      (acc, now) => {
        const fileName = _.get(now, ['Item', 'fileName', 'S']);
        const bucketName = _.get(now, ['Item', 'bucketName', 'S']);
        if (!fileName || !bucketName) acc[1].push({ fileName, bucketName });
        else acc[0].push({ fileName, _link: `https://${bucketName}.s3.${REGION}.amazonaws.com/${fileName}` });
        return acc;
      },
      [[], []],
    );
    if (!response || _.isEmpty(response) || properResponses.length === 0)
      throw new ResultNotFound({
        details: `No result found for the query string ${queryString}`,
      });

    logger.info('MALFORED RESPONSES: ', malformedResponses);
    logger.info('GOOD DATA', properResponses);

    return properResponses;
  }
};

module.exports = { get };
