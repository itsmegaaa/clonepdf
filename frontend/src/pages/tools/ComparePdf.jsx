import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';
import { apiCompare } from '../../utils/api';
import DropZone from '../../components/DropZone';

export default function ComparePdf() {
  const { startProcess, setProgress, setResult, setError } = useToolStore();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleProcess = async () => {
    if (!file1 || !file2) { setError('Masukkan kedua PDF'); return; }
    try {
      startProcess();
      setProgress(30);
      const res = await apiCompare(file1, file2);
      setProgress(90);
      const { fileId, filename } = res.data;
      setResult({ url: `${import.meta.env.VITE_API_BASE_URL}/download/${fileId}`, filename: filename || 'comparison.pdf' });
    } catch (err) {
      setError(err.message || 'Gagal membandingkan PDF. Pastikan backend & Ghostscript/qpdf berjalan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#8b90b0] hover:text-white mb-6 transition-colors">← Semua Tools</a>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Compare PDF</h1>
        <p className="text-[#8b90b0]">Bandingkan dua versi dokumen PDF secara berdampingan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">PDF Asli</h2>
          <DropZone onFiles={(f) => setFile1(f[0])} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} files={file1 ? [file1] : []} onRemove={() => setFile1(null)} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">PDF Revisi</h2>
          <DropZone onFiles={(f) => setFile2(f[0])} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} files={file2 ? [file2] : []} onRemove={() => setFile2(null)} />
        </div>
      </div>

      <button onClick={handleProcess} disabled={!file1 || !file2}
        className="w-full py-3.5 bg-[#e2001a] hover:bg-[#b8001a] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-lg">
        Bandingkan File
      </button>
    </div>
  );
}
