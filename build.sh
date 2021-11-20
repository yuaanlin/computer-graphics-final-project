# Remove all files and folders from the build directory
rm -rf dist

# Create the build directory and copy index.html
mkdir dist
cp index.html dist/index.html

# Replace the scripts from node_modules with the local ones
awk '{sub("node_modules/webgl-obj-loader/dist","./js")}1' dist/index.html > dist/index.html.tmp
awk '{sub("node_modules/gl-matrix","./js")}1' dist/index.html.tmp > dist/index.html.tmp2
rm dist/index.html dist/index.html.tmp
mv dist/index.html.tmp2 dist/index.html

# Copy the js files, including those from node_modules
cp -r js dist
cp node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js dist/js/webgl-obj-loader.min.js
cp node_modules/gl-matrix/gl-matrix-min.js dist/js/gl-matrix-min.js

# Copy assets
cp -r assets dist
