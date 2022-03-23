# Scripts

The scripts folder contains scripts to perform varios actions i.e.
- set the aws credentials to perform the various actions below.
- deploy test data
- deploy the serverless stack
- deploy the proxy service

## Prerequisites
- The variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KE should be exported by the set-credentials script to the parent shell environment,
- Please make sure the IAM policy attacked to the user has permissions for
    - creating buckets in AWS S3 service.
    - uploading files to AWS S3.
    - Describe stacks on cloudFormation to deploy the serverless application