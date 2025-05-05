#!/bin/bash

set -eoux pipefail

rm -rf release
mkdir release
cp -r src icons manifest.json release/
cd release && zip -r ../release.zip ./*
