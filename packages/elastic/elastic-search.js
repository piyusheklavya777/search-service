const { Client } = require('@elastic/elasticsearch');

const { ElasticSearchSDKError } = require('../errors/externalErrors');
const logger = require('../utilities/logger');

class ElasticSearch {
  constructor({ url, username, password, cloudId }) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.elasticClient = new Client({
      cloud: { id: cloudId },
      auth: { username, password },
    });
  }

  async indexDocument({ indexName, data }) {
    let response;
    if (!indexName || !data || typeof indexName !== 'string')
      throw new ElasticSearchSDKError({
        details:
          'Insufficient/Invalid parameters provided for indexinf document',
      });

    try {
      response = await this.elasticClient.index({
        index: indexName.toLowerCase(),
        document: { content: data },
      });
      logger.info('document indexing attempted. SDK response: ', response);
    } catch (error) {
      logger.error('Error while indexing document', error);
      throw error;
    }
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
      return response;
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
