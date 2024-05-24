// 异步获取俄文翻译
async function getTranslation(textArray, sourceLang, targetLang) {
  const apiUrl = 'https://hao-peach.vercel.app/api/translate?text=' + encodeURIComponent(textArray.join('\n')) + '&source_lang=' + sourceLang + '&target_lang=' + targetLang;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translationData = await response.json();
    return translationData;
  } catch (error) {
    console.error('Error fetching translation:', error);
    return [];
  }
}