#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# config git
git config --global user.email "travis@travis-ci.com"
git config --global user.name "Travis CI"

# deploy
npm run build:web
cd web-dist
git init
git add .
git commit -m "Deploy to Github Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@$github.com/${TRAVIS_REPO_SLUG}.git" master:gh-pages > /dev/null 2>&1

if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then exit 0; fi