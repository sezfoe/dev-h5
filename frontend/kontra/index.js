// 等待 DOM 完全載入
document.addEventListener('DOMContentLoaded', () => {
    // 初始化遊戲
    let canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    canvas.width = 800;
    canvas.height = 600;

    let result = kontra.init(canvas);
    let context = result.context;

    // 創建一個移動的方塊
    let sprite = kontra.Sprite({
        x: 100,        // 起始 x 位置
        y: 80,         // 起始 y 位置
        dx: 2,         // 每幀 x 軸移動速度
        dy: 1,         // 每幀 y 軸移動速度
        width: 20,     // 方塊寬度
        height: 20,    // 方塊高度
        color: 'red',  // 方塊顏色
        update: function() {
            this.advance();

            // 碰到邊界時反彈
            if (this.x < 0 || this.x + this.width > canvas.width) {
                this.dx = -this.dx;
            }
            if (this.y < 0 || this.y + this.height > canvas.height) {
                this.dy = -this.dy;
            }
        }
    });

    // 創建遊戲迴圈
    let loop = kontra.GameLoop({
        update: function() {
            sprite.update();
        },
        render: function() {
            // 清除畫布
            context.clearRect(0, 0, canvas.width, canvas.height);
            sprite.render();
        }
    });

    // 開始遊戲迴圈
    loop.start();

    // 返回主頁按鈕
    const btnBackHome = document.getElementById('btnBackHome');
    if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
});

