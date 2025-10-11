ARG RUBY_VERSION="3.4.5"

FROM registry.docker.com/library/ruby:${RUBY_VERSION}-slim AS base

ENV BUNDLER_VERSION="2.7.1" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test" \
    NODE_VERSION="24.4.1" \
    NPM_VERSION="11.4.2" \
    PATH="/usr/local/node/bin:${PATH}" \
    RAILS_ENV="production" \
    NODE_ENV="production" \
    RUBY_INSTALL_VERSION="0.10.1"

RUN apt-get update &&
    apt-get install -y --no-install-recommends \
        autoconf build-essential curl fish git libpq-dev libvips pkg-config \
        postgresql postgresql-contrib libyaml-dev vim wget ca-certificates &&
    rm -rf /var/lib/apt/lists/*

WORKDIR /rails

RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz |
    tar xz -C /tmp/ &&
    /tmp/node-build-master/bin/node-build "$NODE_VERSION" /usr/local/node &&
    node -v && npm -v

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v "$BUNDLER_VERSION"

RUN --mount=type=cache,target=/usr/local/bundle/cache \
    bundle install --jobs=4 --retry=3 &&
    bundle clean --force &&
    rm -rf "$BUNDLE_PATH/cache"

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev &&
    npm cache clean --force

COPY . .

RUN HOST=example.com \
    HOSTS=example.com \
    BASE_URL=https://example.com \
    RAILS_MASTER_KEY_DUMMY=1 \
    SECRET_KEY_BASE_DUMMY=1 \
    ./bin/rails assets:precompile &&
    rm -rf node_modules/.cache tmp/cache

ENTRYPOINT ["/rails/bin/docker-entrypoint"]
EXPOSE 3000
CMD ["./bin/thrust", "./bin/web"]
