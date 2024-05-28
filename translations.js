const translations = {
    en: {
        title:"ChineseEasy — Easy to Learn Chinese",
        char: "Characters",
        word: "Words",
        sentence: "Sentences",
        help: "Help",
        pinyin: "Pinyin"
    },
    cn: {
        title:"ChineseEasy — 轻松学中文",
        char: "汉字",
        word: "词语",
        sentence: "句子",
        help: "帮助",
        pinyin: "拼音发音表"
    },
    ru: {
        title:"ChineseEasy — Легко учить китайский",
        char: "иероглиф",
        word: "Слово",
        sentence: "Предложение",
        help: "Помощь",
        pinyin: "пиньинь"
    }
};

function setLanguage(language) {
    document.getElementById('nav-title').innerText = translations[language].title;
    document.getElementById('nav-char').innerText = translations[language].char;
    document.getElementById('nav-word').innerText = translations[language].word;
    document.getElementById('nav-sentence').innerText = translations[language].sentence;
    document.getElementById('nav-help').innerText = translations[language].help;
    document.getElementById('nav-pinyin').innerText = translations[language].pinyin;
}

window.onload = function() {
    // 默认设置为英文
    setLanguage('en');
};