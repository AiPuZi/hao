import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(express.static('.')); // 静态文件服务目录设置为项目根目录
app.use(bodyParser.json());

const DEEPL_API_KEY = '201e4689-0901-4bd6-9775-33ca3046393a:fx'; // 替换为你的DeepL API密钥

app.post('/translate', async (req, res) => {
  const { textArray, sourceLang, targetLang } = req.body;

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`
      },
      body: new URLSearchParams({
        text: textArray.join('\n'), // 将文本数组连接成单个字符串，每个文本之间以换行符分隔
        source_lang: sourceLang,
        target_lang: targetLang
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch translation');
    }

    const translationData = await response.json();
    const translations = translationData.translations.map(translation => translation.text.split('\n'));

    res.json({ translations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});