# Describing the project briefly :
- Search Service is a project that lets users look for any text matches from a list of pre defined files uploaded to AWS S3.


# Architecture : 
- The back end service sets up a bucket for this purpose when deployed.
- When files are successfully uploaded to these files, an AWS lambda execution is triggered that downloads the file to it's local file system '/tmp/'. Now a text is extracted from these using a npm package (any-text). 
- The extracted text is then sent to the elastic search cloud server (elastic managed) for inverted indexing, using the elastic search javascript SDK.
- The indexing document id returned by elastic server is a random string but is unique to this upload to elastic from user end.
- A mapping of the file name (and bucket name) and the document Id returned by elastic search is stored in the document db.
- The user is then allowed to search for a string value (nextline characer not allowed) from the file. The application exposes an REST API GET endpoint for this purpose.
- The application upon getting the search request, calls the AWS elastic search api with the term. Elastic search returns the unique document id it had generated while indexing the documents(ones which match the text search).
- The unique id is used to find the file name and bucket name from AWS DynamoDB. Based on these two a link is formed to the file stored in AWS S3.
- The link is returned to the user synchronously over the rest API.

# Work in-progress :
- The application also supports extracting texts from an image, using the amazon offfered OCR service AWS Textract.
- The architecture for it is as follows :
    - The file once uploaded to AWS S3 triggers the lambda service just the same as the above regular feature
    - To activate the AWS textract feature, set the environment variable EXTRACT_TEXT_WITH_AWS_TEXTRACT: true (refer serverless.yml to set env var.)
    - The AWS S3 file location is sent to AWS Textract service and a text analysis is started.
    - AWS textract service extracts texts asynchronously. After the job is done, it needs a way to inform the user, hence it requires a SNS topic name to be passed to it. We have created and passed the TEXT_EXTRACTED_NOTIFICATION_SNS topic to it (refer serverless.yml).
    - Upon completion the aws textract service sends a notification to a AWS SNS Service, and same lambda (name: extract text) which was triggered with s3 image upload is also linked to the SNS topic.
    - Upon getting this notification, the lambda now calls the AWS textract API to get the results of the extraction
    - The work due :
        - Now we need to call the elatic search API similarly to the above regular architecture and save the extracted text.
# Backlog
- Pre check for an already existing file name in dynamo DB. In case it already exists, abort indexing of this file.
- Establish code unit testing coverage
- Integrate pre commit hooks for the service.
- Propose acceptance testing framework.
# Future enhancements
- 1. The storage space can be expanded to other spaces as 1.1 Dropbox, 1.2 Google Drive.
- 2. The partial integration on AWS textract service can be taken up.


# Refer docs