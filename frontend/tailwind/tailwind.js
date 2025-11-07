// tailwind.js
console.log("1234")

// 展開文字框到螢幕寬度
function expandTextBox() {
    const textBox = document.getElementById('textBox');
    // 使用 Tailwind CSS 類切換寬度
    if (textBox.classList.contains('w-[200px]')) {
        textBox.classList.remove('w-[200px]');
        textBox.classList.add('w-[400px]');
    } else {
        textBox.classList.remove('w-[400px]');
        textBox.classList.add('w-[200px]');
    }
}

// 初始化事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 展開文字框按鈕
    const btnExpand = document.getElementById('btnExpand');
    if (btnExpand) {
        btnExpand.addEventListener('click', expandTextBox);
    }
    
    // 返回主頁按鈕
    const btnBackHome = document.getElementById('btnBackHome');
    if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

