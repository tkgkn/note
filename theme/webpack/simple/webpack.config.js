const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './index.js')
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
}