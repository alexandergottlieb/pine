#!/bin/bash

docker run -it --rm -v $(pwd):/usr/app -p 3000:3000 treebanking-react
