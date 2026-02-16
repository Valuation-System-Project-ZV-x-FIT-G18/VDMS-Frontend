// Design System - Colors, Typography, Spacing
export const theme = {
  colors: {
    primary: {
      main: '#1890ff',
      light: '#40a9ff',
      dark: '#096dd9',
      bg: '#e6f4ff',
    },
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    
    // Status colors
    status: {
      completed: '#52c41a',
      paid: '#52c41a',
      pending: '#faad14',
      siteInspected: '#1890ff',
      awaitingDocs: '#faad14',
      paymentPending: '#ff4d4f',
      reportPrepared: '#fadb14',
    },

    // Neutral colors
    text: {
      primary: '#262626',
      secondary: '#8c8c8c',
      disabled: '#bfbfbf',
    },
    background: {
      default: '#ffffff',  // Pure white for main area
      paper: '#ffffff',
     sidebar: '#f0f5ff',  // Light blue for sidebar (matching your design)
},
    border: '#d9d9d9',
  },

  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export type Theme = typeof theme;