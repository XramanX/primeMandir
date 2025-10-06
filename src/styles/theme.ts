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
    saarathiBg: '#F3F0FF',
    saarathiText: '#3C2A80',
    userBubble: '#E9F6FF',
    userText: '#1B2B40',
    inputBg: '#FFFFFF',

    // Decorative (general)
    krishnaBlue: '#071A52',
    deepIndigo: '#0B2340',
    saffron: '#FFB300',
    lightTeal: '#E7FBFF',
    subtleText: '#9FB1D7',

    /* Golden Temple Aarti Palette */
    templeGold: '#C19A3D', // pillars/ornament
    templeAmber: '#FFD166', // warm glow
    templeRed: '#7B2C10', // altar main
    templeDarkRed: '#3B1206', // deep bottom fade
    templeShadow: 'rgba(0,0,0,0.25)',
    templeHighlight: '#FFF4C1',
    templeBackground: '#FFF8E1',
    diyaFlame: '#FFB74D',
    diyaCore: '#FFE082',
    incenseSmoke: 'rgba(255, 240, 200, 0.14)',

    /* ☆ Carpet / Altar tokens */
    carpetPrimary: '#5B1F10', // rich maroon base
    carpetSecondary: '#7B2C10', // warm maroon mid
    carpetAccent: '#C19A3D', // gold motifs
    carpetPatternLight: 'rgba(255,255,255,0.04)', // subtle motifs
    carpetEdge: '#3B1206', // deep edge
    carpetInset: '#2A0E07', // inner deep shade
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
    templeCarpet: ['#7B2C10', '#3B1206'],
    templeGlow: ['#C19A3D', '#FFD166'],
  },

  shadowDepth: {
    soft: {
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
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
