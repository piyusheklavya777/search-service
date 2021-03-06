#!/usr/bin/env bash

# This file runs all the scripts needed

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

read -p "please enter a unique stage name: " uniqueName

if [ -z "$uniqueName" ]
then
    return 1
fi

chmod +x ${__dir}/set-credentials.sh
chmod +x ${__dir}/deploy-service.sh
chmod +x ${__dir}/deploy-test-data.sh
chmod +x ${__dir}/deploy-proxy.sh

. ${__dir}/set-credentials.sh
. ${__dir}/deploy-service.sh
. ${__dir}/deploy-test-data.sh
. ${__dir}/deploy-proxy.sh
