require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Directories setup ──────────────────────────────────────────────
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './tmp/uploads');
const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || './tmp/outputs');
fs.ensureDirSync(UPLOAD_DIR);
fs.ensureDirSync(OUTPUT_DIR);

// ── Middlewares ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api', routes);

// Base health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'iLovePDF Clone Backend is running' }));

// ── Cron Job (Auto Cleanup) ────────────────────────────────────────
const TTL_MINUTES = parseInt(process.env.FILE_TTL_MINUTES || '30', 10);

cron.schedule('*/15 * * * *', async () => {
  console.log('[Cron] Menjalankan pembersihan file...');
  const now = Date.now();
  const maxAgeMs = TTL_MINUTES * 60 * 1000;

  const cleanDir = async (dir) => {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file === '.gitkeep') continue;
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.remove(filePath);
          console.log(`[Cron] Menghapus: ${file}`);
        }
      }
    } catch (err) {
      console.error(`[Cron] Gagal membersihkan direktori ${dir}:`, err);
    }
  };

  await cleanDir(UPLOAD_DIR);
  await cleanDir(OUTPUT_DIR);
  console.log('[Cron] Pembersihan selesai.');
});

// ── Start Server ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend berjalan di http://localhost:${PORT}`);
  console.log(`📁 Upload Dir: ${UPLOAD_DIR}`);
  console.log(`📁 Output Dir: ${OUTPUT_DIR}`);
});
