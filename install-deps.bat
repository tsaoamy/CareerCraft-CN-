@echo off
set PATH=C:\Users\Admin\.nodejs_portable\node-v22.14.0-win-x64;%PATH%
cd /d c:\Users\Admin\CodeBuddy\20260522172440\careercraft-cn
echo Installing dependencies...
call npm install better-sqlite3 bcryptjs jose uuid echarts echarts-for-react
call npm install -D @types/better-sqlite3 @types/bcryptjs @types/uuid
echo Done!
pause
