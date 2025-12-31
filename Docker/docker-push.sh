#!/bin/bash

# push local Docker image to Docker Hub
docker login
#docker push docker.io/sezfoe/jamkao-app:latest

# push local Docker image to Google Artifact Registry
gcloud auth login
gcloud auth configure-docker us-central1-docker.pkg.dev
docker push us-central1-docker.pkg.dev/sssapi-stg/sssapi-platform/jamkao-app:latest
