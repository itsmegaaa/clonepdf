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
- **Image / Utility:** JPG to PDF, Sign PDF, Scan to PDF.

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

---

## 📜 Lisensi
Proyek ini bersifat *Open-Source* dan dibuat sepenuhnya untuk tujuan edukasi. Jangan ragu untuk me-remix, mengubah, atau mengembangkannya secara bebas.
