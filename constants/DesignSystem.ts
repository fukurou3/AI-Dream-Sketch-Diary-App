export const DESIGN_SYSTEM = {
  // Modern Color Palette inspired by Instagram
  COLORS: {
    // Primary Brand Colors
    PRIMARY: '#E1306C', // Instagram pink
    PRIMARY_DARK: '#C13584', // Darker pink
    SECONDARY: '#405DE6', // Instagram blue
    ACCENT: '#F77737', // Instagram orange
    GRADIENT: {
      PRIMARY: ['#833AB4', '#FD1D1D', '#FCB045'], // Instagram story gradient
      SECONDARY: ['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D'],
      DREAM: ['#667eea', '#764ba2'], // Dream-like gradient
      NIGHT: ['#0c0c0c', '#1a1a2e', '#16213e'], // Night sky gradient
    },
    
    // Neutral Colors
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GREY: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Dark Theme Colors
    DARK: {
      BACKGROUND: '#000000',
      SURFACE: '#121212',
      CARD: '#1E1E1E',
      BORDER: '#2C2C2C',
      TEXT_PRIMARY: '#FFFFFF',
      TEXT_SECONDARY: '#B3B3B3',
      TEXT_TERTIARY: '#8C8C8C',
    },
    
    // Light Theme Colors
    LIGHT: {
      BACKGROUND: '#FFFFFF',
      SURFACE: '#FAFAFA',
      CARD: '#FFFFFF',
      BORDER: '#DBDBDB',
      TEXT_PRIMARY: '#262626',
      TEXT_SECONDARY: '#737373',
      TEXT_TERTIARY: '#C7C7C7',
    },
    
    // Semantic Colors
    SUCCESS: '#00D4AA',
    WARNING: '#FFB800',
    ERROR: '#FF3040',
    INFO: '#0095F6',
  },
  
  // Typography System
  TYPOGRAPHY: {
    // Font Families
    FONTS: {
      PRIMARY: 'SF Pro Display', // iOS default
      SECONDARY: 'Roboto', // Android default
      MONO: 'SF Mono',
    },
    
    // Font Sizes
    SIZES: {
      XXS: 10,
      XS: 12,
      SM: 14,
      MD: 16,
      LG: 18,
      XL: 20,
      XXL: 24,
      XXXL: 28,
      XXXXL: 32,
      XXXXXL: 36,
    },
    
    // Line Heights
    LINE_HEIGHTS: {
      TIGHT: 1.2,
      NORMAL: 1.4,
      RELAXED: 1.6,
      LOOSE: 1.8,
    },
    
    // Font Weights
    WEIGHTS: {
      LIGHT: '300',
      REGULAR: '400',
      MEDIUM: '500',
      SEMIBOLD: '600',
      BOLD: '700',
      EXTRABOLD: '800',
    },
  },
  
  // Spacing System (8px grid)
  SPACING: {
    XXS: 2,
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    XXXXL: 40,
    XXXXXL: 48,
    XXXXXXL: 56,
    XXXXXXXL: 64,
  },
  
  // Border Radius System
  RADIUS: {
    NONE: 0,
    XS: 2,
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    XXL: 20,
    XXXL: 24,
    ROUND: 50,
    CIRCLE: 9999,
  },
  
  // Shadow System
  SHADOWS: {
    NONE: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    XS: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    SM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    MD: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    LG: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    XL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  
  // Animation System
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 250,
      SLOW: 350,
      SLOWER: 500,
    },
    EASING: {
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out',
      LINEAR: 'linear',
    },
  },
  
  // Component Sizes
  SIZES: {
    BUTTON: {
      SM: { height: 32, paddingHorizontal: 12 },
      MD: { height: 40, paddingHorizontal: 16 },
      LG: { height: 48, paddingHorizontal: 20 },
      XL: { height: 56, paddingHorizontal: 24 },
    },
    AVATAR: {
      XS: 24,
      SM: 32,
      MD: 40,
      LG: 56,
      XL: 80,
      XXL: 120,
    },
    ICON: {
      XS: 12,
      SM: 16,
      MD: 20,
      LG: 24,
      XL: 32,
      XXL: 40,
    },
  },
  
  // Layout Constants
  LAYOUT: {
    HEADER_HEIGHT: 56,
    TAB_BAR_HEIGHT: 83,
    SAFE_AREA_PADDING: 20,
    CONTENT_MAX_WIDTH: 600,
    GRID_COLUMNS: 3,
  },
  
  // Z-Index System
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
} as const;

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return isDark ? DESIGN_SYSTEM.COLORS.DARK : DESIGN_SYSTEM.COLORS.LIGHT;
};

// Helper function to create gradients
export const createGradient = (colors: string[], direction: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal') => {
  return {
    colors,
    start: direction === 'horizontal' ? { x: 0, y: 0 } : direction === 'vertical' ? { x: 0, y: 0 } : { x: 0, y: 0 },
    end: direction === 'horizontal' ? { x: 1, y: 0 } : direction === 'vertical' ? { x: 0, y: 1 } : { x: 1, y: 1 },
  };
};