// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 前往 A 按鈕
    const btnA = document.getElementById('btnA');
    if (btnA) {
        btnA.addEventListener('click', () => {
            window.location.href = 'a.html';
        });
    }
    
    // 前往 TOOL 按鈕
    const btnTool = document.getElementById('btnTool');
    if (btnTool) {
        btnTool.addEventListener('click', () => {
            window.location.href = 'tool/tool.html';
        });
    }
    
    // 前往 TEST 按鈕
    const btnTest = document.getElementById('btnTest');
    if (btnTest) {
        btnTest.addEventListener('click', () => {
            window.location.href = 'test/test.html';
        });
    }
    
    // 前往 TAILWIND 按鈕
    const btnTailwind = document.getElementById('btnTailwind');
    if (btnTailwind) {
        btnTailwind.addEventListener('click', () => {
            window.location.href = 'tailwind/tailwind.html';
        });
    }
    
    // 前往 KONTRA 按鈕
    const btnKontra = document.getElementById('btnKontra');
    if (btnKontra) {
        btnKontra.addEventListener('click', () => {
            window.location.href = 'kontra/kontra.html';
        });
    }
    
    // 前往 PIXI 按鈕
    const btnPixi = document.getElementById('btnPixi');
    if (btnPixi) {
        btnPixi.addEventListener('click', () => {
            window.location.href = 'pixi/pixi.html';
        });
    }
    
    // 前往 PHASER 按鈕
    const btnPhaser = document.getElementById('btnPhaser');
    if (btnPhaser) {
        btnPhaser.addEventListener('click', () => {
            window.location.href = 'phaser/phaser.html';
        });
    }
});
