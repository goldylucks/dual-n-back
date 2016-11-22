#!/bin/bash
set -e # stop on error

echo bulid client ...
npm run build:client
echo check out branch gh-pages ...
git checkout -b gh-pages
echo add web-dist folder
git add -f web-dist
echo commit changes
git commit -m "deploy to gh-pages"
echo push to remote gh-pages
git push origin `git subtree split --prefix web-dist`:gh-pages --force
echo checkout branch master
git checkout master
echo delete branch gh-pages
git branch -D gh-pages
echo All done!