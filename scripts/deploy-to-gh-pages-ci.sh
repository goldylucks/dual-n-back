#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit
# only deploy merges of master
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then exit 0; fi

SHA=`git rev-parse --verify HEAD`

# config git
git config --global user.email "travis@travis-ci.com"
git config --global user.name "Travis CI"

# deploy
npm run build:web
cd web-dist
git init
git add .
git commit -m "Deploy to GitHub Pages: ${SHA}"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -z `git diff --exit-code` ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" master:gh-pages > /dev/null 2>&1
echo "successfully deployed commit ${SHA} to branch gh-pages"
