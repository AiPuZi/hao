const express = require('express');
const app = express();
const PORT = 3000;

// 静态文件服务目录设置为项目根目录
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
