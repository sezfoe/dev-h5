// 創建 PixiJS 應用
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    antialias: true
});

// 將畫布添加到容器
const container = document.getElementById('pixi-container');
if (container) {
    container.appendChild(app.view);
}

// 創建一個移動的紅色方塊
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFF0000); // 紅色填充
rectangle.drawRect(0, 0, 50, 50); // 繪製矩形
rectangle.endFill();

// 設置初始位置
rectangle.x = 100;
rectangle.y = 100;

// 移動速度
let dx = 2;
let dy = 1.5;

// 將矩形添加到舞台
app.stage.addChild(rectangle);

// 遊戲循環
app.ticker.add((delta) => {
    // 更新位置
    rectangle.x += dx;
    rectangle.y += dy;
    
    // 邊界反彈
    if (rectangle.x <= 0 || rectangle.x + rectangle.width >= app.screen.width) {
        dx = -dx;
    }
    if (rectangle.y <= 0 || rectangle.y + rectangle.height >= app.screen.height) {
        dy = -dy;
    }
});

// 返回主頁按鈕
const btnBackHome = document.getElementById('btnBackHome');
if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

