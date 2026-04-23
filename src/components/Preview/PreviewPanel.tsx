import React, { useRef, useCallback } from 'react';
import { useCVStore } from '../../store/cvStore';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ZoomIn, ZoomOut, Download, Loader2 } from 'lucide-react';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export const PreviewPanel: React.FC = () => {
  const { cvData, template, colorTheme, zoom, setZoom } = useCVStore();
  const [exporting, setExporting] = React.useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const scale = zoom / 100;

  const exportPDF = useCallback(async () => {
    if (!cvRef.current || exporting) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(cvRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);

      const name = cvData.personalInfo.name.replace(/\s+/g, '_') || 'CV';
      pdf.save(`${name}_CV.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  }, [cvData, exporting]);

  const TemplateComponent = template === 'classic'
    ? ClassicTemplate
    : template === 'modern'
    ? ModernTemplate
    : MinimalTemplate;

  return (
    <div className="flex flex-col h-full bg-slate-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-xs text-slate-500 font-medium w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ZoomIn size={15} />
          </button>
          <input
            type="range" min={50} max={150} step={5} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-20 accent-indigo-600"
          />
        </div>

        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs 
            font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {exporting ? (
            <><Loader2 size={13} className="animate-spin" /> Generating…</>
          ) : (
            <><Download size={13} /> Export PDF</>
          )}
        </button>
      </div>

      {/* Preview scroll area */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-4">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
            marginBottom: `${(scale - 1) * A4_HEIGHT_PX}px`,
          }}
          className="shadow-2xl"
        >
          <div
            ref={cvRef}
            style={{
              width: A4_WIDTH_PX,
              minHeight: A4_HEIGHT_PX,
              padding: '40px 48px',
              background: '#ffffff',
              boxSizing: 'border-box',
            }}
          >
            <TemplateComponent data={cvData} theme={colorTheme} />
          </div>
        </div>
      </div>
    </div>
  );
};
