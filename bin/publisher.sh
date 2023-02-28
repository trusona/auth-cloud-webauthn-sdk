#!/usr/bin/env bash

set -e

projects="
webauthn-preflight
webauthn-core
"

npm run build

for project in $projects; do
  cd dist/trusona/$project
  npm publish --dry-run --access public
  cd ../../..
done

rm -rf dist
