const path = require('path');

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map',
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      lodash: '_',
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
        util: path.resolve(__dirname, './src/util'),
        src: path.resolve(__dirname, './src'),
      },
    },
  },
};
