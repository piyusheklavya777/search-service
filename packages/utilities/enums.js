const AWSEventSource = Object.freeze({
  S3: 'aws:s3',
  SNS: 'aws:sns',
});

const AWSServices = Object.freeze({
  S3: 'S3',
  SNS: 'SNS',
});
module.exports = { AWSEventSource, AWSServices };
