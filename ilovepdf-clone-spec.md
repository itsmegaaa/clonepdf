# iLovePDF Clone — Project Specification

> Full-stack web app kloning ilovepdf.com dengan semua fitur PDF tools.
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
| AI (Summarizer/Translate) | Anthropic Claude API (`claude-sonnet-4-6`) |
| Process Runner | execa |

### Infrastructure
| | |
|---|---|
| File storage (temp) | Local disk via multer + auto-cleanup cron |
| Env config | dotenv |
| CORS | cors middleware |
| Rate limiting | express-rate-limit |
| Deployment (suggestion) | Railway (backend) + Vercel (frontend) |

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
│   │   │   └── ToolLayout.jsx       # shared layout for all tool pages
│   │   ├── pages/
│   │   │   ├── Home.jsx             # grid semua tools + filter tab
│   │   │   ├── tools/
│   │   │   │   ├── MergePdf.jsx
│   │   │   │   ├── SplitPdf.jsx
│   │   │   │   ├── CompressPdf.jsx
│   │   │   │   ├── PdfToWord.jsx
│   │   │   │   ├── PdfToPowerPoint.jsx
│   │   │   │   ├── PdfToExcel.jsx
│   │   │   │   ├── WordToPdf.jsx
│   │   │   │   ├── PowerPointToPdf.jsx
│   │   │   │   ├── ExcelToPdf.jsx
│   │   │   │   ├── EditPdf.jsx
│   │   │   │   ├── PdfToJpg.jsx
│   │   │   │   ├── JpgToPdf.jsx
│   │   │   │   ├── SignPdf.jsx
│   │   │   │   ├── WatermarkPdf.jsx
│   │   │   │   ├── RotatePdf.jsx
│   │   │   │   ├── HtmlToPdf.jsx
│   │   │   │   ├── UnlockPdf.jsx
│   │   │   │   ├── ProtectPdf.jsx
│   │   │   │   ├── OrganizePdf.jsx
│   │   │   │   ├── PdfToPdfa.jsx
│   │   │   │   ├── RepairPdf.jsx
│   │   │   │   ├── PageNumbers.jsx
│   │   │   │   ├── ScanToPdf.jsx
│   │   │   │   ├── OcrPdf.jsx
│   │   │   │   ├── ComparePdf.jsx
│   │   │   │   ├── RedactPdf.jsx
│   │   │   │   ├── CropPdf.jsx
│   │   │   │   ├── PdfForms.jsx
│   │   │   │   ├── AiSummarizer.jsx
│   │   │   │   └── TranslatePdf.jsx
│   │   ├── store/
│   │   │   └── useToolStore.js
│   │   ├── utils/
│   │   │   ├── api.js               # axios instance + API calls
│   │   │   ├── clientPdf.js         # pdf-lib helpers (client-side ops)
│   │   │   └── fileHelpers.js
│   │   ├── constants/
│   │   │   └── tools.js             # metadata semua tools (name, icon, desc, category, route)
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
│   │   │   ├── convert.js           # office↔PDF conversions
│   │   │   ├── image.js             # jpg↔pdf, pdf↔jpg
│   │   │   ├── edit.js              # rotate, watermark, pagenumbers, crop
│   │   │   ├── security.js          # protect, unlock
│   │   │   ├── ocr.js
│   │   │   ├── htmlToPdf.js
│   │   │   ├── repair.js
│   │   │   ├── compare.js
│   │   │   ├── redact.js
│   │   │   ├── ai.js                # summarizer, translate
│   │   │   └── download.js          # serve processed files
│   │   ├── middleware/
│   │   │   ├── upload.js            # multer config
│   │   │   ├── rateLimit.js
│   │   │   └── cleanup.js           # auto-delete temp files
│   │   ├── utils/
│   │   │   ├── runCommand.js        # execa wrapper
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
/ai-summarizer             → AI Summarizer
/translate-pdf             → Translate PDF
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
POST /api/ai/summarize       body: file (PDF), options: { lang: "id"|"en", length: "short"|"medium"|"long" }
POST /api/ai/translate       body: file (PDF), options: { targetLang: "id"|"en"|"ja"|... }
GET  /api/download/:fileId   → stream file ke client
```

---

## Features — Detail per Tool

### 1. Merge PDF
- Upload multiple PDF files
- Preview thumbnail tiap PDF (halaman pertama)
- Drag-and-drop reorder antar file
- Output: 1 PDF gabungan
- **Implementasi:** `pdf-lib` client-side (tidak butuh backend)

### 2. Split PDF
- Upload 1 PDF
- Mode: Split by range (contoh: "1-3, 5, 7-9") atau split every N pages
- Preview halaman PDF dengan PDF.js
- Output: ZIP berisi beberapa PDF, atau download satu per satu
- **Implementasi:** `pdf-lib` client-side

### 3. Compress PDF
- Upload 1 PDF
- Pilihan level kompresi: Rendah / Sedang / Tinggi
- Tampilkan ukuran sebelum & sesudah
- **Implementasi:** Backend — Ghostscript (`gs -dPDFSETTINGS=/ebook`)

### 4. PDF to Word
- Upload 1 PDF
- Output: .docx
- **Implementasi:** Backend — LibreOffice (`soffice --headless --convert-to docx`)

### 5. PDF to PowerPoint
- Upload 1 PDF
- Output: .pptx (tiap halaman jadi slide)
- **Implementasi:** Backend — LibreOffice

### 6. PDF to Excel
- Upload 1 PDF
- Output: .xlsx (extract tabel)
- **Implementasi:** Backend — LibreOffice atau `tabula-py` (via Python subprocess)

### 7. Word to PDF
- Upload .docx atau .doc
- Output: .pdf
- **Implementasi:** Backend — LibreOffice

### 8. PowerPoint to PDF
- Upload .pptx atau .ppt
- Output: .pdf
- **Implementasi:** Backend — LibreOffice

### 9. Excel to PDF
- Upload .xlsx atau .xls
- Output: .pdf
- **Implementasi:** Backend — LibreOffice

### 10. Edit PDF
- Upload 1 PDF
- Fitur: tambah teks, gambar, shapes, freehand annotation
- Canvas editor per halaman (PDF.js untuk render + fabric.js atau konva.js untuk overlay)
- Output: PDF dengan anotasi
- **Implementasi:** Client-side (pdf-lib + fabric.js), backend hanya untuk flatten hasil

### 11. PDF to JPG
- Upload 1 PDF
- Pilih halaman (semua / tertentu)
- Pilih kualitas output
- Output: ZIP berisi gambar JPG per halaman
- **Implementasi:** Backend — Poppler (`pdftoppm -jpeg -r 150`)

### 12. JPG to PDF
- Upload multiple gambar (JPG, PNG, WEBP)
- Preview & reorder gambar
- Opsi: orientasi, ukuran halaman, margin, merge/pisah
- Output: 1 PDF atau beberapa PDF
- **Implementasi:** `pdf-lib` client-side (sudah selesai)

### 13. Sign PDF
- Upload 1 PDF
- Fitur: draw signature (canvas), upload gambar TTD, atau type nama
- Tempatkan TTD di halaman manapun dengan drag
- Output: PDF dengan TTD ter-embed
- **Implementasi:** Client-side (pdf-lib + signature_pad library)

### 14. Watermark PDF
- Upload 1 PDF
- Input: teks watermark atau upload gambar watermark
- Opsi: opacity, posisi (center/tile/corner), font size, warna, rotasi
- **Implementasi:** `pdf-lib` client-side

### 15. Rotate PDF
- Upload 1 PDF
- Pilih rotasi per halaman: 90° / 180° / 270°
- Preview halaman
- **Implementasi:** `pdf-lib` client-side

### 16. HTML to PDF
- Input: URL atau paste HTML langsung
- Output: .pdf
- **Implementasi:** Backend — Puppeteer (`page.goto(url)` → `page.pdf()`)

### 17. Unlock PDF
- Upload 1 PDF (yang terproteksi password)
- Input: password
- Output: PDF tanpa password
- **Implementasi:** Backend — qpdf (`qpdf --decrypt --password=xxx input.pdf output.pdf`)

### 18. Protect PDF
- Upload 1 PDF
- Input: user password + owner password
- Opsi permissions: allow print, copy, edit
- **Implementasi:** Backend — qpdf (`qpdf --encrypt ...`)

### 19. Organize PDF
- Upload 1 PDF
- Grid thumbnail semua halaman
- Drag-and-drop reorder halaman
- Hapus halaman tertentu
- Rotate per halaman
- **Implementasi:** `pdf-lib` client-side + PDF.js untuk render thumbnail

### 20. PDF to PDF/A
- Upload 1 PDF
- Output: PDF/A (ISO archival format)
- **Implementasi:** Backend — Ghostscript (`gs -dPDFA=2 -dPDFACompatibilityPolicy=1 ...`)

### 21. Repair PDF
- Upload 1 PDF yang corrupt
- Output: PDF yang sudah diperbaiki
- **Implementasi:** Backend — qpdf (`qpdf --qdf --object-streams=disable`) atau Ghostscript

### 22. Page Numbers
- Upload 1 PDF
- Opsi: posisi (top-left, top-center, top-right, bottom-*), nomor awal, format, font, ukuran
- Preview perubahan
- **Implementasi:** `pdf-lib` client-side

### 23. Scan to PDF
- Akses kamera device (via `getUserMedia`)
- Capture foto langsung dari browser
- Multiple capture → gabung jadi 1 PDF
- **Implementasi:** `pdf-lib` client-side + `MediaDevices.getUserMedia`

### 24. OCR PDF
- Upload PDF atau gambar
- Pilih bahasa (Indonesia, Inggris, Auto)
- Output: PDF yang bisa di-search/select teksnya
- **Implementasi:** Backend — tesseract.js (Node) atau Tesseract CLI

### 25. Compare PDF
- Upload 2 PDF
- Tampilkan side-by-side dengan highlight perbedaan
- **Implementasi:** Backend — poppler untuk extract teks per halaman, diff algoritma, highlight overlay

### 26. Redact PDF
- Upload 1 PDF
- User pilih area yang mau diredaksi (klik-drag di atas PDF preview)
- Output: PDF dengan area yang dipilih dihitamkan permanen
- **Implementasi:** `pdf-lib` client-side (draw black rect di atas area)

### 27. Crop PDF
- Upload 1 PDF
- User pilih crop area per halaman (atau semua halaman)
- Output: PDF dengan ukuran halaman yang di-crop
- **Implementasi:** `pdf-lib` client-side (setCropBox / setMediaBox)

### 28. PDF Forms
- Upload 1 PDF
- Detect form fields otomatis (via pdf-lib form API)
- Tambah field baru: text field, checkbox, radio, dropdown
- Fill/isi form langsung
- Output: PDF dengan form fields atau PDF flat (data sudah diisi)
- **Implementasi:** `pdf-lib` client-side (pdf-lib.js punya form API lengkap)

### 29. AI Summarizer
- Upload 1 PDF
- Pilih: bahasa output, panjang summary (pendek/sedang/panjang)
- Extract teks dari PDF → kirim ke Anthropic Claude API
- Output: summary tampil di UI (bisa di-copy atau download sebagai .txt)
- **Implementasi:** Backend — poppler extract teks → Claude API (`claude-sonnet-4-6`)

### 30. Translate PDF
- Upload 1 PDF
- Pilih bahasa target (Indonesia, Inggris, Jepang, dll)
- Extract teks → translate via Claude API (atau DeepL/Google Translate API)
- Rebuild PDF dengan teks yang sudah ditranslate (pertahankan layout semaksimal mungkin)
- **Implementasi:** Backend — poppler extract → Claude API translate → pdf-lib rebuild

---

## Homepage (/)

### Filter Tab Categories
```
All | Organize PDF | Optimize PDF | Convert PDF | Edit PDF | PDF Security | PDF Intelligence
```

### Tool Cards
Setiap card berisi:
- Icon (emoji atau SVG)
- Nama tool
- Deskripsi singkat (1 kalimat)
- Klik → navigate ke halaman tool

### Data tools (constants/tools.js)
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
  // ... semua 30 tools
]
```

