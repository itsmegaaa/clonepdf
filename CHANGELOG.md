# Changelog

Semua perubahan yang signifikan pada proyek ini akan didokumentasikan di file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini menganut [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-15
### Added
- **Initial Release:** Inisialisasi awal proyek iLovePDF Clone (Frontend Vite/React + Backend Node/Express).
- **Client-Side Tools (Phase 1):** Fitur manipulasi PDF 100% di browser via `pdf-lib` (Merge, Split, Rotate, Watermark, Redact, Sign, Crop, dll).
- **Backend Tools (Phase 2):** Implementasi konversi dan kompresi tingkat lanjut via *local system binaries* (Ghostscript, LibreOffice, Poppler, QPDF, Puppeteer, Tesseract).
- **Architecture:** Cron job untuk *auto-cleanup* file di `tmp/` setiap 15 menit.
- **Workflow:** Script `concurrently` untuk menjalankan frontend dan backend via 1 command (`npm start`).
- **Setup:** File konfigurasi `.env`, `.gitignore`, dan konfigurasi UI Tailwind (dark mode).
