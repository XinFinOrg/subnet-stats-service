#!/bin/sh
yarn run build
yarn global add serve
serve -s dist -l 5000