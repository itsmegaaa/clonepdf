import { useState, useRef, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';
import { PDFDocument, PDFName } from 'pdf-lib';

export default function ScanToPdf() {
  const { startProcess, setProgress, setResult, setError } = useToolStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      setCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setError('Tidak bisa akses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraActive(false);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    setCaptures((prev) => [...prev, dataUrl]);
  };

  const handleProcess = async () => {
    if (!captures.length) return;
    try {
      stopCamera();
      startProcess();
      const doc = await PDFDocument.create();
      let i = 0;
      for (const dataUrl of captures) {
        setProgress((i / captures.length) * 80);
        const res = await fetch(dataUrl);
        const imgBytes = await res.arrayBuffer();
        const img = await doc.embedJpg(imgBytes);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        i++;
      }
      setProgress(95);
      const blob = new Blob([await doc.save()], { type: 'application/pdf' });
      setResult({ blob, filename: files[0].name.replace(/\.[^/.]+$/, "") + ".pdf" });
    } catch (err) {
      setError(err.message || 'Gagal membuat PDF dari scan');
    }
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#8b90b0] hover:text-white mb-6 transition-colors">
        ← Semua Tools
      </a>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Scan to PDF</h1>
        <p className="text-[#8b90b0]">Gunakan kamera untuk scan dokumen dan gabungkan menjadi PDF.</p>
      </div>

      <div className="space-y-4">
        {/* Camera view */}
        <div className="relative rounded-2xl overflow-hidden bg-[#1a1d27] border border-[#2d3150] aspect-video flex items-center justify-center">
          {cameraActive ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📷</p>
              <p className="text-[#8b90b0]">Klik tombol di bawah untuk aktifkan kamera</p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          {!cameraActive ? (
            <button onClick={startCamera}
              className="px-5 py-2.5 bg-[#e2001a] hover:bg-[#b8001a] text-white font-semibold rounded-xl transition-colors">
              📷 Aktifkan Kamera
            </button>
          ) : (
            <>
              <button onClick={capture}
                className="px-5 py-2.5 bg-[#e2001a] hover:bg-[#b8001a] text-white font-semibold rounded-xl transition-colors">
                📸 Capture ({captures.length})
              </button>
              <button onClick={stopCamera}
                className="px-5 py-2.5 bg-[#22263a] hover:bg-[#2d3150] text-white rounded-xl transition-colors">
                Matikan Kamera
              </button>
            </>
          )}

          {captures.length > 0 && (
            <button onClick={handleProcess}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors">
              ✅ Buat PDF ({captures.length} halaman)
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {captures.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {captures.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt={`Scan ${i + 1}`} className="w-full aspect-[3/4] object-cover rounded-lg border border-[#2d3150]" />
                <button onClick={() => setCaptures((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </button>
                <p className="text-xs text-center text-[#8b90b0] mt-1">{i + 1}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
