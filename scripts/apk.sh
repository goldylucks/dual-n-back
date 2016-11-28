#!/bin/bash
set -e # stop on error

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
node ./scripts/configGradlew -p # pass -p as first argument to set to production

cd android
./gradlew assembleRelease
cd ..

echo successfully generated apk

exit 0
