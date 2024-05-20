document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.navigation').addEventListener('click', function(event) {
        event.preventDefault(); // 阻止默认的链接跳转

        var target = event.target; // 获取被点击的元素
        if (target.tagName === 'A') { // 确认点击的是链接
            var category = target.getAttribute('href').substring(1); // 获取分类标识符，移除'#'

            // 检查点击的是否是“汉字”分类
            if (category === 'chinese') {
                // 重新渲染汉字内容
                currentPageIndex = 0; // 可以设定为首页或保持当前的页码
                renderCharacters(currentPageIndex);
            } else {
                // 加载其他分类的数据
                loadCategoryData(category);
            }
        }
    });
});

function loadCategoryData(category) {
    // 根据分类标识符构造文件路径，这里不会处理'chinese'分类
    var dataFilePath = category + '.json';

    // 使用 Fetch API 异步加载对应分类的JSON数据文件
    fetch(dataFilePath)
        .then(response => response.json())
        .then(data => {
            // 处理数据，渲染到页面上
            renderCategoryContent(data, category);
        })
        .catch(error => {
            console.error('Error fetching data for category:', category, error);
        });
}

function renderCategoryContent(data, category) {
    // 根据数据渲染内容
    var textContainer = document.getElementById('text-container');
    textContainer.innerHTML = ''; // 清空现有内容

    // 假设每项数据都是一个对象，包含title和description
    data.forEach(item => {
        var title = document.createElement('h2');
        title.textContent = item.title;

        var description = document.createElement('p');
        description.textContent = item.description;

        textContainer.appendChild(title);
        textContainer.appendChild(description);
    });
}