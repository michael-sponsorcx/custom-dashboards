import { Box, Text, Stack, Alert } from '@mantine/core';
import { formatNumber, NumberFormatType } from '../../../utils/numberFormatter';
import { extractSingleValue } from '../../../utils/chartDataAnalyzer';
import { useEffect, useRef, useState } from 'react';

interface NumberTileProps {
  // Either provide a direct value OR query result to extract from
  value?: number;
  queryResult?: any;
  label?: string;
  formatType?: NumberFormatType;
  precision?: number;
  primaryColor?: string;
}

/**
 * NumberTile component - displays a single numeric value that fills its container
 * Like Mantine charts, it uses 100% width and height to fill the parent container
 */
export function NumberTile({
  value: directValue,
  queryResult,
  label,
  formatType = 'number',
  precision = 2,
  primaryColor = '#3b82f6'
}: NumberTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('4rem');

  // Extract value from query result if provided, otherwise use direct value
  let value: number | undefined = directValue;

  if (queryResult !== undefined) {
    const extractedValue = extractSingleValue(queryResult);

    if (extractedValue === null) {
      return (
        <Alert color="red" variant="light">
          <Text size="sm">Unable to extract numeric value from query result.</Text>
        </Alert>
      );
    }

    value = extractedValue;
  }

  if (value === undefined) {
    return (
      <Alert color="red" variant="light">
        <Text size="sm">No value provided to NumberTile component.</Text>
      </Alert>
    );
  }

  const formattedValue = formatNumber(value, formatType, precision);

  // Calculate optimal font size based on container dimensions
  useEffect(() => {
    const updateFontSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // Use smaller dimension to ensure fit, with some padding
      const minDimension = Math.min(containerWidth, containerHeight);

      // Calculate font size: between 1.5rem and 8rem based on container size
      // Larger containers get larger fonts
      const calculatedSize = Math.max(
        24, // minimum 1.5rem (24px)
        Math.min(
          128, // maximum 8rem (128px)
          minDimension * 0.35 // 35% of smaller dimension
        )
      );

      setFontSize(`${calculatedSize}px`);
    };

    updateFontSize();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [formattedValue]);

  // Convert hex color to rgba for background
  const hexToRgba = (hex: string, alpha: number = 0.05) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hexToRgba(primaryColor, 0.03),
        borderRadius: '8px',
        padding: '1.5rem',
        minHeight: '120px',
        position: 'relative',
      }}
    >
      <Stack gap="md" align="center" style={{ width: '100%', maxWidth: '100%' }}>
        {/* Large, bold number that fills the space */}
        <Text
          style={{
            color: primaryColor,
            fontWeight: 900,
            fontSize: fontSize,
            lineHeight: 1.1,
            textAlign: 'center',
            wordBreak: 'break-word',
            transition: 'font-size 0.2s ease',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formattedValue}
        </Text>
        {label && (
          <Text
            size="md"
            c="dimmed"
            fw={600}
            style={{
              textAlign: 'center',
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
              letterSpacing: '0.5px',
            }}
          >
            {label}
          </Text>
        )}
      </Stack>
    </Box>
  );
}