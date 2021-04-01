const path = require("path");
// const PrerenderSpaPlugin = require('prerender-spa-plugin')
// const Renderer = require('prerender-spa-plugin').PuppeteerRenderer;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    port: 8080,
    host: "0.0.0.0",
    https: false,
    open: false,
    proxy: {

      "/api": {
        // 目标服务器地址, 代理访问
        target: "http://cscustomer.bxyun.cn/userCenter",
        changeOrigin: true, // 是否允许跨域
        secure: false,
        pathRewrite: {
          "^/api": "/"
        }
      }
    },
  },
  publicPath: '/',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]', // 提示compression-webpack-plugin@3.0.0的话asset改为filename
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
        }),
      ]
    },
    externals: {
      // 'vue': 'Vue',
      // 'element-ui': 'ELEMENT',
      // 'vue-router': 'VueRouter',
      // 'vuex': 'store'
    },
    resolve: {
      alias: {
        "@assets": resolve("src/assets"),
        "@components": resolve("src/components"),
        "@views": resolve("src/views"),
        "@css": resolve("src/assets/css"),
        "@styles": resolve("src/styles")
      }
    },
  }
};