# PDFVault (Public/Cloud Version)

*A modern, privacy-focused PDF processing suite.*

PDFVault is a comprehensive web application for managing and manipulating PDF files. It provides a wide range of features such as merging, compressing, organizing, and converting PDFs directly in your browser. 

> **⚠️ WARNING: VERSI INI LEBIH RIBET! (More Complicated Setup)**
> Karena ini adalah versi Publik/Cloud, setup lokalnya jauh lebih ribet (kamu harus jalankan *frontend* & *backend* manual tanpa script otomatis). 
> Kalau kamu butuh versi yang gampang diinstall (tinggal double-click) dan ditujukan untuk berjalan 100% offline di Local Area Network (LAN), sangat disarankan pakai versi LAN-nya saja di sini:
> 👉 **[PDFVault LAN Version](https://github.com/itsmegaaa/pdfLan)**

## ✨ Features

- **Organize PDF**: Add, delete, and rearrange PDF pages.
- **Convert PDF**: Convert to and from PDF (JPG to PDF, HTML to PDF, Word to PDF, etc.).
- **Edit PDF**: Add text, images, and annotations.
- **Security**: Protect with passwords, unlock PDFs, redact sensitive information, and add watermarks.
- **Privacy-First Processing**: Many core features are processed directly in your browser using `pdf-lib` without sending files to the backend.

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
