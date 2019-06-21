#!/bin/bash -e
cd /var/www/vtt-creator.com
git fetch --tags "https://$USERNAME:$PASSWORD@github.com/roballsopp/vtt-creator.git"
git checkout $TAG
yarn
yarn build