FROM node:24-alpine3.22

# Install Google Cloud CLI
RUN apk add --no-cache curl python3 py3-crcmod bash libc6-compat
RUN curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz && \
    tar -xf google-cloud-cli-linux-x86_64.tar.gz && \
    rm google-cloud-cli-linux-x86_64.tar.gz && \
    ./google-cloud-sdk/install.sh --quiet --usage-reporting false --path-update true && \
    ln -s /google-cloud-sdk/bin/gcloud /usr/local/bin/gcloud && \
    ln -s /google-cloud-sdk/bin/gsutil /usr/local/bin/gsutil && \
    ln -s /google-cloud-sdk/bin/bq /usr/local/bin/bq

ENV PATH="/google-cloud-sdk/bin:${PATH}"
