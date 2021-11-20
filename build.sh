rm -rf dist

mkdir dist
cp index.html dist/index.html

awk '{sub("node_modules/webgl-obj-loader/dist","./js")}1' dist/index.html > dist/index.html.tmp
awk '{sub("node_modules/gl-matrix","./js")}1' dist/index.html.tmp > dist/index.html.tmp2
rm dist/index.html dist/index.html.tmp
mv dist/index.html.tmp2 dist/index.html

cp -r js dist/js/
cp node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js dist/js/webgl-obj-loader.min.js
cp node_modules/gl-matrix/gl-matrix-min.js dist/js/gl-matrix-min.js

cp -r assets dist
