#!/bin/bash

set -eoux pipefail

rm -rf firefox-release
mkdir firefox-release
cp -r src icons lib firefox-release/
cp manifest-firefox.json firefox-release/manifest.json
cd firefox-release && zip -r ../firefox-release.zip ./*
