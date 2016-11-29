#!/bin/bash

# Bail on first error
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# dont deploy pull requests, only merges
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo PR detected, bailing
  exit 0;
fi

# dont deploy non master branch
# if [ "$TRAVIS_BRANCH" != "master" ]; then
#   echo not master branch, bailing
#   exit 0;
# fi

REPO=TRAVIS_REPO_SLUG
if [ -z "$var" ]; then
  echo deploying to staging!
  REPO=goldylucks/memory-n-back-staging
if


# store src commit hash
SHA=`git rev-parse --verify HEAD`

# config git
git config --global user.email "admin@travis-ci.com"
git config --global user.name "Travis CI"

# deploy
npm run build:web
cd web-dist
git init
git add .
git commit -m "Deploy to GitHub Pages: ${SHA}"

git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${REPO}.git" master:gh-pages > /dev/null 2>&1
echo "successfully deployed commit ${SHA} to branch gh-pages"
