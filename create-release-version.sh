mkdir -p release
cp -r src release/
cp -r icons/ release/
sed -e '/\"background\":/d' manifest.json > release/manifest.json
cd release && zip -r ../release.zip ./* && cd ..
