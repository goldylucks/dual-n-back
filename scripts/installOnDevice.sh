#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
node ./scripts/configGradlew $1 # pass -p as first argument to set to production
cd android
./gradlew assembleRelease
cd ..
react-native run-android --variant=release
exit 0