#!/bin/bash
set -e # stop on error

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
node ./scripts/configGradlew -p # passing -p as first argument to set to production

cd android
./gradlew assembleRelease
cd ..

echo "apk generated"

read -r -p "copy apk to home directory? [Y/n] " response
response=${response,,}    # tolower
if [[ $response =~ ^(yes|y|'')$ ]]; then
  cp ./android/app/build/outputs/apk/app-release.apk .
  echo "apk copied to project root directory"
fi
exit 0

exit 0
