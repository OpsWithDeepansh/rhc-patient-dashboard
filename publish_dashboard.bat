@echo off

echo ==========================
echo Dashboard Publishing
echo ==========================

git add .

git commit -m "Dashboard Data Updated"

git push

echo.
echo ==========================
echo Publish Complete
echo ==========================

pause