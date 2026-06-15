# iLovePDF Clone — Project Specification (No Paid APIs)

> Full-stack web app kloning ilovepdf.com — semua fitur 100% gratis, open source, jalan di lokal.
> Dokumen ini adalah spec lengkap untuk code generation (Codex / AI coding tools).

---

## Tech Stack

### Frontend
| Layer | Library/Tool |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| File Upload | react-dropzone |
| PDF Render (preview) | pdfjs-dist (Mozilla PDF.js) |
| PDF Manipulation (client) | pdf-lib |
| HTTP Client | axios |
| State Management | Zustand |
| Icons | lucide-react |
| Notifications | react-hot-toast |
| Drag & Drop reorder | @dnd-kit/core |
| Signature drawing | signature_pad |
| Canvas editor | fabric.js |

### Backend
| Layer | Library/Tool |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| File Upload | multer |
| Temp Files | tmp + fs-extra |
| Office → PDF | LibreOffice (soffice CLI) |
| PDF Compress | Ghostscript (gs CLI) |
| PDF → Text/Image | poppler-utils (pdftotext, pdftoppm) |
| OCR | tesseract.js |
| HTML → PDF | Puppeteer |
| PDF Protect/Unlock | qpdf |
| Image Processing | sharp |
| Process Runner | execa |

### Infrastructure
| | |
|---|---|
| File storage (temp) | Local disk via multer + auto-cleanup cron |
| Env config | dotenv |
| CORS | cors middleware |
| Rate limiting | express-rate-limit |

---

## Project Structure

