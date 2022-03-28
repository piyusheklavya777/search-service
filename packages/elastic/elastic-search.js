const { Client } = require('@elastic/elasticsearch');

const { ElasticSearchSDKError } = require('../errors/externalErrors');
const logger = require('../utilities/logger');

class ElasticSearch {
  constructor({ url, username, password }) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.elasticClient = new Client();
  }

  async indexDocument({ indexName, data }) {
    if (!indexName || !data || typeof indexName !== 'string')
      throw new ElasticSearchSDKError({
        details:
          'Insufficient/Invalid parameters provided for indexinf document',
      });
    try {
      await this.elasticClient.index({
        index: indexName,
        document: data,
      });
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
      logger.error(`Error while searching with the query ${searchQuery}`, error);
      throw error;
    }
  }
}

module.exports = { ElasticSearch };
