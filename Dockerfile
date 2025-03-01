arg RUBY_VERSION="3.3.5"

from registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

env BUNDLER_VERSION="2.5.16" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development" \
    NODE_VERSION="22.5.1" \
    NPM_VERSION="10.8.2" \
    PATH="/usr/local/node/bin:${PATH}" \
    RAILS_ENV="production" \
    RUBY_INSTALL_VERSION="0.9.3"

run apt-get update
run apt-get install -y \
    autoconf \
    build-essential \
    curl \
    fish \
    git \
    libpq-dev \
    libvips \
    pkg-config \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    vim \
    wget

workdir /rails

run curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/
run /tmp/node-build-master/bin/node-build $NODE_VERSION /usr/local/node

copy Gemfile Gemfile.lock ./

run gem install bundler -v "$BUNDLER_VERSION"
run bundle install

copy package.json package-lock.json ./

run npm ci

copy . .

run HOST=example.com \
    HOSTS=example.com \
    BASE_URL=https://example.com \
    RAILS_MASTER_KEY_DUMMY=1 \
    SECRET_KEY_BASE_DUMMY=1 \
    ./bin/rails assets:precompile

entrypoint ["/rails/bin/docker-entrypoint"]

expose 3000
cmd ["./bin/thrust", "./bin/web"]

label codedorian
