import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';

export default function HtmlToPdf() {
  const { startProcess, setProgress, setResult, setError } = useToolStore();
  const [url, setUrl] = useState('');

  const handleProcess = async () => {
    if (!url.trim()) { setError('Masukkan URL terlebih dahulu'); return; }
    try {
      startProcess();
      setProgress(30);
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${apiBase}/convert/html-to-pdf`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setProgress(90);
      setResult({ url: `${apiBase}/download/${data.fileId}`, filename: data.filename || 'page.pdf' });
    } catch (err) {
      setError(err.message || 'Gagal mengkonversi HTML. Pastikan Puppeteer berjalan.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#8b90b0] hover:text-white mb-6 transition-colors">← Semua Tools</a>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">HTML to PDF</h1>
        <p className="text-[#8b90b0]">Ubah halaman web dari URL menjadi PDF menggunakan Puppeteer.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#8b90b0] mb-2">URL Halaman Web</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-[#1a1d27] border border-[#2d3150] rounded-xl text-white placeholder-[#4a5070]
              focus:outline-none focus:border-[#e2001a]/50 text-sm" />
        </div>
        <button onClick={handleProcess}
          className="w-full py-3.5 bg-[#e2001a] hover:bg-[#b8001a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-900/30">
          Convert ke PDF
        </button>
      </div>
    </div>
  );
}
