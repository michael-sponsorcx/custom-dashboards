import { Group, Text, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

/**
 * Navigation controls for presentation mode
 * Displays slide counter and navigation buttons in top-right corner
 */
export function PresentationControls({
  currentSlide,
  totalSlides,
  onNext,
  onPrevious,
  onClose,
}: PresentationControlsProps) {
  return (
    <Group
      gap="md"
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 100,
      }}
    >
      <Text size="lg" fw={500} c="black">
        {currentSlide + 1} / {totalSlides}
      </Text>
      <ActionIcon
        size="lg"
        variant="subtle"
        color="dark"
        onClick={onPrevious}
        disabled={currentSlide === 0}
        aria-label="Previous slide"
      >
        <IconChevronLeft size={24} />
      </ActionIcon>
      <ActionIcon
        size="lg"
        variant="subtle"
        color="dark"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        aria-label="Next slide"
      >
        <IconChevronRight size={24} />
      </ActionIcon>
      <ActionIcon
        size="lg"
        variant="subtle"
        color="dark"
        onClick={onClose}
        aria-label="Close presentation"
      >
        <IconX size={24} />
      </ActionIcon>
    </Group>
  );
}
