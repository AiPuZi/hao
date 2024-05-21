import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

// 假设我们有一个变量来表示当前的分类
let currentCategory = 'hanzi'; // 默认为汉字分类，可以根据实际情况进行调整

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
      event.preventDefault(); // 防止默认行为
      currentCategory = navLink.getAttribute('href').substring(1); // 更新当前分类
      loadCategoryData(currentCategory + '.json'); // 加载对应分类的数据
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

// 渲染汉字或拼音
function renderCharacters() {
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  const start = currentPageIndex * pageSize; // 计算当前页面的起始索引
  const end = Math.min(start + pageSize, characters.length); // 计算当前页面的结束索引
  const pageItems = characters.slice(start, end);

  if (currentCategory === 'hanzi') {
    // 汉字分类的渲染逻辑
    pageItems.forEach(function(char, index) {
      const characterBox = document.createElement('div');
      characterBox.classList.add('character-box');

      const pinyinDiv = document.createElement('div');
      pinyinDiv.classList.add('pinyin');
      const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE });
      pinyinDiv.textContent = charPinyin.join(' '); // 将拼音数组连接为字符串显示
      characterBox.appendChild(pinyinDiv);

      const characterTargetDiv = document.createElement('div');
      characterTargetDiv.classList.add('hanzi');
      characterTargetDiv.id = 'character-target-div-' + (start + index); // 为每个汉字创建唯一的ID
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

      // 为播放动画按钮添加点击事件
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
  } else if (currentCategory === 'pinyin') {
    // 拼音分类的渲染逻辑
textContainer.style.display = 'grid'; // 使用 grid 布局
textContainer.style.gridTemplateRows = 'repeat(5, 1fr)'; // 设置为5行，每行占满整个容器
textContainer.style.gridTemplateColumns = '1fr'; // 设置为1列，每列占满整个容器
textContainer.style.gridGap = '10px'; // 设置间距
textContainer.innerHTML = ''; // 清空容器内部的内容

// 创建并添加大行元素
for (let i = 0; i < 5; i++) {
    let bigRow = document.createElement('div');
    bigRow.textContent = `大行 ${i+1}`; // 可选：添加文本内容
    bigRow.classList.add('big-row'); // 可选：添加类名进行样式控制
    textContainer.appendChild(bigRow);
}

    pageItems.forEach(function(char, index) {
      const characterBox = document.createElement('div');
      characterBox.classList.add('character-box');

      const charDiv = document.createElement('div');
      charDiv.textContent = char; // 直接显示汉字
      characterBox.appendChild(charDiv);

      const pinyinDiv = document.createElement('div');
      pinyinDiv.classList.add('pinyin');
      const charPinyin = pinyin(char, { style: pinyin.STYLE_NORMAL });
      pinyinDiv.textContent = charPinyin[0][0]; // 取第一个音节的拼音
      characterBox.appendChild(pinyinDiv);

      // 创建发音按钮
      const pronounceButton = document.createElement('button');
      pronounceButton.textContent = '发音';
      pronounceButton.style.marginTop = '5px'; // 设置按钮与拼音的间距
      characterBox.appendChild(pronounceButton);

      textContainer.appendChild(characterBox);

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
