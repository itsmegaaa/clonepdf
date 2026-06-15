# Local Setup Guide

> Panduan jalanin ilovepdf-clone di lokal (Windows / macOS / Linux/WSL).

---

## Prerequisites

### 1. Node.js
```bash
node -v   # minimal v20
npm -v
```
Kalau belum ada → download di https://nodejs.org

### 2. System dependencies

#### Windows (pakai Chocolatey)
```powershell
# Install Chocolatey dulu kalau belum ada
# https://chocolatey.org/install

choco install libreoffice ghostscript qpdf poppler tesseract chromium -y
```

#### macOS (pakai Homebrew)
```bash
brew install libreoffice ghostscript qpdf poppler tesseract tesseract-lang chromium
```

#### Ubuntu / Debian / WSL
```bash
sudo apt-get update && sudo apt-get install -y \
  libreoffice \
  ghostscript \
  qpdf \
  poppler-utils \
  tesseract-ocr \
  tesseract-ocr-ind \
  tesseract-ocr-eng \
  chromium-browser
```

---

## Clone & Install

```bash
git clone https://github.com/username/ilovepdf-clone.git
cd ilovepdf-clone

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps
cd backend && npm install && cd ..
```

---

## Environment Variables

### Backend
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=3001

# Sesuaikan path binary di sistem lo
# Windows contoh:
LIBREOFFICE_PATH=C:\Program Files\LibreOffice\program\soffice.exe
GHOSTSCRIPT_PATH=C:\Program Files\gs\gs10.x\bin\gswin64c.exe
QPDF_PATH=C:\Program Files\qpdf\bin\qpdf.exe
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe

# macOS / Linux contoh:
# LIBREOFFICE_PATH=/usr/bin/soffice
# GHOSTSCRIPT_PATH=/usr/bin/gs
# QPDF_PATH=/usr/bin/qpdf
# TESSERACT_PATH=/usr/bin/tesseract

UPLOAD_DIR=./tmp/uploads
OUTPUT_DIR=./tmp/outputs
FILE_TTL_MINUTES=30
MAX_FILE_SIZE_MB=50
CORS_ORIGIN=http://localhost:5173
```

### Frontend
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## Jalanin

Buka **2 terminal** terpisah:

### Terminal 1 — Backend
```bash
cd backend
npm run dev
# Running on http://localhost:3001
```

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

Buka browser → `http://localhost:5173`

---

## Verifikasi binary (opsional)

Kalau ragu path binarynya bener apa engga, test manual dulu:

```bash
# LibreOffice
soffice --version

# Ghostscript
gs --version

# qpdf
qpdf --version

# Poppler
pdftotext -v

# Tesseract
tesseract --version
```

---

## Notes

- Tool yang **client-side** (Merge, Split, Rotate, dll) → langsung jalan tanpa backend, bahkan tanpa install system deps
- Tool yang **butuh backend** (Compress, Office conversion, OCR, dll) → backend harus jalan + binary harus terinstall
- Puppeteer (HTML to PDF) → otomatis download Chromium sendiri waktu `npm install`, tapi kalau mau pakai Chromium yang udah ada di sistem, set `PUPPETEER_EXECUTABLE_PATH` di `.env`
