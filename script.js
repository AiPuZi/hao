import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

let currentPageIndex = 0; // 当前页码，初始化为 0
const pageSize = 30; // 每页显示的汉字数
const pageGroupSize = 10; // 每组显示的页码数
let characters = []; // 将从 JSON 文件中动态加载
let currentCategory = 'chinese.json'; // 当前分类，初始化为 chinese.json

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始加载第一页数据
  loadCategoryData('chinese.json');

  // 绑定导航链接的点击事件
  const navLinks = document.querySelectorAll('.navigation a');
  navLinks.forEach(function(navLink) {
    navLink.addEventListener('click', function(event) {
      const href = navLink.getAttribute('href');
      
      // 检查链接是否为内部锚点
      if (href.startsWith('#')) {
        event.preventDefault(); // 防止默认行为
        const category = href.substring(1); // 提取链接的锚点部分作为类别
        loadCategoryData(category + '.json');
      } else {
        // 如果不是锚点链接，执行默认的页面跳转
        window.location.href = href;
      }
    });
  });
});

// 加载分类数据
function loadCategoryData(jsonFile) {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      characters = data; // 将加载的数据赋值给 characters 变量
      currentPageIndex = 0; // 重置当前页码为 0
      currentCategory = jsonFile; // 更新当前分类
      renderPagination(); // 渲染分页按钮
      if (jsonFile === 'chinese.json') {
        renderChineseCharacters(); // 对于“chinese”分类，使用原有的渲染方法
      } else {
        renderOtherCharacters(); // 对于其他分类，使用新的渲染方法
      }
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

// 渲染“chinese”分类的汉字（原有的渲染方法）
function renderChineseCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  const start = currentPageIndex * pageSize; // 计算当前页面的起始汉字索引
  const end = start + pageSize; // 计算当前页面的结束汉字索引
  const pageCharacters = characters.slice(start, end); 
  
  pageCharacters.forEach(function(char, index) {
    const characterBox = document.createElement('div');
    characterBox.classList.add('character-box');
    
    const pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE });
    pinyinDiv.textContent = charPinyin.join(' '); // 将拼音数组连接为字符串显示
    characterBox.appendChild(pinyinDiv);

    const characterTargetDiv = document.createElement('div');
    characterTargetDiv.classList.add('hanzi');
    characterTargetDiv.id = 'character-target-div-' + (currentPageIndex * pageSize + index); // 为每个汉字创建唯一的ID
    characterBox.appendChild(characterTargetDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('button-container');

    // 创建播放动画按钮
    const animateButton = document.createElement('button');
    animateButton.innerHTML = '<i class="fas fa-play"></i>';
    buttonsDiv.appendChild(animateButton);

    // 创建发音按钮
    const pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    buttonsDiv.appendChild(pronounceButton);

    characterBox.appendChild(buttonsDiv);
    textContainer.appendChild(characterBox);

    // 创建汉字写作实例
    const writer = HanziWriter.create(characterTargetDiv.id, char, {
        width: 100,
        height: 100,
        padding: 5,
        showOutline: true // 显示汉字轮廓
    });

    // 为播放动画按钮添加点击事件，并在此处使用writer实例
    animateButton.addEventListener('click', function() {
        writer.animateCharacter();
    });

    // 为发音按钮添加点击事件
    pronounceButton.addEventListener('click', function() {
        // 创建一个SpeechSynthesisUtterance的实例
        const msg = new SpeechSynthesisUtterance();
        
        // 设置要朗读的文本为当前汉字
        msg.text = char;
        
        // 设置语言为中文普通话
        msg.lang = 'zh-CN';
        
        // 使用SpeechSynthesis接口的speak方法来播放语音
        window.speechSynthesis.speak(msg);
        
        console.log('播放汉字“' + char + '”的发音');
    });
  });
}

