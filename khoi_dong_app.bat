@echo off
chcp 65001 > nul
echo =======================================================
echo   DANG KHOI DONG HE THONG QUAN LY LOP HOC (WEBAPP)
echo =======================================================
echo.
echo He thong dang duoc mo tai: http://localhost:3000
start "" "http://localhost:3000"
echo.
echo May chu dang chay... (Nhan Ctrl + C de dong)
echo.
call npm run dev
pause
