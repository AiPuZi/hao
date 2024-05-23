import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

let currentPageIndex = 0; // 当前页码，初始化为 0
const pageSize = 30; // 每页显示的汉字数
const pageGroupSize = 10; // 每组显示的页码数
let characters = []; // 将从 JSON 文件中动态加载

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始加载第一页汉字
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
      renderPagination(); // 渲染分页按钮
      renderCharacters(); // 加载第一页的内容
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

// 渲染汉字
function renderCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  const start = currentPageIndex * pageSize; // 计算当前页面的起始索引
  const end = start + pageSize; // 计算当前页面的结束索引
  const pageItems = characters.slice(start, end);

  pageItems.forEach(function(item, index) {
    const itemBox = document.createElement('div');
    itemBox.classList.add('item-box');

    // 为每个项目创建拼音
    const pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    const itemPinyin = pinyin(item.text, { style: pinyin.STYLE_TONE });
    pinyinDiv.textContent = itemPinyin.join(' ');
    itemBox.appendChild(pinyinDiv);

    // 为每个项目创建文本展示区域
    const textDiv = document.createElement('div');
    textDiv.textContent = item.text;
    itemBox.appendChild(textDiv);

    // 根据类型添加额外的处理
    if (item.type === 'character') {
      // 这里处理汉字特有的逻辑
      textDiv.classList.add('hanzi');
      itemBox.classList.add('character-box');
      textDiv.id = 'character-target-div-' + (currentPageIndex * pageSize + index);

      // 添加动作按钮等特定于汉字的元素
    } else {
      // 这里处理词组或句子特有的逻辑
      textDiv.classList.add('phrase-sentence');
      itemBox.classList.add('phrase-sentence-box');
      // 词组或句子可能不需要动画，但可以添加其他特定元素
    }

    // 创建发音按钮
    const pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    pronounceButton.addEventListener('click', function() {
      const msg = new SpeechSynthesisUtterance();
      msg.text = item.text;
      msg.lang = 'zh-CN';
      window.speechSynthesis.speak(msg);
    });
    itemBox.appendChild(pronounceButton);

    textContainer.appendChild(itemBox);
  });
}

// 渲染分页按钮
function renderPagination() {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = ''; // 清空分页按钮

  const totalPages = Math.ceil(characters.length / pageSize); // 计算总页数

  // 获取现有的上一页和下一页按钮
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');

  // 设置上一页按钮的属性和事件
  prevPageButton.disabled = currentPageIndex === 0;
  prevPageButton.onclick = showPrevPage;

  // 设置下一页按钮的属性和事件
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
        renderCharacters();
        renderPagination();
      };
    })(i);
    paginationContainer.appendChild(pageBtn);
  }
}

// 上一页和下一页函数
function showPrevPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderCharacters();
    renderPagination();
  }
}

function showNextPage() {
  const totalPages = Math.ceil(characters.length / pageSize);
  if (currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    renderCharacters();
    renderPagination();
  }
}