// 渲染除“chinese”以外的其他分类（新的渲染方法）
async function renderOtherCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  const start = currentPageIndex * pageSize; // 计算当前页面的起始索引
  const end = start + pageSize; // 计算当前页面的结束索引
  const pageCharacters = characters.slice(start, end);

  // 获取俄文和英文翻译
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
    characterBox.style.flexDirection = 'column'; // 设置flex方向为列，确保拼音在文字上方
    characterBox.style.alignItems = 'center'; // 居中对齐
    characterBox.style.padding = '10px';
    characterBox.style.gap = '10px'; // 墛大拼音、文字、按钮之间的间距

    // 创建拼音div并添加到characterBox中
    const pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    pinyinDiv.style.fontSize = '16px'; // 设置拼音的字体大小
    const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE });
    pinyinDiv.textContent = charPinyin.join(' ');
    characterBox.appendChild(pinyinDiv);

    // 创建文字div并添加到characterBox中
    const charText = document.createElement('div');
    charText.textContent = char;
    charText.style.fontSize = '35px'; // 设置文字的字体大小，确保比拼音大
    charText.style.fontWeight = 'bold'; // 设置文字为粗体
    charText.style.color = '#696969'; // 设置文字颜色
    characterBox.appendChild(charText);

    // 添加翻译容器
    const translationsContainer = document.createElement('div');
    translationsContainer.style.marginTop = '10px';
    characterBox.appendChild(translationsContainer);

    // 显示俄文翻译
    const russianDiv = document.createElement('div');
    russianDiv.textContent = russianTranslations[index] ? `俄文: ${russianTranslations[index]}` : '俄文翻译未找到';
    translationsContainer.appendChild(russianDiv);

    // 显示英文翻译
    const englishDiv = document.createElement('div');
    englishDiv.textContent = englishTranslations[index] ? `英文: ${englishTranslations[index]}` : '英文翻译未找到';
    translationsContainer.appendChild(englishDiv);

    // 创建播放动画按钮并添加到characterBox中
    const animateButton = document.createElement('button');
    animateButton.innerHTML = '<i class="fas fa-play"></i>';
    characterBox.appendChild(animateButton);

    // 创建发音按钮并添加到characterBox中
    const pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    characterBox.appendChild(pronounceButton);

    textContainer.appendChild(characterBox);

    // 创建汉字写作实例
    const writer = HanziWriter.create(characterBox, char, {
      width: 100,
      height: 100,
      padding: 5,
      showOutline: true // 显示汉字轮廓
    });

    // 为播放动画按钮添加点击事件
    animateButton.addEventListener('click', function() {
      writer.animateCharacter();
    });

    // 为发音按钮添加点击事件
    pronounceButton.addEventListener('click', function() {
      const msg = new SpeechSynthesisUtterance();
      msg.text = char;
      msg.lang = 'zh-CN';
      window.speechSynthesis.speak(msg);
    });
  });
}

// 获取翻译的函数
async function getTranslation(texts, from, to) {
  const url = `/api/translate?text=${encodeURIComponent(texts.join('\n'))}&source_lang=${from}&target_lang=${to}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// 渲染分页按钮
function renderPagination() {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(characters.length / pageSize);

  const startPage = Math.floor(currentPageIndex / pageGroupSize) * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  if (startPage > 0) {
    const prevGroupButton = document.createElement('button');
    prevGroupButton.textContent = '<<';
    prevGroupButton.addEventListener('click', function() {
      currentPageIndex = startPage - 1;
      renderPagination();
      if (currentCategory === 'chinese.json') {
        renderChineseCharacters();
      } else {
        renderOtherCharacters();
      }
    });
    paginationContainer.appendChild(prevGroupButton);
  }

  for (let i = startPage; i < endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = (i + 1).toString();
    if (i === currentPageIndex) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', function() {
      currentPageIndex = i;
      renderPagination();
      if (currentCategory === 'chinese.json') {
        renderChineseCharacters();
      } else {
        renderOtherCharacters();
      }
    });
    paginationContainer.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    const nextGroupButton = document.createElement('button');
    nextGroupButton.textContent = '>>';
    nextGroupButton.addEventListener('click', function() {
      currentPageIndex = endPage;
      renderPagination();
      if (currentCategory === 'chinese.json') {
        renderChineseCharacters();
      } else {
        renderOtherCharacters();
      }
    });
    paginationContainer.appendChild(nextGroupButton);
  }
}
