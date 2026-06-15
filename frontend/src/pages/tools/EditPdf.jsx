import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import useToolStore from '../../store/useToolStore';

export default function EditPdf() {
  return (
    <ToolLayout
      title="Edit PDF"
      description="Edit PDF secara interaktif dengan menambahkan teks dan gambar. (Versi sederhana)"
      accept={{ 'application/pdf': ['.pdf'] }}
      multiple={false}
      onProcess={() => alert('Fitur editor interaktif (Fabric.js) belum diimplementasi full di versi ini, gunakan Sign/Watermark/Forms untuk manipulasi PDF.')}
      actionLabel="Edit PDF"
      options={
        <div className="p-4 bg-[#22263a] rounded-xl border border-[#2d3150] text-center">
          <p className="text-sm text-[#8b90b0]">
            Untuk menambahkan teks, gambar, atau elemen lain secara interaktif, silakan gunakan tool <b>Watermark PDF</b>, <b>Sign PDF</b>, atau <b>PDF Forms</b> untuk saat ini.
          </p>
        </div>
      }
    />
  );
}
