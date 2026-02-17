import { useRef, useEffect } from 'react';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GridItem } from '@/types/dashboard';
import { useDashboardFilterStore } from '@/store';
import colors from '@/stadiumDS/foundations/colors';
import { usePDFGeneration } from './hooks';
import { DownloadPDFToast } from './components';
import { TitleSlide, GraphSlide } from '../shared/slides';

interface DownloadPDFProps {
  gridItems: GridItem[];
  dashboardName: string;
  onComplete: () => void;
}

/**
 * DownloadPDF component - Generates a PDF document from dashboard slides
 * Renders slides off-screen, captures them as images, and combines into PDF
 */
export function DownloadPDF({ gridItems, dashboardName, onComplete }: DownloadPDFProps) {
  const { activeFilters: dashboardFilters } = useDashboardFilterStore();

  // Refs for slide elements to capture
  const titleSlideRef = useRef<HTMLDivElement>(null);
  const graphSlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // PDF generation hook
  const { generatePDF, isGenerating, progress, error, cancel } = usePDFGeneration({
    gridItems,
    dashboardName,
    titleSlideRef,
    graphSlideRefs,
  });

  // Start generation when component mounts
  useEffect(() => {
    // Small delay to ensure slides are rendered
    const timer = setTimeout(() => {
      generatePDF();
    }, 500);

    return () => clearTimeout(timer);
  }, [generatePDF]);

  // Handle completion
  useEffect(() => {
    if (!isGenerating && progress.current === progress.total && progress.total > 0) {
      notifications.show({
        title: 'PDF Generated',
        message: 'Your dashboard PDF has been downloaded successfully',
        color: 'green',
      });
      onComplete();
    }
  }, [isGenerating, progress, onComplete]);

  // Handle errors
  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'PDF Generation Failed',
        message: error,
        color: 'red',
      });
      onComplete();
    }
  }, [error, onComplete]);

  const handleCancel = () => {
    cancel();
    onComplete();
  };

  return (
    <>
      {/* Hidden container for rendering slides off-screen */}
      <Box
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1920px',
          height: '1080px',
          backgroundColor: colors.Base.White,
        }}
      >
        {/* Title Slide */}
        <Box
          ref={titleSlideRef}
          style={{
            width: '1920px',
            height: '1080px',
            backgroundColor: colors.Base.White,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <TitleSlide dashboardName={dashboardName} />
        </Box>

        {/* Graph Slides */}
        {gridItems.map((graph, index) => (
          <Box
            key={graph.id}
            ref={(el) => (graphSlideRefs.current[index] = el)}
            style={{
              width: '1920px',
              height: '1080px',
              backgroundColor: colors.Base.White,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              padding: 48,
            }}
          >
            <Box
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 60,
              }}
            >
              <GraphSlide
                graph={graph}
                dashboardFilters={dashboardFilters}
                dashboardName={dashboardName}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Progress Toast */}
      {isGenerating && (
        <DownloadPDFToast
          current={progress.current}
          total={progress.total}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
