@echo off

echo ==========================
echo Dashboard Publishing
echo ==========================

git add .

git commit -m "Dashboard Data Updated"

git pull origin main --rebase

git push origin main

echo.
echo ==========================
echo Publish Complete
echo ==========================

pause