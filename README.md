# PDFVault (Public/Cloud Version)

*A modern, privacy-focused PDF processing suite.*

PDFVault is a comprehensive web application for managing and manipulating PDF files. It provides a wide range of features such as merging, compressing, organizing, and converting PDFs directly in your browser. 

> **🔒 Looking for an offline, self-hosted LAN version?**
> If you need to run this application entirely offline within your company's local network (LAN) for maximum privacy without any internet connection, check out the [PDFVault LAN Version](https://github.com/itsmegaaa/pdfLan).

## ✨ Features

- **Organize PDF**: Add, delete, and rearrange PDF pages.
- **Convert PDF**: Convert to and from PDF (JPG to PDF, HTML to PDF, Word to PDF, etc.).
- **Edit PDF**: Add text, images, and annotations.
- **Security**: Protect with passwords, unlock PDFs, redact sensitive information, and add watermarks.
- **Privacy-First Processing**: Many core features are processed directly in your browser using `pdf-lib` without sending files to the backend.

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

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, pdf-lib
- **Backend:** Node.js, Express, Multer (for handling file uploads)
- **Utilities:** Ghostscript, Poppler, LibreOffice (for advanced backend conversions)

## 📝 License

This project is licensed under the [Apache License 2.0](LICENSE).
