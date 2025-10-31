import { Box, Title } from '@mantine/core';

interface TitleSlideProps {
  dashboardName: string;
}

/**
 * Title slide component for presentation mode
 * Displays the dashboard name centered on a white background
 */
export function TitleSlide({ dashboardName }: TitleSlideProps) {
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Title
        order={1}
        c="black"
        style={{
          fontSize: '4rem',
          textAlign: 'center',
        }}
      >
        {dashboardName}
      </Title>
    </Box>
  );
}
