const path = require('path');

module.exports = {
  entry: './script.js', // 项目入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js' // 输出文件
  },
  mode: 'development' // 设置模式为开发模式
};