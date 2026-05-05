/**
 * CMSPrintView - Fills the actual CMS-1500 fillable PDF with data
 * and renders it for viewing and printing. No background overlay needed.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { CMS1500Data } from "../types";
import { fillCmsForm } from "../fillCmsForm";
import { Printer, FileText, Loader2 } from "lucide-react";

interface PrintViewProps {
  data: CMS1500Data;
}

export default function CMSPrintView({ data }: PrintViewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const generatePdf = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const pdfBytes = await fillCmsForm(data);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(`Failed to fill CMS form: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generatePdf();
  }, [generatePdf]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handlePrint = () => {
    if (printFrameRef.current) {
      printFrameRef.current.contentWindow?.print();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm font-bold uppercase tracking-widest">
          Filling CMS-1500 Form...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-sm font-bold text-red-700 uppercase tracking-widest mb-2">
            Form Fill Error
          </p>
          <p className="text-xs text-red-500 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Print button bar */}
      <div className="flex items-center gap-4 no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Filled CMS-1500
        </button>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          <FileText className="w-3 h-3 inline mr-1" />
          Filled PDF — ready for printing
        </span>
      </div>

      {/* Embedded filled PDF for viewing */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg">
        <iframe
          ref={printFrameRef}
          src={pdfUrl || ""}
          className="block"
          style={{
            width: "8.5in",
            height: "11in",
            border: "none",
          }}
          title="CMS-1500 Filled Form"
        />
      </div>

      {/* Print-only copy hidden from screen */}
      <iframe
        src={pdfUrl || ""}
        className="hidden print:block print:fixed print:inset-0 print:w-full print:h-full print:border-none print:z-[99999]"
        style={{
          display: "none",
        }}
        title="CMS-1500 Print Frame"
      />

      <style>{`
        @page {
          size: 8.5in 11in;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}