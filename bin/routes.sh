#!/usr/bin/env bash
bin/console assets:install --symlink public
bin/console fos:js-routing:dump --format=json --target=assets/js/store/routes.json
