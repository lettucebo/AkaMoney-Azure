ARG VARIANT="8.0-bookworm"
FROM mcr.microsoft.com/devcontainers/dotnet:${VARIANT}

# Install base utilities and certificates
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        wget \
    && rm -rf /var/lib/apt/lists/*

# Install Azure Functions Core Tools (v4)
RUN wget https://packages.microsoft.com/config/debian/$(lsb_release -rs)/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb \
    && dpkg -i /tmp/packages-microsoft-prod.deb \
    && rm /tmp/packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y --no-install-recommends azure-functions-core-tools-4 \
    && rm -rf /var/lib/apt/lists/*
