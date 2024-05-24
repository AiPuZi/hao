const express = require('express');
const https = require('https');
const querystring = require('querystring');
const app = express();
const PORT = 3000;

// 静态文件服务目录设置为项目根目录
app.use(express.static('.'));

// 后端代理到DeepL API
app.post('/translate', (req, res) => {
  const formData = req.body;
  const options = {
    hostname: 'api-free.deepl.com',
    port: 443,
    path: '/v2/translate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`, // 使用环境变量存储API密钥
    },
  };

  const reqToDeepL = https.request(options, (deepLRes) => {
    let data = '';
    deepLRes.on('data', (chunk) => {
      data += chunk;
    });
    deepLRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch (error) {
        res.status(500).send('Error processing DeepL response');
      }
    });
  });

  reqToDeepL.on('error', (error) => {
    console.error(error);
    res.status(500).send('Error calling DeepL API');
  });

  reqToDeepL.write(querystring.stringify(formData));
  reqToDeepL.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});