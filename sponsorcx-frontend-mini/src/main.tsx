import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, mergeThemeOverrides } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme as stadiumTheme } from '@/stadiumDS/foundations/mantineTheme';
import App from './App';

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import './styles/grid-layout-override.css';

const theme = mergeThemeOverrides(stadiumTheme, {
  components: {
    Modal: {
      defaultProps: {
        withinPortal: true,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
