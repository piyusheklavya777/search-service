const util = require('util');
/* eslint-disable no-console */
class Logger {
  constructor() {
    this.context = {};
  }

  async info(message, details) {
    console.log({
      message,
      details,
      context: this.context,
    });
  }

  async error(message, details) {
    console.log({
      message,
      details,
      context: this.context,
    });
  }

  async silly(message, details) {
    console.log(util.inspect({
      message,
      details,
      context: this.context,
    }));
  }

  async updateContext(properties) {
    this.context = { ...this.context, ...properties };
  }

  async clearContext() {
    this.context = {};
  }
}

module.exports = Logger;
