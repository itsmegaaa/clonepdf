# PDF Editor 📄🚀

Sebuah kloning *full-stack* open-source dari platform manipulasi PDF populer (iLovePDF). Proyek ini sepenuhnya beroperasi secara lokal, gratis 100%, tanpa *paywall*, tanpa *API* berbayar, dan yang paling penting: **Privasi Terjamin** (tidak ada data atau dokumen Anda yang dikirim ke *cloud*).

Aplikasi ini dibagi menjadi eksekusi *Client-Side* (diproses langsung di browser menggunakan WebAssembly/JS) dan *Backend-Side* (menjalankan command-line tools sistem secara efisien).

---

## ✨ Fitur (28 Tools)

Aplikasi ini mendukung 28 alat manipulasi PDF yang dikategorikan sebagai berikut:

### ⚡ Client-Side Tools (Diproses langsung di browser)
Cepat, tanpa delay upload, dan aman. Menggunakan `pdf-lib` dan `pdfjs-dist`.
- **Organize:** Merge PDF, Split PDF, Organize (Reorder/Delete), Rotate PDF.
- **Edit & Manipulate:** Watermark, Page Numbers, Redact, Crop, PDF Forms.
- **Image / Utility:** JPG to PDF, Sign PDF.

### ⚙️ Backend Tools (Membutuhkan Server Lokal)
Diproses menggunakan *Local System Binaries* seperti LibreOffice, Ghostscript, dsb.
- **Convert to PDF:** Word to PDF, PowerPoint to PDF, Excel to PDF, HTML to PDF, PDF to PDF/A.
- **Convert from PDF:** PDF to Word, PDF to PowerPoint, PDF to JPG.
- **Optimize & Security:** Compress PDF, Unlock PDF, Protect PDF, Repair PDF.
- **Advanced:** OCR PDF (Tesseract), Compare PDF.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS v3
- Zustand (State Management)
- Lucide React (Icons)
- dnd-kit (Drag and Drop UI)
- pdf-lib & pdfjs-dist

**Backend:**
- Node.js + Express
- Multer (File Uploads)
- Node-cron (Auto Cleanup `tmp/` files)
- Execa (Child process runner)

**System Binaries (Backend Requirements):**
- **LibreOffice** (Konversi Office ke PDF dan sebaliknya)
- **Ghostscript** (Kompresi PDF, PDF/A)
- **Poppler** (PDF to JPG via `pdftoppm`)
- **QPDF** (Enkripsi, Dekripsi, Perbaikan PDF)
- **Tesseract OCR** (Pemindaian teks dari PDF/Gambar)
- **Puppeteer / Chromium** (HTML to PDF)

---

## 🚀 Instalasi & Persiapan Lokal

### 1. Prasyarat Sistem
Pastikan Node.js (minimal v20) sudah terinstall. Anda juga WAJIB menginstal dependensi sistem operasi berikut:

**Windows (via Chocolatey):**
```powershell
choco install libreoffice ghostscript qpdf poppler tesseract chromium -y
```

**macOS (via Homebrew):**
```bash
brew install libreoffice ghostscript qpdf poppler tesseract tesseract-lang chromium
```

**Ubuntu / Debian / WSL:**
```bash
sudo apt-get update && sudo apt-get install -y libreoffice ghostscript qpdf poppler-utils tesseract-ocr tesseract-ocr-ind tesseract-ocr-eng chromium-browser
```

### 2. Kloning Repository
```bash
git clone https://github.com/username/ilovepdf-clone.git
cd ilovepdf-clone
```

### 3. Install NPM Packages
```bash
# Install frontend, backend, dan concurrently di root
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 4. Konfigurasi Environment (ENV)
Buat file `.env` di dalam folder `frontend` dan `backend`.

**Di dalam folder `backend/`:**
```bash
cp backend/.env.example backend/.env
```
*(Buka file `backend/.env` dan pastikan konfigurasi path binary (seperti `LIBREOFFICE_PATH`, `GHOSTSCRIPT_PATH`, dsb) mengarah ke lokasi executable instalasi di sistem Anda, terutama jika Anda menggunakan Windows).*

**Di dalam folder `frontend/`:**
Buat file `frontend/.env` dan isi dengan:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 5. Menjalankan Aplikasi
Kami telah mengonfigurasi `concurrently` di root proyek untuk menjalankan Frontend dan Backend secara bersamaan hanya dengan 1 perintah:

```bash
npm start
```

- Frontend akan berjalan di: `http://localhost:5173` (Atau 5174 dsb jika port terpakai)
- Backend API akan berjalan di: `http://localhost:3001`

