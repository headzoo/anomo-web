const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    //.setManifestKeyPrefix('build/')
    .addEntry('js/app', './assets/js/index.jsx')
    .addStyleEntry('css/app', './assets/css/app.scss')
    .enableReactPreset()
    .enablePostCssLoader()
    .cleanupOutputBeforeBuild()
    // .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableSassLoader()
    //.enableTypeScriptLoader()
    //.autoProvidejQuery()
    .configureDefinePlugin((options) => {
      options.__DEV__ = JSON.stringify(!Encore.isProduction());
    })
;

const webpackConfig = Encore.getWebpackConfig();
if (Encore.isProduction()) {
  webpackConfig.plugins = webpackConfig.plugins.filter(
    plugin => !(plugin instanceof webpack.optimize.UglifyJsPlugin)
  );
  webpackConfig.plugins.push(new UglifyJsPlugin());
}

module.exports = webpackConfig;
