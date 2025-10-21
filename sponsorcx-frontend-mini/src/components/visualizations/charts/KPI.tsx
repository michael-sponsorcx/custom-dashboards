import { Box, Text, Group, Stack, Alert } from '@mantine/core';
import { formatNumber, NumberFormatType } from '../../../utils/numberFormatter';
import { extractSingleValue } from '../../../utils/chartDataAnalyzer';
import { useEffect, useRef, useState } from 'react';

interface KPIProps {
  // Either provide a direct value OR query result to extract from
  value?: number;
  queryResult?: any;
  label?: string;
  formatType?: NumberFormatType;
  precision?: number;
  primaryColor?: string;
  // Optional secondary metric for comparison
  secondaryValue?: number;
  secondaryLabel?: string;
  showTrend?: boolean;
  trendPercentage?: number;
}

/**
 * KPI component - displays key performance indicators in HubSpot style
 * Features:
 * - Large, bold primary metric
 * - Optional secondary comparison metric
 * - Clean, minimal design
 * - Fills container like other chart types
 */
export function KPI({
  value: directValue,
  queryResult,
  label,
  formatType = 'number',
  precision = 2,
  primaryColor = '#3b82f6',
  secondaryValue,
  secondaryLabel,
  showTrend = false,
  trendPercentage,
}: KPIProps) {
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
        <Text size="sm">No value provided to KPI component.</Text>
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

      // Calculate available space (accounting for padding and label)
      const availableWidth = containerWidth - 64; // 2rem padding on each side
      const labelHeight = label ? 40 : 0; // Approximate label height
      const trendHeight = (showTrend && trendPercentage !== undefined) || secondaryValue !== undefined ? 50 : 0;
      const availableHeight = containerHeight - 64 - labelHeight - trendHeight; // Account for padding and other elements

      // Make the font as large as possible while fitting the content
      // Use width as primary constraint, height as secondary
      const widthBasedSize = availableWidth / (formattedValue.length * 0.6); // Rough character width ratio
      const heightBasedSize = availableHeight * 0.85; // Use most of available height

      // Take the smaller of the two to ensure it fits
      const calculatedSize = Math.max(
        32, // minimum 32px for readability
        Math.min(
          widthBasedSize,
          heightBasedSize,
          500 // maximum 500px (very large displays)
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
  }, [formattedValue, label, showTrend, trendPercentage, secondaryValue]);

  // Determine trend color
  const getTrendColor = (percentage: number) => {
    if (percentage > 0) return '#0a8754'; // Green
    if (percentage < 0) return '#d32f2f'; // Red
    return '#666'; // Gray for neutral
  };

  const trendColor = trendPercentage !== undefined ? getTrendColor(trendPercentage) : undefined;

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(1rem, 3%, 2rem)', // Responsive padding
        minHeight: '140px',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <Stack gap="xs" style={{ width: '100%', maxWidth: '100%', alignItems: 'center' }}>
        {/* Label at top - Centered */}
        {label && (
          <Text
            size="sm"
            c="dimmed"
            fw={600}
            tt="uppercase"
            ta="center"
            style={{
              letterSpacing: '0.5px',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
              marginBottom: '0.25rem',
            }}
          >
            {label}
          </Text>
        )}

        {/* Primary KPI Value - Large, Bold, and Centered */}
        <Text
          ta="center"
          style={{
            color: primaryColor,
            fontWeight: 700,
            fontSize: fontSize,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            transition: 'font-size 0.2s ease',
            maxWidth: '100%',
            wordBreak: 'break-all', // Allow breaking on long numbers
          }}
        >
          {formattedValue}
        </Text>

        {/* Trend indicator or secondary metric */}
        {(showTrend && trendPercentage !== undefined) || secondaryValue !== undefined ? (
          <Group gap="md" mt="xs">
            {showTrend && trendPercentage !== undefined && (
              <Group gap="xs">
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    color: trendColor,
                    fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                  }}
                >
                  {trendPercentage > 0 ? '▲' : trendPercentage < 0 ? '▼' : '—'}{' '}
                  {Math.abs(trendPercentage)}%
                </Text>
              </Group>
            )}

            {secondaryValue !== undefined && (
              <Stack gap={0}>
                <Text size="xs" c="dimmed" fw={500}>
                  {secondaryLabel || 'Previous'}
                </Text>
                <Text size="sm" fw={600} c="dimmed">
                  {formatNumber(secondaryValue, formatType, precision)}
                </Text>
              </Stack>
            )}
          </Group>
        ) : null}
      </Stack>
    </Box>
  );
}