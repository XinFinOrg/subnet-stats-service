#!/bin/sh
set -o errexit      #force exit if 'yarn run build' fails
yarn run build
yarn global add serve
serve -s dist -l 6000