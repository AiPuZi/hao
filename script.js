import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

let currentPageIndex = 0; // 当前页码，初始化为 0
const pageSize = 30; // 每页显示的汉字数
const pageGroupSize = 10; // 每组显示的页码数
let characters = []; // 将从 JSON 文件中动态加载
let currentCategory = 'chinese.json'; // 当前分类，初始化为 chinese.json

document.addEventListener('DOMContentLoaded', function() {
  loadCategoryData('chinese.json');
  const navLinks = document.querySelectorAll('.navigation a');
  navLinks.forEach(function(navLink) {
    navLink.addEventListener('click', function(event) {
      const href = navLink.getAttribute('href');
      if (href.startsWith('#')) {
        event.preventDefault();
        const category = href.substring(1);
        loadCategoryData(category + '.json');
      } else {
        window.location.href = href;
      }
    });
  });
});

function loadCategoryData(jsonFile) {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      characters = data;
      currentPageIndex = 0;
      currentCategory = jsonFile;
      renderPagination();
      if (jsonFile === 'chinese.json') {
        renderChineseCharacters();
      } else {
        renderOtherCharacters();
      }
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

function renderChineseCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = '';

  const start = currentPageIndex * pageSize;
  const end = start + pageSize;
  const pageCharacters = characters.slice(start, end); 
  
  pageCharacters.forEach(function(char, index) {
    const characterBox = document.createElement('div');
    characterBox.classList.add('character-box');
    
    const pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE });
    pinyinDiv.textContent = charPinyin.join(' ');
    characterBox.appendChild(pinyinDiv);

    const characterTargetDiv = document.createElement('div');
    characterTargetDiv.classList.add('hanzi');
    characterTargetDiv.id = 'character-target-div-' + (currentPageIndex * pageSize + index);
    characterBox.appendChild(characterTargetDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('button-container');

    const animateButton = document.createElement('button');
    animateButton.innerHTML = '<i class="fas fa-play"></i>';
    buttonsDiv.appendChild(animateButton);

    const pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    buttonsDiv.appendChild(pronounceButton);

    characterBox.appendChild(buttonsDiv);
    textContainer.appendChild(characterBox);

    const writer = HanziWriter.create(characterTargetDiv.id, char, {
        width: 100,
        height: 100,
        padding: 5,
        showOutline: true
    });

    animateButton.addEventListener('click', function() {
        writer.animateCharacter();
    });

    pronounceButton.addEventListener('click', function() {
        const msg = new SpeechSynthesisUtterance();
        msg.text = char;
        msg.lang = 'zh-CN';
        window.speechSynthesis.speak(msg);
    });
  });
}

async function renderOtherCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = '';

  const start = currentPageIndex * pageSize;
  const end = start + pageSize;
  const pageCharacters = characters.slice(start, end);

  let russianTranslations = [];
  let englishTranslations = [];
  try {
    russianTranslations = await getTranslation(pageCharacters, 'ZH', 'RU');
    englishTranslations = await getTranslation(pageCharacters, 'ZH', 'EN');
  } catch (error) {
    console.error('Error fetching translations:', error);
  }

  pageCharacters.forEach((char, index) => {
    const characterBox = document.createElement('div');
    characterBox.classList.add('character-box');
    characterBox.style.display = 'flex';
    characterBox.style.flexDirection = 'column';
    characterBox.style.alignItems = 'center';
    characterBox.style.padding = '10px';
    characterBox.style.gap = '10px';

    const pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    pinyinDiv.style.fontSize = '16px';
    const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE });
    pinyinDiv.textContent = charPinyin.join(' ');
    characterBox.appendChild(pinyinDiv);

    const charText = document.createElement('div');
    charText.textContent = char;
    charText.style.fontSize = '35px';
    charText.style.fontWeight = 'bold';
    charText.style.color = '#696969';
    characterBox.appendChild(charText);

    const translationsContainer = document.createElement('div');
    translationsContainer.style.marginTop = '10px';
    characterBox.appendChild(translationsContainer);

    const russianDiv = document.createElement('div');
    russianDiv.textContent = russianTranslations[index] ? `俄文: ${russianTranslations[index]}` : '俄文翻译未找到';
    translationsContainer.appendChild(russianDiv);

    const englishDiv = document.createElement('div');
    englishDiv.textContent = englishTranslations[index] ? `英文: ${englishTranslations[index]}` : '英文翻译未找到';
    translationsContainer.appendChild(englishDiv);

    const pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    pronounceButton.style.marginTop = '10px';
    pronounceButton.style.backgroundColor = '#e0e0e0';
    pronounceButton.style.border = 'none';
    pronounceButton.style.borderRadius = '50%';
    pronounceButton.style.width = '36px';
    pronounceButton.style.height = '36px';
    pronounceButton.style.display = 'flex';
    pronounceButton.style.justifyContent = 'center';
    pronounceButton.style.alignItems = 'center';
    pronounceButton.style.cursor = 'pointer';
    pronounceButton.addEventListener('click', function () {
      const msg = new SpeechSynthesisUtterance();
      msg.text = char;
      msg.lang = 'zh-CN';
      window.speechSynthesis.speak(msg);
    });
    characterBox.appendChild(pronounceButton);

    textContainer.appendChild(characterBox);
  });
}

function renderPagination() {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = ''; // 清空分页按钮

  const totalPages = Math.ceil(characters.length / pageSize); // 计算总页数

  const prevPageButton = document.getElementById('prev-page');
  prevPageButton.disabled = currentPageIndex === 0;
  prevPageButton.onclick = showPrevPage;

  const nextPageButton = document.getElementById('next-page');
  nextPageButton.disabled = currentPageIndex === totalPages - 1;
  nextPageButton.onclick = showNextPage;

  if (totalPages <= 1) {
    return;
  }

  const groupIndex = Math.floor(currentPageIndex / pageGroupSize);
  const startPage = groupIndex * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);
  for (let i = startPage; i < endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.innerText = i + 1;
    pageBtn.className = currentPageIndex === i ? 'active' : '';
    pageBtn.onclick = (function (i) {
      return function () {
        currentPageIndex = i;
        if (currentCategory === 'chinese.json') {
          renderChineseCharacters();
        } else {
          renderOtherCharacters();
        }
        renderPagination();
      };
    })(i);
    paginationContainer.appendChild(pageBtn);
  }
}

function showPrevPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    if (currentCategory === 'chinese.json') {
      renderChineseCharacters();
    } else {
      renderOtherCharacters();
    }
    renderPagination();
  }
}

function showNextPage() {
  const totalPages = Math.ceil(characters.length / pageSize);
  if (currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    if (currentCategory === 'chinese.json') {
      renderChineseCharacters();
    } else {
      renderOtherCharacters();
    }
    renderPagination();
  }
}

async function getTranslation(textArray, sourceLang, targetLang) {
  const response = await fetch('/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      textArray,
      sourceLang,
      targetLang
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch translation');
  }

  const { translations } = await response.json();
  return translations.flat();
}
