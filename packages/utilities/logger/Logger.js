const util = require('util');
/* eslint-disable no-console */
class Logger {
  constructor() {
    this.context = {};
  }

  async info(message, details = {}) {
    console.log(
      util.inspect(
        {
          message,
          details,
          context: this.context,
        },
        false,
        null,
        true,
      ),
    );
  }

  async error(message, details = {}) {
    console.log(
      util.inspect(
        {
          message,
          details,
          context: this.context,
        },
        false,
        null,
        true,
      ),
    );
  }

  async silly(message, details = {}) {
    console.log(
      util.inspect(
        {
          message,
          details,
          context: this.context,
        },
        false,
        null,
        true,
      ),
    );
  }

  async updateContext(properties = {}) {
    this.context = { ...this.context, ...properties };
  }

  async clearContext() {
    this.context = {};
  }
}

module.exports = Logger;
