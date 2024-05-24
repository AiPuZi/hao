const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.DEEPL_API_KEY;
  const textArray = event.queryStringParameters.text.split('\n');
  const sourceLang = event.queryStringParameters.sourceLang;
  const targetLang = event.queryStringParameters.targetLang;

  const encodedText = encodeURIComponent(textArray.join('\n'));
  const url = `https://api-free.deepl.com/v2/translate`;
  const headers = {
    'Authorization': `DeepL-Auth-Key ${apiKey}`
  };
  const body = new URLSearchParams({
    'text': encodedText,
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
    return {
      statusCode: 200,
      body: JSON.stringify(translationData.translations.map(trans => trans.text))
    };
  } catch (error) {
    console.error('Error fetching translation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while fetching translation' })
    };
  }
};