Buka browser Anda dan kunjungi URL frontend untuk mulai menggunakan! 🎉

---

## 🧹 Auto-Cleanup
Untuk menghindari file sementara yang menumpuk di memori/disk lokal Anda, backend dilengkapi dengan skrip **Cron Job** (`node-cron`). Skrip ini berjalan secara otomatis setiap 15 menit dan menghapus semua file di `backend/tmp/uploads` dan `backend/tmp/outputs` yang berumur lebih dari 30 menit.

## Changelog

<!-- CHANGELOG:START -->
Semua perubahan yang signifikan pada proyek ini akan didokumentasikan di file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini menganut [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-06-15
### Fixed
- **Backend:** Memperbaiki *error* CORS secara permanen di `index.js` dengan mengubah `app.use(cors())` agar mengizinkan semua *origin* secara mutlak selama pengembangan. Ini mencegah *error* akibat *cache* variabel `CORS_ORIGIN` dari sistem.
- **Frontend:** Memperbaiki bug di mana file yang diunggah di satu *tool* masih terbawa ketika pengguna berpindah ke halaman *tool* lain. *State* kini otomatis di-*reset* setiap kali rute URL berubah.
- **Frontend:** Memperbaiki bug pada `ToolLayout.jsx` di mana daftar file kustom (seperti pada *Merge PDF* dan *Organize PDF*) tidak muncul/tersembunyi karena properti `children` gagal di-*render*.
- **Frontend:** Menambahkan layar *Loading* (Sedang memproses) dan *Result* (Selesai/Download) pada tool yang memiliki *custom* UI: `JPG to PDF`, `Compare PDF`, `HTML to PDF`, dan `Organize PDF`. Sebelumnya halaman ini terlihat *stuck* setelah tombol konversi ditekan.
- **Backend (LibreOffice):** Memperbaiki *error* konversi gagal (*Write Code: 16*) di fitur PDF to Word/PowerPoint/Excel dengan memaksa *backend* untuk selalu menggunakan format *Absolute Path* ketika mengirimkan perintah ke LibreOffice, mencegah konflik *directory resolution* di Windows.

### Changed
- **Frontend & Backend:** Menyesuaikan nama file hasil pemrosesan (download) agar menggunakan **nama file asli yang diunggah**, bukan nama acak atau nama *hardcode* seperti `compressed.pdf`.
- **Frontend (Rotate PDF):** Mendesain ulang total UI halaman **Rotate PDF**. Pengguna kini bisa melihat *thumbnail* dari setiap halaman PDF dan dapat memutarnya secara individual ke kiri/kanan, atau memutar seluruh halaman sekaligus (mirip dengan UX Organize PDF).
- **Frontend (Edit PDF):** Mengubah halaman `Edit PDF` (yang semula hanya *placeholder*) menjadi **Visual Page Builder**. Fitur ini menggabungkan kemampuan *Merge* dan *Organize* dengan mendukung *multi-file upload*, di mana pengguna bisa mencampur, menyusun ulang, dan menghapus halaman dari berbagai sumber dokumen PDF yang berbeda melalui antarmuka *drag-and-drop*.

## [1.0.0] - 2026-06-15
### Added
- **Initial Release:** Inisialisasi awal proyek iLovePDF Clone (Frontend Vite/React + Backend Node/Express).
- **Client-Side Tools (Phase 1):** Fitur manipulasi PDF 100% di browser via `pdf-lib` (Merge, Split, Rotate, Watermark, Redact, Sign, Crop, dll).
- **Backend Tools (Phase 2):** Implementasi konversi dan kompresi tingkat lanjut via *local system binaries* (Ghostscript, LibreOffice, Poppler, QPDF, Puppeteer, Tesseract).
- **Architecture:** Cron job untuk *auto-cleanup* file di `tmp/` setiap 15 menit.
- **Workflow:** Script `concurrently` untuk menjalankan frontend dan backend via 1 command (`npm start`).
- **Setup:** File konfigurasi `.env`, `.gitignore`, dan konfigurasi UI Tailwind (dark mode).
<!-- CHANGELOG:END -->

Full changelog: [CHANGELOG.md](./CHANGELOG.md)

---

## 📜 Lisensi
Proyek ini bersifat *Open-Source* dan dibuat sepenuhnya untuk tujuan edukasi. Jangan ragu untuk me-remix, mengubah, atau mengembangkannya secara bebas.
