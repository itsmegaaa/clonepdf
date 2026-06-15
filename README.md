# PDFVault (Public/Cloud Version)

*A modern, privacy-focused PDF processing suite.*

PDFVault is a comprehensive web application for managing and manipulating PDF files. It provides a wide range of features such as merging, compressing, organizing, and converting PDFs directly in your browser. 

---
### ☕ Support / Donate

<a href="https://tako.id/itsmega">
  <img align="left" src="docs/tako_qr.png" width="200" alt="Tako QR Code">
</a>

<br>

If you find this project helpful, saves you time, or keeps your company's documents secure, please consider supporting the development!  
👉 **[Donate & Support via Tako.id](https://tako.id/itsmega)**

<br clear="left"/>

---

> **⚠️ WARNING: VERSI INI LEBIH RIBET! (More Complicated Setup)**
> Karena ini adalah versi Publik/Cloud, setup lokalnya jauh lebih ribet (kamu harus jalankan *frontend* & *backend* manual tanpa script otomatis). 
> Kalau kamu butuh versi yang gampang diinstall (tinggal double-click) dan ditujukan untuk berjalan 100% offline di Local Area Network (LAN), sangat disarankan pakai versi LAN-nya saja di sini:
> 👉 **[PDFVault LAN Version](https://github.com/itsmegaaa/pdfLan)**

## ✨ Features

PDFVault is packed with powerful, enterprise-grade tools that process your files securely.

### 🛡️ Core Advantages
- **Privacy Focused**: 100% of the processing happens on your local machine or LAN. Documents are NEVER uploaded to an external server. Your data stays yours.
- **Auto Cleanup**: Temporary files are aggressively and automatically deleted from the server within milliseconds after processing.
- **Smart Concurrency Limit**: Built-in queue system ensures the server never freezes, even if multiple users process files at the exact same time.

### 📄 Organize & Edit PDF
- **Visual Page Builder**: A drag-and-drop interface to easily rearrange, delete, and organize pages.
- **Merge PDF**: Combine multiple PDFs into a single file with custom ordering.
- **Split PDF**: Visually select pages to split or extract from a large document.
- **Rotate PDF**: Fix upside-down pages with a single click.

### 🔄 Convert FROM PDF
- **PDF to Word/PPT/Excel**: Convert PDFs back into editable Office documents with high accuracy (powered by LibreOffice).
- **PDF to JPG**: Extract high-quality images from every page of your PDF (powered by Poppler).
- **PDF to PDF/A**: Convert your documents into the standard format for long-term archiving.

### 🔁 Convert TO PDF
- **Word/PPT/Excel to PDF**: Turn your Office documents into universally readable PDFs.
- **Image to PDF**: Convert JPG, PNG, and other image formats into a single PDF document.
- **HTML to PDF**: Capture webpages perfectly into PDF format (powered by Chromium/Puppeteer).

### 🔒 Security & Optimization
- **Compress PDF**: Dramatically reduce the file size of your PDFs without losing quality (powered by Ghostscript).
- **Protect PDF**: Encrypt your PDFs with strong passwords and restrict permissions (e.g., disable printing or copying).
- **Unlock PDF**: Remove passwords and security restrictions from PDFs you own (powered by QPDF).

## 🛠️ Prerequisites

To run this application, your machine requires the following tools to be installed.

**💡 Easiest Way (Using Chocolatey - Recommended):**
Open PowerShell as Administrator and run this one-liner to install everything you need:
```powershell
choco install nodejs pm2 libreoffice ghostscript qpdf poppler tesseract chromium -y
```

**Alternative Way (Using Winget - Windows 10/11 built-in):**
Open PowerShell and run:
```powershell
winget install OpenJS.NodeJS -e
winget install TheDocumentFoundation.LibreOffice -e
winget install ArtifexSoftware.GhostScript -e
```
*(Note: You will still need to manually install qpdf, poppler, tesseract, and chromium if you use winget).*

## 🚀 Quick Start

To run PDFVault locally for development:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itsmegaaa/clonepdf.git
   cd clonepdf
   ```

2. **Install dependencies:**
   You will need to install dependencies for both the frontend and backend.
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   cd ..
   ```

3. **Start the Development Server:**
   Run the following command from the root directory to start both the React frontend and Express backend simultaneously:
   ```bash
   npm start
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.


## 📝 License

This project is licensed under the [Apache License 2.0](LICENSE).
