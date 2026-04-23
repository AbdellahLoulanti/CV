import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ZoomIn, ZoomOut, Download, Loader2 } from 'lucide-react';

const A4_WIDTH_PX  = 794;
const A4_HEIGHT_PX = 1123; // ~297mm at 96 dpi

export const PreviewPanel: React.FC = () => {
  const { cvData, template, colorTheme, zoom, setZoom } = useCVStore();
  const [exporting, setExporting] = React.useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);

  // Compute a fit-to-width scale based on the scroll container width
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const compute = () => {
      const available = el.clientWidth - 32; // 16px padding each side
      setAutoScale(Math.min(available / A4_WIDTH_PX, 1));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On mobile use auto-scale; on wider screens use the manual zoom slider
  const isMobile = autoScale < 1;
  const scale = isMobile ? autoScale : zoom / 100;

  const exportPDF = useCallback(async () => {
    if (!cvRef.current || exporting) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // Clone CV into an offscreen container to avoid scaled-parent transform artifacts in PDF.
      const exportRoot = document.createElement('div');
      exportRoot.style.position = 'fixed';
      exportRoot.style.left = '-99999px';
      exportRoot.style.top = '0';
      exportRoot.style.width = `${A4_WIDTH_PX}px`;
      exportRoot.style.background = '#ffffff';
      exportRoot.style.pointerEvents = 'none';

      const clonedNode = cvRef.current.cloneNode(true) as HTMLDivElement;
      clonedNode.style.transform = 'none';
      clonedNode.style.width = `${A4_WIDTH_PX}px`;
      clonedNode.style.margin = '0';
      exportRoot.appendChild(clonedNode);
      document.body.appendChild(exportRoot);

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(clonedNode, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: A4_WIDTH_PX,
        });
      } finally {
        document.body.removeChild(exportRoot);
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // A4 page height in canvas pixels
      const a4PxH = Math.round((pageH / pageW) * canvas.width);

      // Scan a row to count how many pixels are near-white (good break candidate)
      const ctx = canvas.getContext('2d')!;
      const countWhitePixels = (row: number): number => {
        const data = ctx.getImageData(0, row, canvas.width, 1).data;
        let count = 0;
        for (let x = 0; x < canvas.width; x++) {
          if (data[x * 4] > 240 && data[x * 4 + 1] > 240 && data[x * 4 + 2] > 240) count++;
        }
        return count;
      };

      // Find the best row to cut near a target, searching ±searchPx pixels
      const findBreak = (target: number, searchPx = 120): number => {
        if (target >= canvas.height) return canvas.height;
        let best = target;
        let bestScore = -1;
        const from = Math.max(0, target - searchPx);
        const to   = Math.min(canvas.height - 1, target + searchPx);
        for (let r = from; r <= to; r++) {
          const score = countWhitePixels(r);
          if (score > bestScore) { bestScore = score; best = r; }
        }
        return best;
      };

      // Build smart break-point list
      const breaks: number[] = [0];
      let cur = 0;
      while (cur + a4PxH < canvas.height) {
        const next = findBreak(cur + a4PxH);
        breaks.push(next);
        cur = next;
      }
      breaks.push(canvas.height);

      // Render each page as its own canvas slice
      for (let i = 0; i < breaks.length - 1; i++) {
        if (i > 0) pdf.addPage();
        const sliceTop = breaks[i];
        const sliceH   = breaks[i + 1] - sliceTop;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width  = canvas.width;
        pageCanvas.height = a4PxH;
        const pCtx = pageCanvas.getContext('2d')!;
        pCtx.fillStyle = '#ffffff';
        pCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pCtx.drawImage(canvas, 0, sliceTop, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, pageH);
      }

      const name = cvData.personalInfo.name.replace(/\s+/g, '_') || 'CV';
      pdf.save(`${name}_CV.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  }, [cvData, exporting]);

  const TemplateComponent =
    template === 'classic' ? ClassicTemplate :
    template === 'modern'  ? ModernTemplate  :
    MinimalTemplate;

  // Height of the scaled CV content for correct scroll space
  const [cvHeight, setCvHeight] = useState(A4_HEIGHT_PX);
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    const updateHeight = () => setCvHeight(el.scrollHeight);
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cvData, template, colorTheme]);
  const scaledHeight = cvHeight * scale;

  // Page-break positions inside the CV (unscaled px)
  const pageBreaks: number[] = [];
  for (let y = A4_HEIGHT_PX; y < cvHeight; y += A4_HEIGHT_PX) pageBreaks.push(y);

  return (
    <div className="flex flex-col h-full bg-slate-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0 gap-2">
        {/* Zoom controls — hidden on mobile (auto-fit is used instead) */}
        <div className={`flex items-center gap-1.5 ${isMobile ? 'hidden' : 'flex'}`}>
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

        {/* Mobile: show fit label */}
        {isMobile && (
          <span className="text-xs text-slate-400 font-medium">Fit to screen</span>
        )}

        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs 
            font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ml-auto"
        >
          {exporting ? (
            <><Loader2 size={13} className="animate-spin" /> Generating…</>
          ) : (
            <><Download size={13} /> Export PDF</>
          )}
        </button>
      </div>

      {/* Preview scroll area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: A4_WIDTH_PX,
            marginBottom: scaledHeight - cvHeight,
            position: 'relative',
          }}
          className="shadow-2xl"
        >
          {/* Page-break ruler lines */}
          {pageBreaks.map((y, i) => (
            <div
              key={i}
              style={{ top: y }}
              className="absolute left-0 right-0 z-10 pointer-events-none"
            >
              <div className="border-t-2 border-dashed border-red-400 opacity-60" />
              <span className="absolute right-1 -top-4 text-[9px] font-semibold text-red-400 bg-white px-1 rounded">
                Page {i + 2}
              </span>
            </div>
          ))}

          <div
            ref={cvRef}
            style={{
              width: A4_WIDTH_PX,
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
