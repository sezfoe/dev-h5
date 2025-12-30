// Phaser 遊戲配置
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-container',
    backgroundColor: 0x1099bb,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// 創建遊戲實例
const game = new Phaser.Game(config);

// 預載入資源
function preload() {
    // 此範例不需要載入資源
}

// 創建場景
function create() {
    // 創建一個移動的紅色方塊
    this.rect = this.add.rectangle(100, 100, 50, 50, 0xff0000);
    
    // 移動速度
    this.speedX = 2;
    this.speedY = 1.5;
}

// 更新場景
function update() {
    // 更新位置
    this.rect.x += this.speedX;
    this.rect.y += this.speedY;
    
    // 邊界反彈
    if (this.rect.x <= this.rect.width / 2 || this.rect.x >= config.width - this.rect.width / 2) {
        this.speedX = -this.speedX;
    }
    if (this.rect.y <= this.rect.height / 2 || this.rect.y >= config.height - this.rect.height / 2) {
        this.speedY = -this.speedY;
    }
}

// 返回主頁按鈕
const btnBackHome = document.getElementById('btnBackHome');
if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}