```
ilovepdf-clone/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ToolCard.jsx
│   │   │   ├── DropZone.jsx
│   │   │   ├── PdfPreview.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── ToolLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── tools/
│   │   │       ├── MergePdf.jsx
│   │   │       ├── SplitPdf.jsx
│   │   │       ├── CompressPdf.jsx
│   │   │       ├── PdfToWord.jsx
│   │   │       ├── PdfToPowerPoint.jsx
│   │   │       ├── PdfToExcel.jsx
│   │   │       ├── WordToPdf.jsx
│   │   │       ├── PowerPointToPdf.jsx
│   │   │       ├── ExcelToPdf.jsx
│   │   │       ├── EditPdf.jsx
│   │   │       ├── PdfToJpg.jsx
│   │   │       ├── JpgToPdf.jsx
│   │   │       ├── SignPdf.jsx
│   │   │       ├── WatermarkPdf.jsx
│   │   │       ├── RotatePdf.jsx
│   │   │       ├── HtmlToPdf.jsx
│   │   │       ├── UnlockPdf.jsx
│   │   │       ├── ProtectPdf.jsx
│   │   │       ├── OrganizePdf.jsx
│   │   │       ├── PdfToPdfa.jsx
│   │   │       ├── RepairPdf.jsx
│   │   │       ├── PageNumbers.jsx
│   │   │       ├── ScanToPdf.jsx
│   │   │       ├── OcrPdf.jsx
│   │   │       ├── ComparePdf.jsx
│   │   │       ├── RedactPdf.jsx
│   │   │       ├── CropPdf.jsx
│   │   │       └── PdfForms.jsx
│   │   ├── store/
│   │   │   └── useToolStore.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── clientPdf.js
│   │   │   └── fileHelpers.js
│   │   ├── constants/
│   │   │   └── tools.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── merge.js
│   │   │   ├── split.js
│   │   │   ├── compress.js
│   │   │   ├── convert.js
│   │   │   ├── image.js
│   │   │   ├── edit.js
│   │   │   ├── security.js
│   │   │   ├── ocr.js
│   │   │   ├── htmlToPdf.js
│   │   │   ├── repair.js
│   │   │   ├── compare.js
│   │   │   ├── redact.js
│   │   │   └── download.js
│   │   ├── middleware/
│   │   │   ├── upload.js
│   │   │   ├── rateLimit.js
│   │   │   └── cleanup.js
│   │   ├── utils/
│   │   │   ├── runCommand.js
│   │   │   ├── ghostscript.js
│   │   │   ├── libreoffice.js
│   │   │   ├── qpdf.js
│   │   │   ├── poppler.js
│   │   │   └── tempDir.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Frontend Routes

```
/                          → Home (grid semua tools)
/merge-pdf                 → Merge PDF
/split-pdf                 → Split PDF
/compress-pdf              → Compress PDF
/pdf-to-word               → PDF to Word
/pdf-to-powerpoint         → PDF to PowerPoint
/pdf-to-excel              → PDF to Excel
/word-to-pdf               → Word to PDF
/powerpoint-to-pdf         → PowerPoint to PDF
/excel-to-pdf              → Excel to PDF
/edit-pdf                  → Edit PDF
/pdf-to-jpg                → PDF to JPG
/jpg-to-pdf                → JPG to PDF
/sign-pdf                  → Sign PDF
/watermark-pdf             → Watermark PDF
/rotate-pdf                → Rotate PDF
/html-to-pdf               → HTML to PDF
/unlock-pdf                → Unlock PDF
/protect-pdf               → Protect PDF
/organize-pdf              → Organize PDF
/pdf-to-pdfa               → PDF to PDF/A
/repair-pdf                → Repair PDF
/page-numbers              → Page Numbers
/scan-to-pdf               → Scan to PDF
/ocr-pdf                   → OCR PDF
/compare-pdf               → Compare PDF
/redact-pdf                → Redact PDF
/crop-pdf                  → Crop PDF
/pdf-forms                 → PDF Forms
```

---

## Backend API Endpoints

Semua endpoint menerima `multipart/form-data` kecuali yang disebut khusus.
Response sukses: `{ success: true, fileId: "uuid", filename: "hasil.pdf" }`
Download file: `GET /api/download/:fileId`

```
POST /api/merge              body: files[] (multiple PDFs)
POST /api/split              body: file (1 PDF), options: { mode: "range"|"every", ranges: "1-3,5" }
POST /api/compress           body: file (PDF), options: { level: "low"|"medium"|"high" }
POST /api/rotate             body: file (PDF), options: { angle: 90|180|270, pages: "all"|"1,3" }
POST /api/watermark          body: file (PDF), options: { text, opacity, position, fontSize, color }
POST /api/page-numbers       body: file (PDF), options: { position, startAt, fontSize }
POST /api/crop               body: file (PDF), options: { top, right, bottom, left, pages }
POST /api/protect            body: file (PDF), options: { password, ownerPassword, permissions[] }
POST /api/unlock             body: file (PDF), options: { password }
POST /api/redact             body: file (PDF), options: { areas: [{page, x, y, w, h}] }
POST /api/repair             body: file (PDF)
POST /api/organize           body: file (PDF), options: { pageOrder: [2,1,3], deletePages: [4] }
POST /api/convert/pdf-to-word        body: file (PDF)
POST /api/convert/pdf-to-excel       body: file (PDF)
POST /api/convert/pdf-to-powerpoint  body: file (PDF)
POST /api/convert/word-to-pdf        body: file (.docx/.doc)
POST /api/convert/excel-to-pdf       body: file (.xlsx/.xls)
POST /api/convert/ppt-to-pdf         body: file (.pptx/.ppt)
POST /api/convert/pdf-to-pdfa        body: file (PDF)
POST /api/convert/pdf-to-jpg         body: file (PDF), options: { quality: 1-100, pages: "all"|"1,3" }
POST /api/convert/jpg-to-pdf         body: files[] (images), options: { orientation, pageSize, margin, merge }
POST /api/convert/html-to-pdf        body: { url } (JSON), Content-Type: application/json
POST /api/ocr                body: file (PDF or image), options: { lang: "ind"|"eng"|"auto" }
POST /api/compare            body: file1 (PDF), file2 (PDF)
GET  /api/download/:fileId   → stream file ke client
```

---

## Features — Detail per Tool

### 1. Merge PDF
- Upload multiple PDF
- Preview thumbnail tiap PDF (halaman pertama)
- Drag-and-drop reorder antar file
- Output: 1 PDF gabungan
- **Implementasi:** `pdf-lib` client-side

### 2. Split PDF
- Upload 1 PDF
- Mode: by range (contoh: "1-3, 5, 7-9") atau split every N pages
- Preview halaman dengan PDF.js
- Output: ZIP berisi beberapa PDF
- **Implementasi:** `pdf-lib` client-side

### 3. Compress PDF
- Upload 1 PDF
- Pilih level: Rendah / Sedang / Tinggi
- Tampilkan ukuran sebelum & sesudah
- **Implementasi:** Backend — Ghostscript (`gs -dPDFSETTINGS=/ebook`)

### 4. PDF to Word
- Upload 1 PDF → output .docx
- **Implementasi:** Backend — LibreOffice

### 5. PDF to PowerPoint
- Upload 1 PDF → output .pptx
- **Implementasi:** Backend — LibreOffice

### 6. PDF to Excel
- Upload 1 PDF → output .xlsx
- **Implementasi:** Backend — LibreOffice

### 7. Word to PDF
- Upload .docx / .doc → output .pdf
- **Implementasi:** Backend — LibreOffice

### 8. PowerPoint to PDF
- Upload .pptx / .ppt → output .pdf
- **Implementasi:** Backend — LibreOffice

### 9. Excel to PDF
- Upload .xlsx / .xls → output .pdf
- **Implementasi:** Backend — LibreOffice

### 10. Edit PDF
- Upload 1 PDF
- Fitur: tambah teks, gambar, shapes, freehand annotation
- Canvas editor per halaman (PDF.js render + fabric.js overlay)
- Output: PDF dengan anotasi ter-flatten
- **Implementasi:** Client-side (pdf-lib + fabric.js)

### 11. PDF to JPG
- Upload 1 PDF
- Pilih halaman & kualitas output
- Output: ZIP berisi JPG per halaman
- **Implementasi:** Backend — Poppler (`pdftoppm -jpeg -r 150`)

### 12. JPG to PDF
- Upload multiple gambar (JPG, PNG, WEBP)
- Preview & drag reorder
- Opsi: orientasi, ukuran halaman, margin, merge/pisah
- Output: 1 PDF atau beberapa PDF
- **Implementasi:** `pdf-lib` client-side ✅ sudah selesai

### 13. Sign PDF
- Upload 1 PDF
- Fitur: draw signature (canvas), upload gambar TTD, atau type nama
- Drag TTD ke posisi yang diinginkan di halaman
- Output: PDF dengan TTD ter-embed
- **Implementasi:** Client-side (pdf-lib + signature_pad)

### 14. Watermark PDF
- Upload 1 PDF
- Input: teks atau gambar watermark
- Opsi: opacity, posisi, font size, warna, rotasi
- **Implementasi:** `pdf-lib` client-side

### 15. Rotate PDF
- Upload 1 PDF
- Pilih rotasi per halaman: 90° / 180° / 270°
- Preview halaman
- **Implementasi:** `pdf-lib` client-side

### 16. HTML to PDF
- Input: URL atau paste HTML
- Output: .pdf
- **Implementasi:** Backend — Puppeteer

### 17. Unlock PDF
- Upload 1 PDF terproteksi + input password
- Output: PDF tanpa password
- **Implementasi:** Backend — qpdf (`qpdf --decrypt --password=xxx`)

### 18. Protect PDF
- Upload 1 PDF
- Input: user password + owner password
- Opsi permissions: allow print, copy, edit
- **Implementasi:** Backend — qpdf (`qpdf --encrypt`)

### 19. Organize PDF
- Upload 1 PDF
- Grid thumbnail semua halaman
- Drag-and-drop reorder halaman
- Hapus & rotate per halaman
- **Implementasi:** `pdf-lib` client-side + PDF.js untuk render thumbnail

### 20. PDF to PDF/A
- Upload 1 PDF → output PDF/A (ISO archival)
- **Implementasi:** Backend — Ghostscript (`gs -dPDFA=2`)

### 21. Repair PDF
- Upload 1 PDF corrupt → output PDF yang diperbaiki
- **Implementasi:** Backend — qpdf atau Ghostscript

### 22. Page Numbers
- Upload 1 PDF
- Opsi: posisi, nomor awal, format, font, ukuran
- **Implementasi:** `pdf-lib` client-side

### 23. Scan to PDF
- Akses kamera via `getUserMedia`
- Capture multiple foto → gabung jadi 1 PDF
- **Implementasi:** Client-side (pdf-lib + MediaDevices API)

### 24. OCR PDF
- Upload PDF atau gambar
- Pilih bahasa: Indonesia, Inggris, Auto
- Output: PDF yang bisa di-search/select teksnya
- **Implementasi:** Backend — tesseract.js

### 25. Compare PDF
- Upload 2 PDF
- Tampilkan side-by-side + highlight perbedaan teks
- **Implementasi:** Backend — Poppler extract teks → diff algoritma → highlight overlay

### 26. Redact PDF
- Upload 1 PDF
- Pilih area yang mau diredaksi (klik-drag di atas preview)
- Output: PDF dengan area dihitamkan permanen
- **Implementasi:** `pdf-lib` client-side (draw black rect)

### 27. Crop PDF
- Upload 1 PDF
- Pilih crop area per halaman atau semua halaman
- Output: PDF dengan ukuran halaman yang di-crop
- **Implementasi:** `pdf-lib` client-side (setMediaBox)

### 28. PDF Forms
- Upload 1 PDF
- Detect form fields otomatis
- Tambah field: text, checkbox, radio, dropdown
- Fill & flatten form
- **Implementasi:** `pdf-lib` client-side (form API)

---

## Homepage (/)

### Filter Tab Categories
```
All | Organize PDF | Optimize PDF | Convert PDF | Edit PDF | PDF Security
```

### Tool Card data (constants/tools.js)
```js
export const TOOLS = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    desc: "Gabungkan beberapa PDF menjadi satu file.",
    icon: "🔗",
    category: "organize",
    route: "/merge-pdf",
    accept: ".pdf",
    multiple: true,
    clientSide: true,
  },
  // ... 28 tools total
]
```

---

## Shared UI Flow (semua tool pages)

```
1. DropZone         → user upload file
2. File Preview     → thumbnail / nama file
3. Options Panel    → opsi spesifik per tool
4. Action Button    → "Convert", "Compress", dsb
5. Progress Bar     → saat proses berjalan
6. Result Screen    → download button + "Mulai lagi"
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env)
```
PORT=3001
LIBREOFFICE_PATH=/usr/bin/soffice
GHOSTSCRIPT_PATH=/usr/bin/gs
QPDF_PATH=/usr/bin/qpdf
TESSERACT_PATH=/usr/bin/tesseract
UPLOAD_DIR=./tmp/uploads
OUTPUT_DIR=./tmp/outputs
FILE_TTL_MINUTES=30
MAX_FILE_SIZE_MB=50
CORS_ORIGIN=http://localhost:5173
```

