@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Meminta akses Administrator (UAC)...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

echo ===================================================
echo   iLovePDF Clone - 1-Click Installer
echo ===================================================
echo Memulai skrip setup PowerShell...
echo.

:: Eksekusi setup.ps1
powershell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0scripts\setup.ps1'"

echo.
echo ===================================================
echo Instalasi Selesai!
echo Silakan tekan tombol apa saja untuk menutup...
pause >nul
