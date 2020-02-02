mkdir -p release
cp -r src release/
sed -e '/\"background\":/d' manifest.json > release/manifest.json
cd release && zip -r ../release.zip ./* && cd ..
ls
