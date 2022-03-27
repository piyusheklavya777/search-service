#!/usr/bin/env bash

# set -e # when an error occurs, halt execution and throw

read -p "please enter a unique name for the s3 buxket containing test data: " uniqueName

if [ -z "$uniqueName" ]
then
    return 1
fi

# Create a s3 bucket with the unique name
aws s3 mb s3://search-service-$uniqueName-824929266396-bucket

# Delete all the objects in the bucket, if it already existed(the create would have failed):
aws s3 rm s3://search-service-$uniqueName-824929266396-bucket --recursive

# # Upload the test files to the created bucket.
aws s3 cp \
    "/Users/piyusheklavya/Desktop/personal-projects/search-service/test/mock-data/data/pdfs" \
    s3://search-service-$uniqueName-824929266396-bucket \
    --recursive 