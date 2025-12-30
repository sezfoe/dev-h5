// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 前往 Teach 按鈕
    const btnTeach = document.getElementById('btnTeach');
    if (btnTeach) {
        btnTeach.addEventListener('click', () => {
            window.location.href = 'teach/';
        });
    }
    
    // 前往 TOOL 按鈕
    const btnTool = document.getElementById('btnTool');
    if (btnTool) {
        btnTool.addEventListener('click', () => {
            window.location.href = 'tool/';
        });
    }
    
    // 前往 TEST 按鈕
    const btnTest = document.getElementById('btnTest');
    if (btnTest) {
        btnTest.addEventListener('click', () => {
            window.location.href = 'test/';
        });
    }
    
    // 前往 TAILWIND 按鈕
    const btnTailwind = document.getElementById('btnTailwind');
    if (btnTailwind) {
        btnTailwind.addEventListener('click', () => {
            window.location.href = 'tailwind/';
        });
    }
    
    // 前往 KONTRA 按鈕
    const btnKontra = document.getElementById('btnKontra');
    if (btnKontra) {
        btnKontra.addEventListener('click', () => {
            window.location.href = 'kontra/';
        });
    }
    
    // 前往 PIXI 按鈕
    const btnPixi = document.getElementById('btnPixi');
    if (btnPixi) {
        btnPixi.addEventListener('click', () => {
            window.location.href = 'pixi/';
        });
    }
    
    // 前往 PHASER 按鈕
    const btnPhaser = document.getElementById('btnPhaser');
    if (btnPhaser) {
        btnPhaser.addEventListener('click', () => {
            window.location.href = 'phaser/';
        });
    }
});
