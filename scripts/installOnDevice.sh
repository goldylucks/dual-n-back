#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
node ./scripts/configGradlew $1 # pass -p as first argument to set to production

if [ "$1" = '-p' ]; then
  cd android
  ./gradlew assembleRelease
  cd ..
fi

if [ "$1" = '-p' ]; then
  react-native run-android --variant=release
else
  react-native run-android
fi

exit 0
