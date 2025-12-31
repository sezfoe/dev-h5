#!/bin/bash

# build local Docker image
docker build -t jamkao-app:latest -f dockerfile2 .

# build Docker Hub image
#docker build -t sezfoe/jamkao-app:latest -f dockerfile2 .

# build Google Artifact Registry image
#docker build -t us-central1-docker.pkg.dev/sssapi-stg/sssapi-platform/jamkao-app:latest -f dockerfile2 .