#!/bin/bash
GIT_COMMIT_DESC=$(git log -1 --pretty=%B "${CIRCLE_SHA1:?}")

printf "Git commit message: %s\n\n" "${GIT_COMMIT_DESC}"

# Setup Git credentials
if [[ ${CI} = true ]];then
  echo "in CI environment"
  git config --global user.email "devmailbox+circleci@debanke.com"
  git config --global user.name "deBankeBot"
fi

# Only publish if we're on master and we haven't just commited with a "npm version"
# This should stop CircleCI & Github getting into a loop
regexp=".*Release[[:space:]]tag.*"

if [[ "${GIT_COMMIT_DESC:?}" =~ $regexp ]];then
  echo "Found \"Realease tag\" in the commit message. Not publishing";
elif [[ "${CIRCLE_BRANCH:?}" == "master" ]];then

  if [[ $(ls -A "node_modules" ) ]];then
    rm -rf node_modules;
  fi

  npm version patch -m "Release tag %s"
  npm publish
  echo "Published Module";
else
  echo "Not on master so not publishing"
fi
