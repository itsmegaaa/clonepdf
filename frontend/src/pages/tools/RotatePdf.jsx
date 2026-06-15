import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';
import { rotatePdf } from '../../utils/clientPdf';

const ANGLES = [90, 180, 270];

export default function RotatePdf() {
  const { startProcess, setProgress, setResult, setError } = useToolStore();
  const [angle, setAngle] = useState(90);
  const [pageMode, setPageMode] = useState('all'); // 'all' | 'custom'
  const [pagesInput, setPagesInput] = useState('');

  const handleProcess = async (files) => {
    try {
      startProcess();
      setProgress(30);
      let pageIndices = 'all';
      if (pageMode === 'custom' && pagesInput.trim()) {
        pageIndices = pagesInput
          .split(',')
          .map((s) => parseInt(s.trim()) - 1)
          .filter((n) => !isNaN(n) && n >= 0);
      }
      const bytes = await rotatePdf(files[0], angle, pageIndices);
      setProgress(90);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({ blob, filename: 'rotated.pdf' });
    } catch (err) {
      setError(err.message || 'Gagal merotasi PDF');
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Putar halaman PDF ke kiri atau kanan sesuai kebutuhan."
      accept={{ 'application/pdf': ['.pdf'] }}
      multiple={false}
      onProcess={handleProcess}
      actionLabel="Putar PDF"
      options={
        <div className="space-y-4">
          {/* Angle selection */}
          <div>
            <label className="block text-sm text-[#8b90b0] mb-2">Sudut rotasi</label>
            <div className="flex gap-2">
              {ANGLES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${angle === a ? 'bg-[#e2001a] text-white' : 'bg-[#22263a] text-[#8b90b0] hover:text-white'}`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          {/* Page selection */}
          <div>
            <label className="block text-sm text-[#8b90b0] mb-2">Halaman</label>
            <div className="flex gap-2 mb-2">
              {[{ v: 'all', label: 'Semua' }, { v: 'custom', label: 'Pilih Halaman' }].map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => setPageMode(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${pageMode === v ? 'bg-[#e2001a] text-white' : 'bg-[#22263a] text-[#8b90b0] hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {pageMode === 'custom' && (
              <input
                type="text"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="Contoh: 1, 3, 5-7"
                className="w-full px-4 py-2.5 bg-[#22263a] border border-[#2d3150] rounded-xl text-white placeholder-[#4a5070]
                  focus:outline-none focus:border-[#e2001a]/50 text-sm"
              />
            )}
          </div>
        </div>
      }
    />
  );
}
