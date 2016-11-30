#!/bin/bash
set -e # stop on error

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
TARGET_BRANCH="gh-dummy"
BUILD_FOLDER="web-dist"
STAGING_REPO="goldylucks/memory-n-back-staging"
REMOTE="staging"

if [ "$1" = -p ] || [ "$1" = --prod ]; then
  read -r -p "Deploy to production, R U SURE? [y/N] " response
  response=${response,,}    # tolower
  if [[ $response =~ ^(yes|y)$ ]]; then
    echo "ok buddy, let's hope everything works ..."
  else
    echo "smart move, push a tag and let the CI deploy for u :)"
  fi
fi

if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
  echo -e "\n\n\n"
  echo -e "========================================================================"
  echo -e "cannot deploy from ${TARGET_BRANCH}"
  echo -e "please checkout to a different branch first (probably master?)"
  echo -e "========================================================================"
  echo -e "\n\n\n"
fi

# store src commit hash
SHA=`git rev-parse --verify HEAD`

echo "check out fresh branch ${TARGET_BRANCH} ..."
git branch -D "${TARGET_BRANCH}" || true
git checkout -b "${TARGET_BRANCH}"

echo "build web ..."
npm run build:web

# echo "setting git remote ..."
# git remote add origin https://github.com/goldylucks/dual-n-back.git

echo "add ${BUILD_FOLDER} folder"
git add -f "${BUILD_FOLDER}"

echo "commit changes ..."
git commit -m "Deploy to GitHub Pages: ${SHA} [ci skip]"

if [ "$1" = -p ] || [ "$1" = --prod ]; then
  REMOTE=origin
else
  git remote add staging "git@github.com:${STAGING_REPO}.git" || true
fi

echo "push to ${REMOTE} ${TARGET_BRANCH} ..."
git push "${REMOTE}" `git subtree split --prefix ${BUILD_FOLDER}`:"${TARGET_BRANCH}" --force

echo "checkout branch master ..."
git checkout master

echo "delete branch ${TARGET_BRANCH} ..."
git branch -D "${TARGET_BRANCH}"

echo "All done!"