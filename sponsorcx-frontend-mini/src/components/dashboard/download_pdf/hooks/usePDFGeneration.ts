import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DashboardItem } from '@/types/dashboard';

interface UsePDFGenerationProps {
  graphs: DashboardItem[];
  dashboardName: string;
  titleSlideRef: React.RefObject<HTMLDivElement>;
  graphSlideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

interface UsePDFGenerationReturn {
  generatePDF: () => Promise<void>;
  isGenerating: boolean;
  progress: { current: number; total: number };
  error: string | null;
  cancel: () => void;
}

/**
 * Custom hook to handle PDF generation from dashboard slides
 * Captures slides as images and combines them into a PDF document
 */
export function usePDFGeneration({
  graphs,
  dashboardName,
  titleSlideRef,
  graphSlideRefs,
}: UsePDFGenerationProps): UsePDFGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setIsGenerating(false);
    setProgress({ current: 0, total: 0 });
  }, []);

  const generatePDF = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      cancelledRef.current = false;

      const totalSlides = 1 + graphs.length;
      setProgress({ current: 0, total: totalSlides });

      // Create PDF in landscape A4 format
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // PDF dimensions (A4 landscape)
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Helper function to wait for charts to load
      const waitForChartsToLoad = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      };

      // Helper function to capture a slide as canvas
      const captureSlide = async (element: HTMLDivElement): Promise<HTMLCanvasElement> => {
        await waitForChartsToLoad();

        const canvas = await html2canvas(element, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        return canvas;
      };

      // Capture title slide
      if (cancelledRef.current) {
        return;
      }

      if (titleSlideRef.current) {
        setProgress({ current: 1, total: totalSlides });
        const canvas = await captureSlide(titleSlideRef.current);

        // Calculate dimensions to fit PDF page
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }

      // Capture graph slides
      for (let i = 0; i < graphs.length; i++) {
        if (cancelledRef.current) {
          return;
        }

        const slideElement = graphSlideRefs.current[i];
        if (!slideElement) continue;

        setProgress({ current: i + 2, total: totalSlides });

        const canvas = await captureSlide(slideElement);

        // Add new page
        pdf.addPage();

        // Calculate dimensions
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/JPEG', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }

      if (cancelledRef.current) {
        return;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${dashboardName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.pdf`;

      // Download PDF
      pdf.save(filename);

      setIsGenerating(false);
      setProgress({ current: totalSlides, total: totalSlides });
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  }, [graphs, dashboardName, titleSlideRef, graphSlideRefs]);

  return {
    generatePDF,
    isGenerating,
    progress,
    error,
    cancel,
  };
}
