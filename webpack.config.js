var Encore = require('@symfony/webpack-encore');

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

module.exports = Encore.getWebpackConfig();
