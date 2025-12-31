// Hello World 基本練習
console.log("Hello, World!");

// 在頁面上顯示 Hello World
document.addEventListener('DOMContentLoaded', () => {
    const heading = document.createElement('h1');
    heading.textContent = 'Hello, World!';
    heading.style.textAlign = 'center';
    heading.style.fontFamily = 'Arial, sans-serif';
    heading.style.color = '#333';
    heading.style.marginTop = '50px';
    document.body.appendChild(heading);
    
    console.log('頁面已載入完成！');
});
  