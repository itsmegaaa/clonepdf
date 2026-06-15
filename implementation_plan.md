# iLovePDF Clone — Local Setup Implementation Plan (Windows)

> Target: Jalanin semua **28 PDF tools** di **lokal Windows** (localhost:5173 + localhost:3001). **100% gratis, no paid API.**
> Referensi: [ilovepdf-clone-spec-v2.md](file:///c:/Project/Clone%20ILopPdf/ilovepdf-clone-spec-v2.md) · [local-setup.md](file:///c:/Project/Clone%20ILopPdf/local-setup.md)

---

## Open Questions

> [!IMPORTANT]
> Sebelum mulai, konfirmasi dulu:

1. **Ada kode existing?** Spec menyebut "JPG to PDF ✅ sudah selesai" — ada file yang sudah dibuat di `c:\Project\Clone ILopPdf\` atau mulai dari nol?
2. **Chocolatey sudah terinstall?** Diperlukan untuk install system deps (LibreOffice, Ghostscript, dll) di Windows.
3. **Mau langsung semua phase sekaligus, atau bertahap phase per phase?**

---

## Arsitektur Lokal

```
Browser (localhost:5173)
    ↓ HTTP
Frontend — Vite + React (port 5173)
    ↓ axios /api/*
Backend — Express.js (port 3001)
    ↓ spawn process
System Binaries (Windows):
  - LibreOffice  → C:\Program Files\LibreOffice\program\soffice.exe
  - Ghostscript  → C:\Program Files\gs\gs10.x\bin\gswin64c.exe
  - qpdf         → C:\Program Files\qpdf\bin\qpdf.exe
  - Tesseract    → C:\Program Files\Tesseract-OCR\tesseract.exe
  - Poppler      → via choco (pdftotext, pdftoppm)
  - Chromium     → auto-download via Puppeteer (npm install)
```

---

## Proposed Changes

### Step 0 — Install System Dependencies (Windows)

> [!WARNING]
> **Windows paths**: Binary Windows harus dikonfigurasi di `.env`. Tidak ada `ANTHROPIC_API_KEY` — v2 tidak pakai API berbayar sama sekali.

> [!TIP]
> Mulai dari Phase 1 (client-side tools) dulu — 12 tools bisa langsung jalan di browser tanpa install system deps apapun.

> [!NOTE]
> **Protect PDF** di v2 pindah ke backend (qpdf) untuk enkripsi yang lebih kuat (256-bit AES), menggantikan AES-128 dari pdf-lib.

**Cek Chocolatey:**
```powershell
choco -v
```
Kalau belum ada → install dari https://chocolatey.org/install

**Install system deps via Chocolatey:**
```powershell
choco install libreoffice ghostscript qpdf poppler tesseract chromium -y
```

**Verifikasi setelah install:**
```powershell
soffice --version
gswin64c --version   # atau gs --version
qpdf --version
pdftotext -v
tesseract --version
```

---

### Step 1 — Scaffold Project

#### [NEW] `c:\Project\Clone ILopPdf\` — Struktur Folder

```
Clone ILopPdf/
├── frontend/          ← React 18 + Vite + Tailwind CSS
├── backend/           ← Express.js API server
├── ilovepdf-clone-spec.md
├── local-setup.md
└── README.md
```

**Frontend scaffold:**
```powershell
cd "c:\Project\Clone ILopPdf"
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Frontend dependencies:**
```powershell
npm install react-router-dom react-dropzone pdfjs-dist pdf-lib axios zustand lucide-react react-hot-toast @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities signature_pad fabric
```

**Backend scaffold:**
```powershell
cd "c:\Project\Clone ILopPdf"
mkdir backend
cd backend
npm init -y
```

**Backend dependencies:**
```powershell
npm install express multer cors dotenv express-rate-limit fs-extra execa uuid tesseract.js puppeteer sharp pdf-lib node-cron
npm install -D nodemon
```

---

### Step 2 — Environment Config

#### [NEW] `backend/.env` (copy dari .env.example, sesuaikan path Windows)

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

#### [NEW] `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

### Step 3 — Phase 1: Foundation (Shared Components)

File-file ini dibangun pertama karena dipakai oleh semua 28 tool pages.

#### [NEW] `frontend/src/constants/tools.js`
- Data 28 tools: `id, name, desc, icon, category, route, accept, multiple, clientSide`
- Kategori: `organize | optimize | convert | edit | security`

#### [NEW] `frontend/src/components/Navbar.jsx`
- Logo + navigation links

#### [NEW] `frontend/src/components/Footer.jsx`

#### [NEW] `frontend/src/components/DropZone.jsx`
- Drag-and-drop / click upload
- Validasi size (max 50MB dari env)
- Validasi file type per tool

#### [NEW] `frontend/src/components/ToolCard.jsx`
- Card homepage: icon, nama, deskripsi, klik → navigate

#### [NEW] `frontend/src/components/PdfPreview.jsx`
- Render PDF via `pdfjs-dist` ke `<canvas>`

#### [NEW] `frontend/src/components/ProgressBar.jsx`
- Animated progress, 0–100%

#### [NEW] `frontend/src/components/ToolLayout.jsx`
- Shared layout **semua tool pages**:
  ```
  DropZone → Preview → Options → Action Button → Progress → Result (Download + Reset)
  ```

#### [NEW] `frontend/src/store/useToolStore.js`
- Zustand: `files, isProcessing, progress, result, error`

#### [NEW] `frontend/src/utils/api.js`
- axios instance `baseURL = VITE_API_BASE_URL`

#### [NEW] `frontend/src/utils/clientPdf.js`
- Helper pdf-lib: `mergePdfs`, `splitPdf`, `rotatePdf`, `addWatermark`, dll

#### [NEW] `frontend/src/utils/fileHelpers.js`
- `formatFileSize`, `validateFileSize`, `downloadBlob`

#### [NEW] `frontend/src/App.jsx`
- React Router v6 dengan semua 28 routes (lazy loaded)

#### [NEW] `frontend/src/pages/Home.jsx`
- Filter tabs: All | Organize | Optimize | Convert | Edit | Security
- Grid ToolCard

---

### Step 4 — Phase 2: Client-Side Tools (Jalan Tanpa Backend)

> [!TIP]
> **Bisa langsung ditest di browser** tanpa install system deps apapun. Mulai dari sini dulu!

## Breakdown 28 Tools — Summary

> [!NOTE]
> **v2 changes vs v1**: Dihapus — AI Summarizer & Translate PDF (butuh Anthropic API berbayar). Protect PDF dipindah dari client-side ke backend (qpdf). Total: 28 tools.

| # | Tool | Impl | Phase |
|---|---|---|---|
| 1 | JPG to PDF ✅ | pdf-lib (client) | 1 |
| 2 | Merge PDF | pdf-lib (client) | 1 |
| 3 | Split PDF | pdf-lib (client) | 1 |
| 4 | Rotate PDF | pdf-lib (client) | 1 |
| 5 | Organize PDF | pdf-lib + dnd-kit (client) | 1 |
| 6 | Watermark PDF | pdf-lib (client) | 1 |
| 7 | Page Numbers | pdf-lib (client) | 1 |
| 8 | Redact PDF | pdf-lib (client) | 1 |
| 9 | Crop PDF | pdf-lib (client) | 1 |
| 10 | PDF Forms | pdf-lib (client) | 1 |
| 11 | Sign PDF | pdf-lib + signature_pad (client) | 1 |
| 12 | Scan to PDF | Camera API + pdf-lib (client) | 1 |
| 13 | Compress PDF | Ghostscript (backend) | 2 |
| 14 | Word to PDF | LibreOffice (backend) | 2 |
| 15 | PowerPoint to PDF | LibreOffice (backend) | 2 |
| 16 | Excel to PDF | LibreOffice (backend) | 2 |
| 17 | PDF to Word | LibreOffice (backend) | 2 |
| 18 | PDF to PowerPoint | LibreOffice (backend) | 2 |
| 19 | PDF to Excel | LibreOffice (backend) | 2 |
| 20 | PDF to JPG | Poppler (backend) | 2 |
| 21 | HTML to PDF | Puppeteer (backend) | 2 |
| 22 | Unlock PDF | qpdf (backend) | 2 |
| 23 | Protect PDF | qpdf (backend) | 2 |
| 24 | OCR PDF | tesseract.js (backend) | 2 |
| 25 | Repair PDF | qpdf/Ghostscript (backend) | 2 |
| 26 | PDF to PDF/A | Ghostscript (backend) | 2 |
| 27 | Edit PDF | fabric.js + pdf-lib (client) | 3 |
| 28 | Compare PDF | Poppler + diff (backend) | 3 |

---

### Step 5 — Phase 3: Backend Setup

#### [NEW] `backend/src/app.js`
- Express + cors + json + rate limiting
- Mount routes
- Global error handler
- Buat folder `tmp/uploads` & `tmp/outputs` otomatis saat startup

#### [NEW] `backend/src/middleware/upload.js`
- Multer: simpan ke `UPLOAD_DIR`, max 50MB

#### [NEW] `backend/src/middleware/rateLimit.js`
- 100 req/15 menit per IP

#### [NEW] `backend/src/middleware/cleanup.js`
- `node-cron`: setiap 5 menit hapus file > 30 menit di tmp folder

#### [NEW] `backend/src/utils/runCommand.js`
- `execa` wrapper — baca path binary dari `.env`

#### [NEW] `backend/src/utils/ghostscript.js`
- `compress(input, output, level)` → `gswin64c.exe -dPDFSETTINGS=/screen|/ebook|/prepress`
- `toPdfa(input, output)` → `-dPDFA=2`
- `repair(input, output)`

#### [NEW] `backend/src/utils/libreoffice.js`
- `convert(input, outputDir, format)` → `soffice.exe --headless --convert-to {format}`

#### [NEW] `backend/src/utils/qpdf.js`
- `protect(input, output, opts)`
- `unlock(input, output, password)`
- `repair(input, output)`

#### [NEW] `backend/src/utils/poppler.js`
- `extractText(input)` → `pdftotext`
- `toImages(input, outputDir, dpi)` → `pdftoppm`

#### [NEW] `backend/src/utils/tempDir.js`
- Generate UUID-based temp paths

#### [NEW] `backend/package.json` — scripts:
```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

---

### Step 6 — Phase 4: Backend Routes (Tools yang Butuh Server)

#### [NEW] `backend/src/routes/compress.js`
- `POST /api/compress` → Ghostscript

#### [NEW] `backend/src/routes/convert.js`
- `POST /api/convert/pdf-to-word` → LibreOffice → .docx
- `POST /api/convert/pdf-to-excel` → LibreOffice → .xlsx
- `POST /api/convert/pdf-to-powerpoint` → LibreOffice → .pptx
- `POST /api/convert/word-to-pdf` → LibreOffice
- `POST /api/convert/excel-to-pdf` → LibreOffice
- `POST /api/convert/ppt-to-pdf` → LibreOffice
- `POST /api/convert/pdf-to-pdfa` → Ghostscript

#### [NEW] `backend/src/routes/image.js`
- `POST /api/convert/pdf-to-jpg` → Poppler pdftoppm → ZIP

#### [NEW] `backend/src/routes/security.js`
- `POST /api/protect` → qpdf (`qpdf --encrypt`)
- `POST /api/unlock` → qpdf (`qpdf --decrypt --password=xxx`)

#### [NEW] `backend/src/routes/ocr.js`
- `POST /api/ocr` → tesseract.js → searchable PDF

#### [NEW] `backend/src/routes/htmlToPdf.js`
- `POST /api/convert/html-to-pdf` → Puppeteer (auto pakai Chromium yang didownload npm)

#### [NEW] `backend/src/routes/repair.js`
- `POST /api/repair` → qpdf, fallback Ghostscript

#### [NEW] `backend/src/routes/compare.js`
- `POST /api/compare` → Poppler extract teks + diff → return differences

#### [NEW] `backend/src/routes/download.js`
- `GET /api/download/:fileId` → stream file ke browser

---

### Step 7 — Phase 5: Advanced Frontend Tools

#### [NEW] `frontend/src/pages/tools/EditPdf.jsx`
- PDF.js render + fabric.js overlay canvas
- Tambah teks, gambar, shapes, freehand
- Export via pdf-lib

#### [NEW] `frontend/src/pages/tools/ComparePdf.jsx`
- Upload 2 PDF → `POST /api/compare`
- Side-by-side dengan highlight diff

#### Remaining backend-dependent pages:
- `CompressPdf.jsx`, `PdfToWord.jsx`, `PdfToPowerPoint.jsx`, `PdfToExcel.jsx`
- `WordToPdf.jsx`, `PowerPointToPdf.jsx`, `ExcelToPdf.jsx`
- `PdfToJpg.jsx`, `HtmlToPdf.jsx`, `UnlockPdf.jsx`, `ProtectPdf.jsx`
- `OcrPdf.jsx`, `PdfToPdfa.jsx`, `RepairPdf.jsx`

---

## Urutan Pengerjaan (Prioritas Lokal)

```
Step 0  → Install Chocolatey + system deps          [~30 menit, sekali saja]
Step 1  → Scaffold frontend & backend               [~30 menit]
Step 2  → Setup .env dengan Windows paths           [~15 menit]
Step 3  → Foundation components & layout            [~2-3 jam]
Step 4  → 13 client-side tools (Phase 2)            [~4-6 jam] ← BISA TEST DULU DI SINI
Step 5  → Backend setup + utils                     [~2-3 jam]
Step 6  → Backend routes                            [~6-8 jam]
Step 7  → Advanced tools + sisa pages               [~4-5 jam]
```

---

## Cara Jalanin Lokal

Buka **2 terminal** terpisah di `c:\Project\Clone ILopPdf\`:

```powershell
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

Buka browser → `http://localhost:5173`

---

## Notes Penting

> [!WARNING]
> **Windows path separator**: Di `.env`, gunakan backslash `\` atau escape `\\` untuk path binary Windows. Backend `runCommand.js` harus baca dari env variable, bukan hardcode path Linux.

> [!NOTE]
> **Puppeteer**: Otomatis download Chromium saat `npm install`. Tidak perlu install Chromium manual kecuali mau pakai yang sudah ada — set `PUPPETEER_EXECUTABLE_PATH` di `.env`.

> [!TIP]
> **Client-side tools dulu**: 13 tools Phase 2 (Merge, Split, Rotate, dll) bisa langsung jalan di browser **tanpa backend** dan **tanpa install system deps**. Mulai dari sini untuk hasil tercepat!
