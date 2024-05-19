// 定义要显示的汉字列表（示例）
var characters = ['我', '你', '他', '她', '它', '们', '是', '在', '的', '一', '二', '三', '四', '五', '六'];
var currentPageIndex = 0; // 当前页码，初始化为 0

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  renderCharacters(currentPageIndex); // 初始加载第一页汉字
});

// 渲染汉字
function renderCharacters(pageIndex) {
    var textContainer = document.getElementById('text-container');
    textContainer.innerHTML = ''; // 清空内容
  
    var start = pageIndex * 9; // 每页显示9个汉字
    var end = start + 9;
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

// 下一页按钮点击事件
document.getElementById('next-page').addEventListener('click', function() {
  if ((currentPageIndex + 1) * 9 < characters.length) {
    currentPageIndex++;
    renderCharacters(currentPageIndex);
  }
});

// 上一页按钮点击事件
document.getElementById('prev-page').addEventListener('click', function() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderCharacters(currentPageIndex);
  }
});