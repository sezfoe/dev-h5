// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 不自動載入
    
    // 啟動 Heart Beat - 每10秒打印當前時間
    setInterval(() => {
        const now = new Date().toLocaleString('zh-TW');
        console.log(`💓 Heart Beat: ${now}`);
    }, 10000); // 10000 毫秒 = 10 秒
    
    // 設置圖片粘貼功能
    const imageContainer = document.getElementById('imageContainer');
    
    // 監聽粘貼事件
    document.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    displayImage(e.target.result);
                };
                
                reader.readAsDataURL(file);
                break;
            }
        }
    });
    
    // 如果 imageContainer 存在，設置點擊事件和焦點
    if (imageContainer) {
        // 監聽容器點擊事件
        imageContainer.addEventListener('click', () => {
            imageContainer.focus();
        });
        
        // 允許容器接收焦點
        imageContainer.setAttribute('tabindex', '0');
    }
    
    // 發送請求按鈕
    const btnSendRequest = document.getElementById('btnSendRequest');
    if (btnSendRequest) {
        btnSendRequest.addEventListener('click', callRoute);
    }
    
    // 返回主頁按鈕
    const btnBackHome = document.getElementById('btnBackHome');
    if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

// 顯示圖片
function displayImage(dataUrl) {
    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
        imageContainer.innerHTML = `<img src="${dataUrl}" style="max-width: 100%; max-height: 500px; display: block; margin: 0 auto;" alt="貼上的圖片">`;
    }
}

// 根據輸入框動態呼叫路由
async function callRoute() {
    const serverEl = document.getElementById('server');
    const routeEl = document.getElementById('route');
    const methodEl = document.querySelector('input[name="method"]:checked');
    const bodyTextEl = document.getElementById('postBody');
    const responseBox = document.getElementById('response');
    const output = document.getElementById('output');
    
    // 檢查必要元素是否存在
    if (!serverEl || !routeEl || !methodEl || !responseBox || !output) {
        console.error('缺少必要的 DOM 元素');
        return;
    }
    
    const server = serverEl.value;
    const route = routeEl.value;
    const method = methodEl.value;
    const bodyText = bodyTextEl ? bodyTextEl.value : '';
    
    // 清空回應框
    responseBox.value = '';
    output.innerHTML = '';
    
    try {
        const options = {
            method: method
        };
        
        // 處理空白路由（等於根路由）
        let url = route.trim() ? `${server}/${route}` : `${server}/`;
        
        // 如果有輸入 body 內容
        if (bodyText.trim()) {
            if (method === 'POST') {
                // POST: 直接發送 JSON body
                options.headers = {
                    'Content-Type': 'application/json'
                };
                options.body = bodyText;
            } else {
                // GET: 將 JSON 轉換成 URL 參數
                try {
                    const jsonData = JSON.parse(bodyText);
                    const params = new URLSearchParams();
                    for (const [key, value] of Object.entries(jsonData)) {
                        params.append(key, String(value));
                    }
                    const queryString = params.toString();
                    if (queryString) {
                        url += '?' + queryString;
                    }
                } catch (e) {
                    output.innerHTML = `錯誤: 無效的 JSON 格式`;
                    return;
                }
            }
        }
        
        const response = await fetch(url, options);
        const text = await response.text();
        console.log('後端回應:', text);
        
        // 在回應框中顯示原始回應
        responseBox.value = text;
        
        // 嘗試美化 JSON 顯示
        try {
            const jsonObj = JSON.parse(text);
            responseBox.value = JSON.stringify(jsonObj, null, 2);
        } catch (e) {
            // 如果不是 JSON，直接顯示原始文本
        }
        
    } catch (error) {
        console.error('無法連接到後端服務器:', error);
        output.innerHTML = `錯誤: 無法連接到後端服務器 - ${error.message}`;
        responseBox.value = `Error: ${error.message}`;
    }
}
