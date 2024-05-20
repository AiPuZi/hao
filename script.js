import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

var currentPageIndex = 0; // 当前页码，初始化为 0
var pageSize = 30; // 每页显示的汉字数
var pageGroupSize = 10; // 每组显示的页码数
var characters = []; // 从 JSON 文件中加载的汉字数据

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  fetch('chinese.json')
    .then(response => response.json())
    .then(data => {
      characters = data; // 将加载的数据赋值给 characters 变量
      renderPagination(); // 渲染分页按钮
      renderCharacters(currentPageIndex); // 初始加载第一页汉字
    })
    .catch(error => console.error('Error fetching JSON:', error));
});

// 渲染汉字
function renderCharacters(pageIndex) {
  var textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  var start = pageIndex * pageSize; // 计算当前页面的起始汉字索引
  var end = start + pageSize; // 计算当前页面的结束汉字索引
  var pageCharacters = characters.slice(start, end); // 获取当前页面的汉字

  pageCharacters.forEach(function(char, index) {
    var characterBox = document.createElement('div');
    characterBox.classList.add('character-box');

    // 创建汉字写作实例的目标SVG元素
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "100");
    svgElement.setAttribute("height", "100");
    svgElement.setAttribute("id", 'character-svg-' + char); // 确保ID的唯一性

    // 添加自定义网格线条
    const lines = [
      { x1: "0", y1: "0", x2: "100", y2: "0", stroke: "#DDD" },
      { x1: "100", y1: "0", x2: "100", y2: "100", stroke: "#DDD" },
      { x1: "100", y1: "100", x2: "0", y2: "100", stroke: "#DDD" },
      { x1: "0", y1: "100", x2: "0", y2: "0", stroke: "#DDD" },
      { x1: "0", y1: "0", x2: "100", y2: "100", stroke: "#DDD" },
      { x1: "100", y1: "0", x2: "0", y2: "100", stroke: "#DDD" },
      { x1: "50", y1: "0", x2: "50", y2: "100", stroke: "#DDD" },
      { x1: "0", y1: "50", x2: "100", y2: "50", stroke: "#DDD" }
    ];

    lines.forEach(lineConfig => {
      const line = createLine(lineConfig);
      svgElement.appendChild(line);
    });

    characterBox.appendChild(svgElement);

    var pinyinDiv = document.createElement('div');
    pinyinDiv.classList.add('pinyin');
    var charPinyin = pinyin(char);
    pinyinDiv.textContent = charPinyin[0][0];
    characterBox.appendChild(pinyinDiv);

    var characterTargetDiv = document.createElement('div');
    characterTargetDiv.classList.add('hanzi');
    characterTargetDiv.id = 'character-target-' + (pageIndex * pageSize + index); // 为每个汉字创建唯一的ID
    characterBox.appendChild(characterTargetDiv);

    var buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('button-container');

    var animateButton = document.createElement('button');
    animateButton.innerHTML = '<i class="fas fa-play"></i>';
    buttonsDiv.appendChild(animateButton);

    var pronounceButton = document.createElement('button');
    pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    buttonsDiv.appendChild(pronounceButton);

    characterBox.appendChild(buttonsDiv);
    textContainer.appendChild(characterBox);

    var writer = HanziWriter.create(characterTargetDiv.id, char, {
      width: 100,
      height: 100,
      padding: 5,
      showOutline: true // 显示汉字轮廓
    });

    animateButton.addEventListener('click', function() {
      writer.animateCharacter();
    });

    pronounceButton.addEventListener('click', function() {
      var msg = new SpeechSynthesisUtterance();
      msg.text = char;
      msg.lang = 'zh-CN';
      window.speechSynthesis.speak(msg);
      console.log('播放汉字“' + char + '”的发音');
    });
  });
}

// 创建线条并添加到SVG元素中
function createLine(attributes) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  for (const attr in attributes) {
    line.setAttribute(attr, attributes[attr]);
  }
  return line;
}

// 渲染分页按钮
function renderPagination() {
  var paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';

  var totalPages = Math.ceil(characters.length / pageSize);
  var groupIndex = Math.floor(currentPageIndex / pageGroupSize);
  var startPage = groupIndex * pageGroupSize;
  var endPage = Math.min(startPage + pageGroupSize, totalPages);

  for (var i = startPage; i < endPage; i++) {
    var pageBtn = document.createElement('button');
    pageBtn.innerText = i + 1;
    pageBtn.onclick = (function(i) {
      return function() {
        currentPageIndex = i;
        renderCharacters(i);
        highlightCurrentPageButton(i);
      };
    })(i);
    paginationContainer.appendChild(pageBtn);
  }

  highlightCurrentPageButton(currentPageIndex);
}

// 高亮当前页面按钮
function highlightCurrentPageButton(pageIndex) {
  var buttons = document.getElementById('pagination-container').getElementsByTagName('button');
  for (var button of buttons) {
    button.classList.remove('active');
  }
  buttons[pageIndex % pageGroupSize].classList.add('active');
}

// 上一页按钮点击事件
document.getElementById('prev-page').addEventListener('click', function() {
  if (currentPageIndex > 0) {
    var newPageIndex = currentPageIndex - 1;
    currentPageIndex = newPageIndex;
    renderCharacters(newPageIndex);

    if (newPageIndex % pageGroupSize === pageGroupSize - 1) {
      renderPagination();
    }
    highlightCurrentPageButton(newPageIndex);
  }
});

// 下一页按钮点击事件
document.getElementById('next-page').addEventListener('click', function() {
  var totalPages = Math.ceil(characters.length / pageSize);
  if (currentPageIndex < totalPages - 1) {
    var newPageIndex = currentPageIndex + 1;
    currentPageIndex = newPageIndex;
    renderCharacters(newPageIndex);

    if (newPageIndex % pageGroupSize === 0) {
      renderPagination();
    }
    highlightCurrentPageButton(newPageIndex);
  }
});
