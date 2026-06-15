import { useState } from 'react';
import JSZip from 'jszip';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';
import { splitPdfByRange, splitPdfEveryN } from '../../utils/clientPdf';
import { downloadBlob } from '../../utils/fileHelpers';

export default function SplitPdf() {
  const { startProcess, setProgress, setResult, setError } = useToolStore();
  const [mode, setMode] = useState('range'); // 'range' | 'every'
  const [rangeInput, setRangeInput] = useState('');
  const [everyN, setEveryN] = useState(1);

  const handleProcess = async (files) => {
    try {
      startProcess();
      setProgress(20);
      const file = files[0];
      let parts;
      if (mode === 'range') {
        parts = await splitPdfByRange(file, rangeInput || '1');
      } else {
        parts = await splitPdfEveryN(file, everyN);
      }
      setProgress(70);

      if (parts.length === 1) {
        const blob = new Blob([parts[0]], { type: 'application/pdf' });
        setResult({ blob, filename: files[0].name });
      } else {
        const zip = new JSZip();
        parts.forEach((bytes, i) => zip.file(`part_${i + 1}.pdf`, bytes));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProgress(95);
        setResult({ blob: zipBlob, filename: files[0].name.replace(/\.[^/.]+$/, "") + "_split.zip" });
      }
    } catch (err) {
      setError(err.message || 'Gagal memisahkan PDF');
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Pisahkan halaman PDF berdasarkan range atau setiap N halaman."
      accept={{ 'application/pdf': ['.pdf'] }}
      multiple={false}
      onProcess={handleProcess}
      actionLabel="Pisahkan PDF"
      options={
        <div className="space-y-4">
          <div className="flex gap-3">
            {[{ v: 'range', label: 'Berdasarkan Range' }, { v: 'every', label: 'Setiap N Halaman' }].map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${mode === v ? 'bg-[#e2001a] text-white' : 'bg-[#22263a] text-[#8b90b0] hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'range' ? (
            <div>
              <label className="block text-sm text-[#8b90b0] mb-2">Range halaman (contoh: 1-3, 5, 7-9)</label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-3, 5, 7-9"
                className="w-full px-4 py-2.5 bg-[#22263a] border border-[#2d3150] rounded-xl text-white placeholder-[#4a5070]
                  focus:outline-none focus:border-[#e2001a]/50 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-[#8b90b0] mb-2">Pisahkan setiap {everyN} halaman</label>
              <input
                type="number"
                min={1}
                value={everyN}
                onChange={(e) => setEveryN(Math.max(1, Number(e.target.value)))}
                className="w-32 px-4 py-2.5 bg-[#22263a] border border-[#2d3150] rounded-xl text-white
                  focus:outline-none focus:border-[#e2001a]/50 text-sm"
              />
            </div>
          )}
        </div>
      }
    />
  );
}
