FROM node:20-alpine3.20

ARG PRE_COMMIT_VERSION=3.7.1-r0
RUN apk update \
    && apk add --no-cache \
        pre-commit=${PRE_COMMIT_VERSION} \
    && rm -rf /var/cache/apk/*
