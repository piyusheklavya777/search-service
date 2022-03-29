const { ElasticSearch } = require('./elastic-search');

const {
  ELASTIC_URL: url,
  ELASTIC_USERNAME: username,
  ELASTIC_PASSWORD: password,
  ELASTIC_CLOUD_ID: cloudId,
  API_KEY: apiKey,
} = process.env;

module.exports = new ElasticSearch({ url, username, password, cloudId, apiKey });
