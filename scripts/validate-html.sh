#!/bin/bash
# Validate HTML and SVG files, excluding the experimental folder

# Find all HTML and SVG files in dist/, excluding dist/experimental/
# Use -print0 and xargs -0 to handle filenames with spaces correctly
# Use -r to avoid running vnu if no files are found
find dist/ \
  -type f \
  \( -name "*.html" -o -name "*.svg" \) \
  -not -path "dist/experimental/*" \
  -print0 | \
xargs -0 -r \
  java -jar ./node_modules/vnu-jar/build/dist/vnu.jar \
  --skip-non-html \
  --also-check-svg \
  --filterfile .vnurc
