mkdir -p release
cp -r src release/
cp icons/icon128.png release/
sed -e '/\"background\":/d' manifest.json > release/manifest.json
cd release && zip -r ../release.zip ./* && cd ..
