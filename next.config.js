module.exports = {
  assetPrefix: '/tocbot/',
  webpack: (webpackConfig) => {
    return Object.assign({}, webpackConfig)
  }
}
