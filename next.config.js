module.exports = {
  // assetPrefix: '/tocbot/',
  pathPrefix: '/tocbot/',
  webpack: (webpackConfig) => {
    const newConfig = Object.assign({}, webpackConfig)
    newConfig.devServer = Object.assign({}, newConfig.devServer, {
      // contentBase: path.join(__dirname, "dist"),
    })
    return newConfig
  }
}
