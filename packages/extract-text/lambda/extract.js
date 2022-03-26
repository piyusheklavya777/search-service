const logger = require('../../utilities/logger');

const handler = (event, context) => {
  try {
    logger.info('lambda event: ', event);
    logger.info('lambda context', context);
  } catch (e) {
    logger.error('An error occurred while processing the event', e);
  }
};

module.exports = { handler };
