# Paksa TLS 1.2 untuk menghindari error Invoke-WebRequest dan choco
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host "Memeriksa instalasi Chocolatey..." -ForegroundColor Cyan
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey belum terinstal. Sedang menginstal..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey sudah terinstal." -ForegroundColor Green
}

Write-Host "`nMenginstal dependensi sistem via Chocolatey..." -ForegroundColor Cyan
choco install nodejs libreoffice ghostscript qpdf tesseract chromium -y

Write-Host "`nMenyiapkan Poppler (Manual Download)..." -ForegroundColor Cyan
$PopplerDir = Join-Path $ProjectRoot "backend\poppler"
if (!(Test-Path (Join-Path $PopplerDir "poppler-24.02.0\Library\bin\pdftoppm.exe"))) {
    Write-Host "Mengunduh Poppler v24.02.0..." -ForegroundColor Yellow
    $PopplerZip = Join-Path $ProjectRoot "backend\poppler.zip"
    try {
        Invoke-WebRequest -Uri "https://github.com/oschwartz10612/poppler-windows/releases/download/v24.02.0-0/Release-24.02.0-0.zip" -OutFile $PopplerZip
        Write-Host "Mengekstrak Poppler..." -ForegroundColor Yellow
        Expand-Archive -Path $PopplerZip -DestinationPath $PopplerDir -Force
        Remove-Item $PopplerZip -Force
        Write-Host "Poppler berhasil dipasang secara lokal!" -ForegroundColor Green
    } catch {
        Write-Host "Gagal mengunduh Poppler: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Poppler sudah terpasang." -ForegroundColor Green
}

Write-Host "`nMenyiapkan Environment Variables (.env)..." -ForegroundColor Cyan
$BackendEnvExample = Join-Path $ProjectRoot "backend\.env.example"
$BackendEnv = Join-Path $ProjectRoot "backend\.env"
if (!(Test-Path $BackendEnv) -and (Test-Path $BackendEnvExample)) {
    Copy-Item $BackendEnvExample $BackendEnv
    Write-Host "File backend/.env berhasil diduplikasi dari .env.example." -ForegroundColor Green
}

$FrontendEnv = Join-Path $ProjectRoot "frontend\.env"
if (!(Test-Path $FrontendEnv)) {
    Set-Content -Path $FrontendEnv -Value "VITE_API_BASE_URL=http://localhost:3001/api"
    Write-Host "File frontend/.env berhasil dibuat." -ForegroundColor Green
}

Write-Host "`nMenginstal Node Modules (Ini mungkin memakan waktu beberapa menit)..." -ForegroundColor Cyan

# Refresh Environment Variables untuk memastikan npm dikenali jika NodeJS baru diinstall
foreach($level in "Machine","User") {
    [Environment]::GetEnvironmentVariables($level).GetEnumerator() | ForEach-Object {
        if ($_.Key -eq 'Path') {
            $env:Path += ";$($_.Value)"
        }
    }
}

Set-Location $ProjectRoot
Write-Host ">> Menginstal root dependencies..." -ForegroundColor Yellow
cmd /c "npm install"

Set-Location (Join-Path $ProjectRoot "frontend")
Write-Host ">> Menginstal frontend dependencies..." -ForegroundColor Yellow
cmd /c "npm install"

Set-Location (Join-Path $ProjectRoot "backend")
Write-Host ">> Menginstal backend dependencies..." -ForegroundColor Yellow
cmd /c "npm install"

Set-Location $ProjectRoot
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "Setup Berhasil Selesai!" -ForegroundColor Green
Write-Host "Anda sekarang bisa menjalankan 'start.bat' untuk memulai server." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
