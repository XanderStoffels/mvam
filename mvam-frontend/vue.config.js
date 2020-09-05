module.exports = {
  pwa: {
    name: 'MercierTranslations',
    assetsVersion: 1,
    themeColor: '#534263',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
  },
  "transpileDependencies": [
    "vuetify"
  ]
}