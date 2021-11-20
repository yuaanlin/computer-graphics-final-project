rm -rf dist

mkdir dist
cp index.html dist/index.html

mkdir dist/js
cp node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js dist/js/webgl-obj-loader.min.js
cp node_modules/gl-matrix/gl-matrix-min.js dist/js/gl-matrix-min.js