@echo off
chcp 65001 >nul
echo ========================================
echo   CareerCraft CN - 安装和启动脚本
echo ========================================
echo.

:: Set Node.js path
set "NODE_PATH=C:\Users\Admin\.workbuddy\binaries\node\versions\20.18.0.installing.76508.__extract_temp__\node-v20.18.0-win-x64"
set "PATH=%NODE_PATH%;%PATH%"

:: Clean old lock file if exists
if exist package-lock.json (
    echo [1/3] 清理旧的 lock 文件...
    del package-lock.json 2>nul
)

echo [2/3] 安装依赖（首次需 1-2 分钟）...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 安装失败，请检查网络连接后重试
    pause
    exit /b 1
)

echo.
echo [3/3] 启动开发服务器...
echo.
echo ✅ 启动成功！访问 http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.
call npm run dev

pause
