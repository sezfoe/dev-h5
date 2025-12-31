:: 編譯 Linux 64 位元執行檔
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=amd64
go build -o app

:: 編譯 Windows 64 位元執行檔
set CGO_ENABLED=0
set GOOS=windows
set GOARCH=amd64
go build -o app.exe

