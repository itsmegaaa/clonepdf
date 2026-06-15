# Changelog

Semua perubahan yang signifikan pada proyek ini akan didokumentasikan di file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini menganut [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-06-15
### Fixed
- **Frontend:** Memperbaiki bug di mana file yang diunggah di satu *tool* masih terbawa ketika pengguna berpindah ke halaman *tool* lain. *State* kini otomatis di-*reset* setiap kali rute URL berubah.
- **Frontend:** Memperbaiki bug pada `ToolLayout.jsx` di mana daftar file kustom (seperti pada *Merge PDF* dan *Organize PDF*) tidak muncul/tersembunyi karena properti `children` gagal di-*render*.
- **Frontend:** Menambahkan layar *Loading* (Sedang memproses) dan *Result* (Selesai/Download) pada tool yang memiliki *custom* UI: `JPG to PDF`, `Compare PDF`, `HTML to PDF`, dan `Organize PDF`. Sebelumnya halaman ini terlihat *stuck* setelah tombol konversi ditekan.

### Changed
- **Frontend (Rotate PDF):** Mendesain ulang total UI halaman **Rotate PDF**. Pengguna kini bisa melihat *thumbnail* dari setiap halaman PDF dan dapat memutarnya secara individual ke kiri/kanan, atau memutar seluruh halaman sekaligus (mirip dengan UX Organize PDF).

## [1.0.1] - 2026-06-15
### Fixed
- **Frontend:** Memperbaiki *blank white screen* yang disebabkan oleh *missing export* icon `Github` dari `lucide-react` di `Footer.jsx` yang membuat *build* Vite *crash*.
- **Frontend:** Memperbaiki peringatan/sintaks *PostCSS* di `index.css` dengan menempatkan `@import` font Google di baris paling atas.
- **Backend:** Menambahkan *env variable* `POPPLER_PATH` ke `.env.example` untuk konsistensi dengan implementasi konversi Poppler.

## [1.0.0] - 2026-06-15
### Added
- **Initial Release:** Inisialisasi awal proyek iLovePDF Clone (Frontend Vite/React + Backend Node/Express).
- **Client-Side Tools (Phase 1):** Fitur manipulasi PDF 100% di browser via `pdf-lib` (Merge, Split, Rotate, Watermark, Redact, Sign, Crop, dll).
- **Backend Tools (Phase 2):** Implementasi konversi dan kompresi tingkat lanjut via *local system binaries* (Ghostscript, LibreOffice, Poppler, QPDF, Puppeteer, Tesseract).
- **Architecture:** Cron job untuk *auto-cleanup* file di `tmp/` setiap 15 menit.
- **Workflow:** Script `concurrently` untuk menjalankan frontend dan backend via 1 command (`npm start`).
- **Setup:** File konfigurasi `.env`, `.gitignore`, dan konfigurasi UI Tailwind (dark mode).
