import signal, time

def term_handler(sig, frame):
    print("收到 SIGTERM，正在安全關閉...")
    time.sleep(2)
    print("關閉完成")
    exit(0)

def int_handler(sig, frame):
    print("收到 Ctrl+C (SIGINT)，正在安全關閉...")
    time.sleep(2)
    print("關閉完成")
    exit(0)

signal.signal(signal.SIGTERM, term_handler)
signal.signal(signal.SIGINT, int_handler)

print("服務啟動中")
while True:
    time.sleep(1)
    print("服務運行中...")
