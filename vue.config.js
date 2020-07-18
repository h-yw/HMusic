module.exports = {
  publicPath: './',
  devServer: {
    port: 3000,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
      /*
        新歌速递
        全部:0
        华语:7
        欧美:96
        日本:8
        韩国:16
      */
      // '/limit': {
      //   target: this.url,
      //   ws: true,
      //   changeOrigin: true
      // }
    }
  }
}
