import HanziWriter from 'hanzi-writer';
import pinyin from 'pinyin';

var currentPageIndex = 0; // 当前页码，初始化为 0
var pageSize = 30; // 每页显示的汉字数
var pageGroupSize = 10; // 每组显示的页码数
var characters = []; // 将从 JSON 文件中动态加载

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始加载第一页汉字
  loadCategoryData('chinese.json');
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
  var textContainer = document.getElementById('text-container');
  textContainer.innerHTML = ''; // 清空内容

  var start = currentPageIndex * pageSize; // 计算当前页面的起始汉字索引
  var end = start + pageSize; // 计算当前页面的结束汉字索引
  var pageCharacters = characters.slice(start, end); 
  
    pageCharacters.forEach(function(char, index) {
        var characterBox = document.createElement('div');
        characterBox.classList.add('character-box');
      
        var pinyinDiv = document.createElement('div');
        pinyinDiv.classList.add('pinyin');
        // 使用pinyin库转换汉字为拼音，并简化调用方式
        var charPinyin = pinyin(char);
        // 从二维数组中提取拼音，并将其设置为文本内容
        pinyinDiv.textContent = charPinyin[0][0]; // 正确处理返回值
        characterBox.appendChild(pinyinDiv);
    
        var characterTargetDiv = document.createElement('div');
        characterTargetDiv.classList.add('hanzi');
        characterTargetDiv.id = 'character-target-div-' + (pageIndex * 9 + index); // 为每个汉字创建唯一的ID
        characterBox.appendChild(characterTargetDiv);
    
        var buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('button-container');
    
        // 创建播放动画按钮
        var animateButton = document.createElement('button');
        animateButton.innerHTML = '<i class="fas fa-play"></i>';
        buttonsDiv.appendChild(animateButton);
    
        // 创建发音按钮
        var pronounceButton = document.createElement('button');
        pronounceButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        buttonsDiv.appendChild(pronounceButton);
    
        characterBox.appendChild(buttonsDiv);
        textContainer.appendChild(characterBox);
    
        // 创建汉字写作实例
        var writer = HanziWriter.create(characterTargetDiv.id, char, {
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
            var msg = new SpeechSynthesisUtterance();
            
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

// 渲染分页按钮
function renderPagination() {
  var paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = ''; // 清空分页按钮

  var totalPages = Math.ceil(characters.length / pageSize); // 计算总页数
  var groupIndex = Math.floor(currentPageIndex / pageGroupSize); // 当前页码组索引
  var startPage = groupIndex * pageGroupSize; // 当前页码组的起始页码
  var endPage = Math.min(startPage + pageGroupSize, totalPages); // 当前页码组的结束页码

  // 添加上一页按钮
  var prevPageButton = document.createElement('button');
  prevPageButton.id = 'prev-page';
  prevPageButton.innerHTML = '&lt;'; // 使用 < 字符
  prevPageButton.onclick = showPrevPage;
  prevPageButton.disabled = currentPageIndex === 0;
  paginationContainer.appendChild(prevPageButton);

  // 添加页码按钮
  for (var i = startPage; i < endPage; i++) {
    var pageBtn = document.createElement('button');
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

  // 添加下一页按钮
  var nextPageButton = document.createElement('button');
  nextPageButton.id = 'next-page';
  nextPageButton.innerHTML = '&gt;'; // 使用 > 字符
  nextPageButton.onclick = showNextPage;
  nextPageButton.disabled = currentPageIndex === totalPages - 1;
  paginationContainer.appendChild(nextPageButton);
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
  var totalPages = Math.ceil(characters.length / pageSize);
  if (currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    renderCharacters();
    renderPagination();
  }
}
