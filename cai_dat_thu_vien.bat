@echo off
chcp 65001 > nul
echo =======================================================
echo   HE THONG QUAN LY LOP HOC - CAI DAT THU VIEN & DATABASE
echo =======================================================
echo.
echo [1/3] Dang cai dat cac thu vien can thiet (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [LOI] Khong the cai dat cac goi thu vien. Vui long kiem tra Node.js!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Dang dong bo Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [LOI] Khong the khoi tao Prisma Client!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Kiem tra file cau hinh .env...
if not exist ".env" (
    echo DATABASE_URL="file:./dev.db" > .env
    echo Da tao moi file .env thanh cong.
)

echo.
echo =======================================================
echo   CAI DAT HOAN TAT THANH CONG!
echo   Ban co the mo ung dung bang file 'khoi_dong_app.bat'
echo =======================================================
pause
