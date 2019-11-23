#!/bin/bash
set -e

CURRENT_DIR=$(dirname "$0")

ENVIRONMENT=$1
SRC_CONFIG_FILE="${CURRENT_DIR}/environments/environment.$ENVIRONMENT.ts"
DEST_CONFIG_FILE="${CURRENT_DIR}/../src/environments/environment.$ENVIRONMENT.ts"

echo "Building version $VERSION"

# Copy the configuration file for the specified environment
cp $SRC_CONFIG_FILE $DEST_CONFIG_FILE

# Then put version information in the config file
sed -i -E "s/version: ?'(.*)'/version: '${VERSION////\\/}'/" $DEST_CONFIG_FILE

# Finally, build the app
npm install
npx ng build --aot --no-progress --configuration $ENVIRONMENT