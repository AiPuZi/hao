// 确保文档加载完毕后再绑定事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 绑定点击事件到导航栏，使用事件委托
    document.querySelector('.poetry-navigation').addEventListener('click', function(event) {
        event.preventDefault(); // 阻止默认的链接跳转

        var target = event.target; // 获取被点击的元素
        if (target.tagName === 'A') { // 确认点击的是链接
            var category = target.getAttribute('href').substring(1); // 获取分类标识符，移除'#'

            if (category !== 'hanzi') {
                // 非汉字分类，加载对应分类数据
                loadCategoryData(category);
            } else {
                // 汉字分类，调用显示汉字内容的函数
                renderCharacters(0); // 假设你的加载汉字内容的函数名为 renderCharacters
            }
        }
    });
});

function loadCategoryData(category) {
    // 根据分类标识符构造文件路径
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
        title.textContent = item.title; // 假设你的数据中有title字段

        var description = document.createElement('p');
        description.textContent = item.description; // 假设你的数据中有description字段

        textContainer.appendChild(title);
        textContainer.appendChild(description);
    });
}