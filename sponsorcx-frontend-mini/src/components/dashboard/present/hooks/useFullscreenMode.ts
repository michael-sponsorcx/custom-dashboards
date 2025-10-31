import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage fullscreen mode for presentation
 * Enters fullscreen on mount and handles cleanup
 */
export function useFullscreenMode(onExit: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Enter fullscreen when component mounts
  useEffect(() => {
    const enterFullscreen = async () => {
      if (containerRef.current) {
        try {
          await containerRef.current.requestFullscreen();
        } catch (err) {
          console.error('Failed to enter fullscreen:', err);
        }
      }
    };

    enterFullscreen();

    // Exit fullscreen when component unmounts
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Handle fullscreen exit (when user presses ESC or clicks browser exit button)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  return containerRef;
}
