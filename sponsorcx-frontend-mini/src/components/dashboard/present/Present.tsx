import { Box } from '@mantine/core';
import { GridItem } from '@/types/dashboard';
import { useDashboardFilterStore } from '@/store';
import { useFullscreenMode, useSlideNavigation } from './hooks';
import { PresentationControls } from './components';
import { TitleSlide, GraphSlide } from '../shared/slides';

interface PresentProps {
  gridItems: GridItem[];
  dashboardName: string;
  onClose: () => void;
}

/**
 * Presentation mode component for the dashboard
 * Displays graphs in fullscreen mode with keyboard navigation
 */
export function Present({ gridItems, dashboardName, onClose }: PresentProps) {
  const { activeFilters: dashboardFilters } = useDashboardFilterStore();

  // Custom hooks handle fullscreen and navigation logic
  const containerRef = useFullscreenMode(onClose);
  const totalSlides = 1 + gridItems.length;
  const { currentSlide, handleNext, handlePrevious, handleClose } = useSlideNavigation({
    totalSlides,
    onExit: onClose,
  });

  // Render title slide (first slide)
  if (currentSlide === 0) {
    return (
      <Box
        ref={containerRef}
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <PresentationControls
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onClose={handleClose}
        />

        <TitleSlide dashboardName={dashboardName} />
      </Box>
    );
  }

  // Render graph slide
  const graphIndex = currentSlide - 1;
  const graph = gridItems[graphIndex];

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '24px',
      }}
    >
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={handleClose}
      />

      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '60px',
        }}
      >
        <GraphSlide
          graph={graph}
          dashboardFilters={dashboardFilters}
          dashboardName={dashboardName}
        />
      </Box>
    </Box>
  );
}
