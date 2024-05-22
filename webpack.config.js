const path = require('path');

module.exports = {
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