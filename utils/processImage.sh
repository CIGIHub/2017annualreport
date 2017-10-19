#! /bin/bash

# Place the jpg images in the working directory

DIRNAME=$(dirname $0)

# the minified images have a max width of 1920
for x in *.jpg; do convert -strip -interlace Plane -quality 85% $x -geometry '1920x>' "$DIRNAME/../data/min/$x"; done
# the preview thumbnails have a max width of 400
for x in *.jpg; do convert -strip -interlace Plane -quality 85% $x -geometry '400x>' "$DIRNAME/../data/prev/$x"; done