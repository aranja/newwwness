#!/bin/bash
shopt -s extglob dotglob

rm -rf build || exit 0
(
mkdir build
mv !(build|.git) build/
cp -r build/dist/* .
rm -rf build

git config user.name "Travis CI"
git config user.email "deployments@aranja.com"
git add --all
git commit -m "${TRAVIS_COMMIT}"
git push --force "https://${GH_TOKEN}@${GH_REF}" HEAD:gh-pages > /dev/null 2>&1
)
