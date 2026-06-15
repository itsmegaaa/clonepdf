const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const archiver = require('archiver');
const puppeteer = require('puppeteer');
const tesseract = require('tesseract.js');
const {
  libreOfficeConvert,
  ghostscriptCompress,
  qpdfProtect,
  qpdfUnlock,
  ghostscriptPdfA,
  popplerPdfToJpg
} = require('./utils/binaries');

const router = express.Router();

// ── Setup Multer ───────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(process.env.UPLOAD_DIR || './tmp/uploads'),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '50') * 1024 * 1024 }
});

const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || './tmp/outputs');

// Helper Wrapper (Handles try/catch & cleanup on fail)
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan internal server' });
  }
};

// ── CONVERT ROUTES (LibreOffice) ───────────────────────────────────
router.post('/convert/pdf-to-word', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.docx`);
  const finalFile = await libreOfficeConvert(req.file.path, OUTPUT_DIR, 'docx:MS Word 2007 XML');
  await fs.rename(finalFile, outFile);
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(outFile), filename: `${baseName}.docx` });
}));

router.post('/convert/pdf-to-powerpoint', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pptx`);
  const finalFile = await libreOfficeConvert(req.file.path, OUTPUT_DIR, 'pptx:Impress MS PowerPoint 2007 XML');
  await fs.rename(finalFile, outFile);
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(outFile), filename: `${baseName}.pptx` });
}));



router.post('/convert/word-to-pdf', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  const finalFile = await libreOfficeConvert(req.file.path, OUTPUT_DIR, 'pdf');
  await fs.rename(finalFile, outFile);
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(outFile), filename: `${baseName}.pdf` });
}));

router.post('/convert/ppt-to-pdf', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  const finalFile = await libreOfficeConvert(req.file.path, OUTPUT_DIR, 'pdf');
  await fs.rename(finalFile, outFile);
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(outFile), filename: `${baseName}.pdf` });
}));

router.post('/convert/excel-to-pdf', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  const finalFile = await libreOfficeConvert(req.file.path, OUTPUT_DIR, 'pdf');
  await fs.rename(finalFile, outFile);
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(outFile), filename: `${baseName}.pdf` });
}));

// ── OPTIMIZE & PDF/A (Ghostscript) ─────────────────────────────────
router.post('/compress', upload.single('file'), asyncHandler(async (req, res) => {
  const level = req.body.level || 'medium';
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  await ghostscriptCompress(req.file.path, outFile, level);
  res.json({ success: true, fileId: path.basename(outFile), filename: req.file.originalname });
}));

router.post('/convert/pdf-to-pdfa', upload.single('file'), asyncHandler(async (req, res) => {
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  await ghostscriptPdfA(req.file.path, outFile);
  res.json({ success: true, fileId: path.basename(outFile), filename: req.file.originalname });
}));

// ── SECURITY (QPDF) ────────────────────────────────────────────────
router.post('/protect', upload.single('file'), asyncHandler(async (req, res) => {
  const { password, ownerPassword, permissions } = req.body;
  let permsArray = [];
  try { permsArray = JSON.parse(permissions); } catch(e) {}
  
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  await qpdfProtect(req.file.path, outFile, password, ownerPassword || password, permsArray);
  res.json({ success: true, fileId: path.basename(outFile), filename: req.file.originalname });
}));

router.post('/unlock', upload.single('file'), asyncHandler(async (req, res) => {
  const { password } = req.body;
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  try {
    await qpdfUnlock(req.file.path, outFile, password);
    res.json({ success: true, fileId: path.basename(outFile), filename: req.file.originalname });
  } catch (err) {
    if (err.message && err.message.includes('invalid password')) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }
    throw err;
  }
}));

// ── MISC TOOLS (OCR, HTML to PDF, PDF to JPG) ──────────────────────
router.post('/ocr', upload.single('file'), asyncHandler(async (req, res) => {
  // OCR processing (currently just mock/placeholder processing for basic text extraction logic)
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}-ocr.pdf`);
  // Dalam real scenario, kita gabung Tesseract output ke PDF (sekarang kita copy untuk preview jalan)
  await fs.copy(req.file.path, outFile);
  res.json({ success: true, fileId: path.basename(outFile), filename: req.file.originalname });
}));

router.post('/convert/html-to-pdf', asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) throw new Error('URL is required');
  
  const outFile = path.join(OUTPUT_DIR, `${uuidv4()}.pdf`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.pdf({ path: outFile, format: 'A4', printBackground: true });
  await browser.close();
  
  res.json({ success: true, fileId: path.basename(outFile), filename: 'webpage.pdf' });
}));

router.post('/convert/pdf-to-jpg', upload.single('file'), asyncHandler(async (req, res) => {
  const tempDir = path.join(OUTPUT_DIR, uuidv4());
  await fs.ensureDir(tempDir);
  
  const jpgFiles = await popplerPdfToJpg(req.file.path, tempDir, 85);
  
  // Zip the files
  const zipFile = path.join(OUTPUT_DIR, `${uuidv4()}.zip`);
  const output = fs.createWriteStream(zipFile);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(output);
  for (const jpg of jpgFiles) {
    archive.file(jpg, { name: path.basename(jpg) });
  }
  await archive.finalize();
  
  // Tunggu stream selesai
  await new Promise(resolve => output.on('close', resolve));
  await fs.remove(tempDir);
  
  const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
  res.json({ success: true, fileId: path.basename(zipFile), filename: `${baseName}_images.zip` });
}));

// ── DOWNLOAD ROUTE ─────────────────────────────────────────────────
router.get('/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  const safeFileId = path.basename(fileId); // cegah directory traversal
  const filePath = path.join(OUTPUT_DIR, safeFileId);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File tidak ditemukan atau sudah expired.');
  }
  
  res.download(filePath);
});

module.exports = router;
