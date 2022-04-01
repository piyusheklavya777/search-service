const _ = require('lodash');
const { Client } = require('@elastic/elasticsearch');

const { ElasticSearchSDKError } = require('../errors/externalErrors');
const logger = require('../utilities/logger');
const {
  createFileAttributes,
  getFileAttributes,
} = require('../utilities/aws-sdk-utilities');

class ElasticSearch {
  constructor({
    url, username, password, cloudId,
  }) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.elasticClient = new Client({
      cloud: { id: cloudId },
      auth: { username, password },
    });
  }

  async indexDocument({ fileName, data, bucketName }) {
    let response;
    if (!fileName || !data || typeof fileName !== 'string')
      throw new ElasticSearchSDKError({
        details:
          'Insufficient/Invalid parameters provided for indexing document',
      });

    try {
      response = await this.elasticClient.index({
        index: fileName.toLowerCase(),
        document: { content: data },
      });
      logger.info('document indexing successful. SDK response: ', response);
    } catch (error) {
      logger.error('Error while indexing document', error);
      throw error;
    }
    const elasticId = _.get(response, ['_id']);
    await createFileAttributes({ fileName, bucketName, elasticId });
  }

  async textSearch({ searchQuery }) {
    let response;
    if (typeof searchQuery !== 'string')
      throw new ElasticSearchSDKError({
        details:
          'Insufficient/Invalid parameters provided for indexinf document',
      });
    try {
      response = await this.elasticClient.search({
        q: searchQuery,
      });
      logger.info('response returned from elastic search sdk: ', response);

      const elasticIds = _.map(
        _.get(response, ['hits', 'hits']),
        ({ _id }) => _id,
      );

      logger.info('elastic search ids for all the matches: ', elasticIds);

      const fileAttributes = await Promise.all(
        _.map(elasticIds, (elasticId) => getFileAttributes({ elasticId })),
      );

      logger.info('file Attributes for the search results: ', fileAttributes);
      return fileAttributes;
    } catch (error) {
      logger.error(
        `Error while searching with the query ${searchQuery}`,
        error,
      );
      throw error;
    }
  }
}

module.exports = { ElasticSearch };
