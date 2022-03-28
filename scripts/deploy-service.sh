#!/usr/bin/env bash

if [ -z "$uniqueName" ]
then
    return 1
fi

cd ./
sls deploy --stage "${uniqueName}"