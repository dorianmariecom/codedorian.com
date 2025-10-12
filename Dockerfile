# syntax=docker/dockerfile:1.7

ARG RUBY_VERSION=3.4.5
ARG NODE_MAJOR=24

############################
# Base runtime (no build tools)
############################
FROM ruby:${RUBY_VERSION}-slim AS base

ENV BUNDLER_VERSION=2.7.1 \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_PATH="/usr/local/bundle" \
    RAILS_ENV=production \
    NODE_ENV=production \
    GEM_HOME="/usr/local/bundle" \
    PATH="/usr/local/bundle/bin:${PATH}"

# Runtime deps only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates curl libpq5 libyaml-0-2 libvips \
      tini && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /rails

############################
# Node stage (prebuilt binaries)
############################
FROM node:${NODE_MAJOR}-bookworm-slim AS node

WORKDIR /nodeapp

############################
# Builder (has compilers and headers)
############################
FROM base AS builder

# Build deps only in this stage
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential git pkg-config libpq-dev libyaml-dev && \
    rm -rf /var/lib/apt/lists/*

# Faster RubyGems, no docs
RUN printf "gem: --no-document\n" > /root/.gemrc && \
    gem install bundler -v "$BUNDLER_VERSION"

# Bundle install
COPY Gemfile Gemfile.lock ./
RUN --mount=type=cache,id=bundle-cache,target=/usr/local/bundle/cache \
    bundle config set path "$BUNDLE_PATH" && \
    bundle install --jobs=4 --retry=3 && \
    bundle clean --force

# NPM install using the Node stage toolchain
COPY --from=node /usr/local/ /usr/local/
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && npm cache clean --force

# App source
COPY . .

# Precompile assets
ENV HOST=example.com \
    HOSTS=example.com \
    BASE_URL=https://example.com \
    RAILS_MASTER_KEY_DUMMY=1 \
    SECRET_KEY_BASE_DUMMY=1
RUN ./bin/rails assets:precompile && \
    rm -rf node_modules/.cache tmp/cache

############################
# Final runtime image
############################
FROM base AS final

# Copy runtime Ruby gems and app
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder /rails /rails

# Remove dev leftovers that aren’t needed at runtime
RUN rm -rf /rails/node_modules \
           /rails/tmp/* \
           /rails/vendor/cache

ENTRYPOINT ["/usr/bin/tini","--","/rails/bin/docker-entrypoint"]
EXPOSE 3000
CMD ["./bin/thrust","./bin/web"]
