// 监听导航链接的点击事件
document.querySelector('.navigation').addEventListener('click', function(event) {
  event.preventDefault(); // 阻止链接默认跳转行为
  if (event.target.tagName === 'A' && event.target.dataset.file) {
    // 获取点击的链接对应的HTML文件路径
    const filePath = event.target.dataset.file;
    // 使用fetch方法异步加载HTML文件
    fetch(filePath).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    }).then(html => {
      // 将加载的HTML内容插入到页面的指定容器中
      document.getElementById('content').innerHTML = html;
    }).catch(error => {
      console.error('Error loading the file:', error);
    });
  }
});