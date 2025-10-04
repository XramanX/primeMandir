// src/styles/theme.ts
export const THEME = {
  colors: {
    // Base
    bg: '#F5F7FB',
    surface: '#FFFFFF',
    primary: '#6C5CE7',
    accent: '#FF7675',
    muted: '#7B8A99',
    shadow: 'rgba(16,24,40,0.06)',
    glass: 'rgba(255,255,255,0.7)',

    // Status
    success: '#00B894',
    warning: '#FDCB6E',
    danger: '#D63031',
    gold: '#F1C40F',
    border: '#E5E9F0',

    // Saarathi chat colors (explicit)
    saarathiBg: '#F3F0FF', // soft violet background for AI replies
    saarathiText: '#3C2A80', // deep Krishna-blue for AI text
    userBubble: '#E9F6FF', // calm sky blue for user messages
    userText: '#1B2B40', // dark navy for user text
    inputBg: '#FFFFFF', // chat input box

    // Additional decorative tokens (explicit so UI changes are visible)
    krishnaBlue: '#071A52',
    deepIndigo: '#0B2340',
    saffron: '#FFB300', // slightly warmer saffron/gold
    lightTeal: '#E7FBFF',
    subtleText: '#9FB1D7',
  },

  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 50,
    full: 999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  },

  zIndex: {
    dropdown: 1000,
    modal: 1100,
    toast: 1200,
    fab: 1300,
  },

  gradient: {
    primary: ['#6C5CE7', '#A29BFE'],
    divine: ['#6C5CE7', '#F1C40F'],
  },

  // Shadow depth presets with cross-platform helpers
  shadowDepth: {
    soft: {
      // iOS shadow
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      // Android elevation
      elevation: 3,
    },
    medium: {
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    strong: {
      shadowColor: 'rgba(0,0,0,0.18)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 12,
    },
  },
};