---

## Shared UI Flow (semua tool pages)

Semua halaman tool mengikuti flow yang sama via komponen `ToolLayout`:

```
1. DropZone         → user upload file
2. File Preview     → thumbnail / nama file
3. Options Panel    → opsi spesifik per tool (jika ada)
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
ANTHROPIC_API_KEY=sk-ant-...
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

Install di server / Docker container:

```bash
# Ubuntu/Debian
apt-get install -y \
  libreoffice \
  ghostscript \
  qpdf \
  poppler-utils \
  tesseract-ocr \
  tesseract-ocr-ind \
  tesseract-ocr-eng \
  chromium-browser   # untuk Puppeteer
```

---

## Implementation Priority (urutan pengerjaan)

### Phase 1 — Client-side tools (tidak butuh backend)
1. JPG to PDF ✅ (sudah selesai)
2. Merge PDF
3. Split PDF
4. Rotate PDF
5. Organize PDF
6. Watermark PDF
7. Page Numbers
8. Protect PDF (basic, via pdf-lib)
9. Redact PDF
10. Crop PDF
11. PDF Forms
12. Sign PDF

### Phase 2 — Backend tools (butuh server)
13. Compress PDF (Ghostscript)
14. Word/Excel/PPT to PDF (LibreOffice)
15. PDF to Word/Excel/PPT (LibreOffice)
16. PDF to JPG (Poppler)
17. HTML to PDF (Puppeteer)
18. Unlock PDF (qpdf)
19. OCR PDF (Tesseract)
20. Repair PDF (qpdf/Ghostscript)
21. PDF to PDF/A (Ghostscript)

### Phase 3 — Advanced features
22. Edit PDF (fabric.js canvas editor)
23. Compare PDF (diff engine)
24. Scan to PDF (kamera)
25. AI Summarizer (Claude API)
26. Translate PDF (Claude API)

---

## Notes untuk Codex

- Semua tool client-side: **gunakan `pdf-lib`**, jangan kirim ke backend
- PDF preview: **gunakan `pdfjs-dist`** untuk render halaman ke canvas
- Drag-and-drop reorder: **gunakan `@dnd-kit/core`**
- Signature drawing: **gunakan `signature_pad`**
- Canvas editor (Edit PDF): **gunakan `fabric.js`**
- File size limit: 50MB per file, tampilkan error jika melebihi
- Cleanup backend: file temp otomatis dihapus setelah 30 menit (cron job)
- Semua response error dari backend: `{ success: false, message: "..." }`
- Mendukung bahasa Indonesia di semua UI text
