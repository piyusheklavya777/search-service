const { ElasticSearch } = require('./elastic-search');

const {
  ELASTIC_URL: url,
  ELASTIC_USERNAME: username,
  ELASTIC_PASSWORD: password,
} = process.env;

module.exports = new ElasticSearch({ url, username, password });