---

## System Dependencies (server)

```bash
# Ubuntu/Debian/WSL
sudo apt-get install -y \
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

## Implementation Priority

### Phase 1 — Client-side (langsung jalan, tidak butuh backend)
1. JPG to PDF ✅
2. Merge PDF
3. Split PDF
4. Rotate PDF
5. Organize PDF
6. Watermark PDF
7. Page Numbers
8. Redact PDF
9. Crop PDF
10. PDF Forms
11. Sign PDF
12. Scan to PDF

### Phase 2 — Backend required
13. Compress PDF (Ghostscript)
14. Word / Excel / PPT → PDF (LibreOffice)
15. PDF → Word / Excel / PPT (LibreOffice)
16. PDF to JPG (Poppler)
17. HTML to PDF (Puppeteer)
18. Unlock PDF (qpdf)
19. Protect PDF (qpdf)
20. OCR PDF (Tesseract)
21. Repair PDF (qpdf/Ghostscript)
22. PDF to PDF/A (Ghostscript)

### Phase 3 — Advanced
23. Edit PDF (fabric.js canvas editor)
24. Compare PDF (diff engine)

---

## Notes untuk Codex

- Semua tool client-side → gunakan `pdf-lib`, jangan kirim ke backend
- PDF preview → gunakan `pdfjs-dist`
- Drag-and-drop reorder → gunakan `@dnd-kit/core`
- Signature drawing → gunakan `signature_pad`
- Canvas editor (Edit PDF) → gunakan `fabric.js`
- File size limit: 50MB, tampilkan error kalau melebihi
- File temp backend: auto-delete setelah 30 menit via cron
- Semua error response: `{ success: false, message: "..." }`
- UI text dalam Bahasa Indonesia
- **Tidak ada API berbayar sama sekali — semua open source**
