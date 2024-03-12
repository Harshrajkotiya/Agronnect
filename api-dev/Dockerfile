# Install necessary alpine packages
FROM composer:2.4 as build

# FROM nginx:stable-alpine as nginx

FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk update && apk upgrade && apk add --no-cache \
    freetype \
    libjpeg-turbo \
    libpng \
    libwebp \
    libxpm \
    libavif \
    libxpm-dev \
    libzip-dev \
    zlib-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    libavif-dev \
    libwebp-dev

# Install necessary alpine packages
RUN apk add bash nginx supervisor
# Install necessary php extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN docker-php-ext-configure gd \
    --with-freetype=/usr/include/ \
    --with-jpeg=/usr/include/ \
    --with-webp=/usr/include/ \
    --with-xpm=/usr/include/ \
    --with-avif=/usr/include/

# Install GD extension
RUN docker-php-ext-install -j$(nproc) gd

COPY devops/docker/nginx /etc/nginx
COPY devops/docker/php /etc/php8
COPY devops/docker/supervisor/supervisord.conf /etc/supervisord.conf
COPY devops/docker/bootstrap.sh /bootstrap.sh
# Make executable bootstrap script
RUN chmod +x /bootstrap.sh

COPY --chown=nginx:nginx src/. /var/www/html
COPY --from=build /usr/bin/composer /usr/bin/composer
RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction

# Define working dir
WORKDIR /var/www/html

# CMD php artisan config:cache

# Expose container port
EXPOSE 80
ENTRYPOINT /bootstrap.sh