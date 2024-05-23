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

  for (const char of pageCharacters) {
    const characterBox = document.createElement('div');
    characterBox.classList.add('character-box');
    characterBox.style.display = 'flex';
    characterBox.style.flexDirection = 'column'; // 设置flex方向为列，确保拼音在文字上方
    characterBox.style.alignItems = 'center'; // 居中对齐
    characterBox.style.padding = '10px';
    characterBox.style.gap = '10px'; // 增大拼音、文字、按钮之间的间距

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

    // 添加俄文和英文翻译的容器
    const translationsContainer = document.createElement('div');
    translationsContainer.style.marginTop = '10px';
    characterBox.appendChild(translationsContainer);

    // 异步获取俄文翻译
    try {
      const russianTranslation = await getTranslation(char, 'ru');
      if (russianTranslation) {
        const russianDiv = document.createElement('div');
        russianDiv.textContent = `俄文: ${russianTranslation}`;
        translationsContainer.appendChild(russianDiv);
      }
    } catch (error) {
      console.error('Error fetching Russian translation:', error);
    }

    // 异步获取英文翻译
    try {
      const englishTranslation = await getTranslation(char, 'en');
      if (englishTranslation) {
        const englishDiv = document.createElement('div');
        englishDiv.textContent = `英文: ${englishTranslation}`;
        translationsContainer.appendChild(englishDiv);
        }
        } catch (error) {
        console.error('Error fetching English translation:', error);
        }

        // 创建发音按钮并添加到characterBox中
const pronounceButton = document.createElement('button');
pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
pronounceButton.style.marginTop = '10px'; // 增大按钮与文字的间距
// 应用CSS样式
pronounceButton.style.backgroundColor = '#e0e0e0'; // 灰色背景
pronounceButton.style.border = 'none';
pronounceButton.style.borderRadius = '50%'; // 圆形按钮
pronounceButton.style.width = '36px';
pronounceButton.style.height = '36px';
pronounceButton.style.display = 'flex';
pronounceButton.style.justifyContent = 'center';
pronounceButton.style.alignItems = 'center';
pronounceButton.style.cursor = 'pointer';
pronounceButton.addEventListener('click', function() {
  const msg = new SpeechSynthesisUtterance();
  msg.text = char;
  msg.lang = 'zh-CN';
  window.speechSynthesis.speak(msg);
});
characterBox.appendChild(pronounceButton);

textContainer.appendChild(characterBox);
}
}

// 辅助函数：使用 LibreTranslate 获取翻译
async function getTranslation(text, targetLang) {
  try {
  const response = await fetch('https://libretranslate.de/translate', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify({
  q: text,
  target: targetLang,
  }),
  });
  const data = await response.json();
  return data.translatedText;
  } catch (error) {
  console.error('Error fetching translation:', error);
  return null;
  }
  }

// 渲染分页按钮
function renderPagination() {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = ''; // 清空分页按钮

  const totalPages = Math.ceil(characters.length / pageSize); // 计算总页数

  // 设置上一页按钮的属性和事件
  const prevPageButton = document.getElementById('prev-page');
  prevPageButton.disabled = currentPageIndex === 0;
  prevPageButton.onclick = showPrevPage;

  // 设置下一页按钮的属性和事件
  const nextPageButton = document.getElementById('next-page');
  nextPageButton.disabled = currentPageIndex === totalPages - 1;
  nextPageButton.onclick = showNextPage;

  // 如果总页数小于等于1，直接返回，不再渲染页码按钮
  if (totalPages <= 1) {
    return;
  }

  // 添加页码按钮
  const groupIndex = Math.floor(currentPageIndex / pageGroupSize); // 当前页码组索引
  const startPage = groupIndex * pageGroupSize; // 当前页码组的起始页码
  const endPage = Math.min(startPage + pageGroupSize, totalPages); // 当前页码组的结束页码
  for (let i = startPage; i < endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.innerText = i + 1;
    pageBtn.className = currentPageIndex === i ? 'active' : '';
    pageBtn.onclick = (function(i) {
      return function() {
        currentPageIndex = i;
        // 根据当前分类调用相应的渲染函数
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

// 上一页函数
function showPrevPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    // 根据当前分类调用相应的渲染函数
    if (currentCategory === 'chinese.json') {
      renderChineseCharacters();
    } else {
      renderOtherCharacters();
    }
    renderPagination();
  }
}

// 下一页函数
function showNextPage() {
  const totalPages = Math.ceil(characters.length / pageSize);
  if (currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    // 根据当前分类调用相应的渲染函数
    if (currentCategory === 'chinese.json') {
      renderChineseCharacters();
    } else {
      renderOtherCharacters();
    }
    renderPagination();
  }
}
