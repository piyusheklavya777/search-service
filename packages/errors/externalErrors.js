/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
class ExternalError extends Error {
  constructor({ description, code, details, httpCodeMapping = '500' }) {
    const errorMessage = `Code: ${code}, details: ${details}, description: ${description}`;
    super(errorMessage);
    this._code = code;
    this._details = details;
    this._description = description;
    this._httpCodeMapping = httpCodeMapping;
  }

  get code() {
    return this._code;
  }

  get description() {
    return this._description;
  }

  get details() {
    return this._details;
  }

  get httpCodeMapping() {
    return this._httpCodeMapping;
  }
}

class RequestParametersMissing extends ExternalError {
  constructor({ details }) {
    super({
      code: 'SS4000',
      description: 'RequestParametersMissing',
      details: details || 'Request parameters are insufficient.',
      httpCodeMapping: '400',
    });
  }
}

class RequestParametersInvalid extends ExternalError {
  constructor({ details }) {
    super({
      code: 'SS4001',
      description: 'RequestParametersInvalid',
      details: details || 'Request parameters provided are invalid',
      httpCodeMapping: '400',
    });
  }
}

class ResultNotFound extends ExternalError {
  constructor({ details }) {
    super({
      code: 'SS4004',
      description: 'ResultNotFound',
      details: details || 'No Results were found',
      httpCodeMapping: '404',
    });
  }
}

class AWSLambdaIllegalInvocation extends ExternalError {
  constructor({ details }) {
    super({
      code: 'SS5001',
      description: 'AWSLambdaIllegalInvocation',
      details:
        details || 'AWS Lambda invoked with illegal/unexpected event object',
      httpCodeMapping: null,
    });
  }
}
class AWSServiceInternalFailure extends ExternalError {
  constructor({ details }) {
    super({
      code: 'SS4022',
      description: 'AWSServiceInternalFailure',
      details:
        details || 'AWS Service malfunction',
      httpCodeMapping: 422,
    });
  }
}

module.exports = {
  AWSServiceInternalFailure,
  AWSLambdaIllegalInvocation,
  RequestParametersMissing,
  RequestParametersInvalid,
  ResultNotFound,
  ExternalError,
};
