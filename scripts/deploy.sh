#!/bin/bash -e
cd /var/www/vtt-creator.com
git reset --hard
git fetch --tags "https://$USERNAME:$PASSWORD@github.com/roballsopp/vtt-creator.git"
git checkout $TAG
yarn
yarn build