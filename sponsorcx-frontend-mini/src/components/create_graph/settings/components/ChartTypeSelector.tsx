import { Box, Group, SimpleGrid, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { ChartType } from '../../../../utils/chartDataAnalyzer';

interface ChartTypeSelectorProps {
  selectedChartType: ChartType | null;
  compatibleCharts: ChartType[];
  onChartTypeChange: (chartType: ChartType) => void;
}

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  kpi: 'KPI',
  line: 'Line Chart',
  bar: 'Bar Chart (Vertical)',
  stackedBar: 'Stacked Bar Chart',
  horizontalBar: 'Bar Chart (Horizontal)',
  horizontalStackedBar: 'Horizontal Stacked Bar',
  pie: 'Pie Chart',
};

function ChartTypeIcon({ type, color }: { type: ChartType; color: string }) {
  // Inline SVG previews for each chart type to avoid external icon dependencies
  const size = 36; // drawing area inside the square
  const stroke = color;
  const fill = color;

  if (type === 'kpi') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <text x="6" y="32" fontSize="24" fill={fill} fontFamily="inherit">123</text>
      </svg>
    );
  }

  if (type === 'line') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <polyline
          points="6,36 16,24 26,28 36,14 42,18"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'bar' || type === 'stackedBar') {
    // horizontal bars; stacked has segments (swapped per user expectation)
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        {type === 'bar' ? (
          <g fill={fill}>
            <rect x="8" y="10" width="24" height="6" rx="1" />
            <rect x="8" y="21" width="30" height="6" rx="1" />
            <rect x="8" y="32" width="18" height="6" rx="1" />
          </g>
        ) : (
          <g>
            <rect x="8" y="10" width="12" height="6" rx="1" fill={fill} />
            <rect x="20" y="10" width="12" height="6" rx="1" fill={fill} opacity="0.55" />
            <rect x="8" y="21" width="16" height="6" rx="1" fill={fill} />
            <rect x="24" y="21" width="14" height="6" rx="1" fill={fill} opacity="0.55" />
            <rect x="8" y="32" width="10" height="6" rx="1" fill={fill} />
            <rect x="18" y="32" width="10" height="6" rx="1" fill={fill} opacity="0.55" />
          </g>
        )}
      </svg>
    );
  }

  if (type === 'horizontalBar' || type === 'horizontalStackedBar') {
    // vertical bars; stacked has segments (swapped per user expectation)
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        {type === 'horizontalBar' ? (
          <g fill={fill}>
            <rect x="8" y="22" width="8" height="16" rx="1" />
            <rect x="20" y="14" width="8" height="24" rx="1" />
            <rect x="32" y="26" width="8" height="12" rx="1" />
          </g>
        ) : (
          <g>
            <rect x="8" y="30" width="8" height="8" rx="1" fill={fill} opacity="0.55" />
            <rect x="8" y="22" width="8" height="8" rx="1" fill={fill} />
            <rect x="20" y="30" width="8" height="8" rx="1" fill={fill} opacity="0.55" />
            <rect x="20" y="18" width="8" height="12" rx="1" fill={fill} />
            <rect x="32" y="34" width="8" height="4" rx="1" fill={fill} opacity="0.55" />
            <rect x="32" y="26" width="8" height="8" rx="1" fill={fill} />
          </g>
        )}
      </svg>
    );
  }

  if (type === 'pie') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="18" fill={fill} opacity="0.8" />
        <path
          d="M 24 24 L 24 6 A 18 18 0 0 1 39.57 10.43 Z"
          fill={fill}
          opacity="0.5"
        />
        <path
          d="M 24 24 L 39.57 10.43 A 18 18 0 0 1 42 24 Z"
          fill={fill}
          opacity="0.3"
        />
      </svg>
    );
  }

  return null;
}

/**
 * ChartTypeSelector Component
 *
 * Handles chart type selection with compatible/incompatible states
 */
export function ChartTypeSelector({
  selectedChartType,
  compatibleCharts,
  onChartTypeChange,
}: ChartTypeSelectorProps) {
  const theme = useMantineTheme();

  // Show all chart types, but disable incompatible ones
  const allChartTypes: ChartType[] = [
    'kpi',
    'line',
    'bar',
    'stackedBar',
    'horizontalBar',
    'horizontalStackedBar',
    'pie',
  ];

  const isDisabled = (type: ChartType) => !compatibleCharts.includes(type);
  const isSelected = (type: ChartType) => selectedChartType === type;

  const tileBorder = (active: boolean) => `1px solid ${active ? theme.colors.blue[6] : theme.colors.gray[4]}`;
  const tileBg = (active: boolean) => (active ? theme.colors.blue[0] : theme.colors.gray[0]);
  const iconColor = (active: boolean) => (active ? theme.colors.blue[6] : theme.colors.gray[7]);

  return (
    <Box>
      <Text size="sm" fw={500} mb={6}>Chart Type</Text>
      <SimpleGrid cols={3} spacing="xs">
        {allChartTypes.map((type) => {
          const disabled = isDisabled(type);
          const selected = isSelected(type);
          return (
            <Tooltip key={type} label={CHART_TYPE_LABELS[type]} disabled={selected}>
              <Box
                role="button"
                aria-label={CHART_TYPE_LABELS[type]}
                aria-pressed={selected}
                onClick={() => !disabled && onChartTypeChange(type)}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onChartTypeChange(type);
                  }
                }}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  height: 64,
                  borderRadius: 8,
                  border: tileBorder(selected),
                  backgroundColor: tileBg(selected),
                  opacity: disabled ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 120ms ease, background-color 120ms ease',
                }}
              >
                <Group gap={6} align="center" justify="center">
                  <ChartTypeIcon type={type} color={iconColor(selected)} />
                </Group>
              </Box>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
