const path = require('path');
const nodeExternals = require('webpack-node-externals'); // 引入插件

module.exports = {
  target: 'node', // 设置目标环境为Node.js
  externals: [nodeExternals()], // 添加到externals数组中，让Webpack忽略所有Node.js内置模块
  entry: './script.js', // 项目入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js' // 输出文件
  },
  mode: 'production', // 设置模式为生产模式
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有的js文件
        exclude: /node_modules/, // 排除node_modules目录
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // 使用@babel/preset-env预设
          }
        }
      }
    ]
  }
};