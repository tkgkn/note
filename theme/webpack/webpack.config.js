const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  // 错误发生时，可以追溯到源码里具体位置
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './',
    publicPath: '/assets/'
  },
  output: {
    // filename规定的是entry文件的文件名。
    filename: 'assets/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
    // 设置cdn地址用这个，最终打包后引用的资源地址是publicPath+filename
    // publicPath: 'https://cdn.com.cn/'
  },
  plugins: []
};
