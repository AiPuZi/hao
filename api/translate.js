const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.DEEPL_API_KEY;
  const textArray = req.query.text.split('\n');
  const sourceLang = req.query.source_lang;
  const targetLang = req.query.target_lang;

  const url = `https://api-free.deepl.com/v2/translate`;
  const headers = {
    'Authorization': `DeepL-Auth-Key ${apiKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const body = new URLSearchParams({
    'text': textArray.join('\n'),
    'source_lang': sourceLang,
    'target_lang': targetLang
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translationData = await response.json();
    res.status(200).json(translationData.translations.map(trans => trans.text));
  } catch (error) {
    console.error('Error fetching translation:', error);
    res.status(500).json({ error: 'An error occurred while fetching translation' });
  }
};
