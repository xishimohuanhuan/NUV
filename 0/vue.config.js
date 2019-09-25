module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh-cn',
      fallbackLocale: 'en-us',
      localeDir: 'src',
      enableInSFC: false
    }
  },
  // chainWebpack: config => {
  //   // 移除 prefetch 插件
  //   // config.plugins.delete('prefetch');
  // },
  productionSourceMap:false,
  configureWebpack: config => {
    require('vux-loader').merge(config, {
      options: {},
      plugins: ['vux-ui']
    })
  }
}
