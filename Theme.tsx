/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useBreakpoint, Breakpoint } from './hooks/useBreakpoint.tsx';

// --- DESIGN TOKENS (Tier 2, System Prompt) ---

const Base = { Unit: { Space: 4, Radius: 4, Time: 100 } };
const px = (value: number) => `${value}px`;

// SUS Design System Colors (Slate-based)
const lightThemeColors = {
  Color: {
    Base: {
      Surface: { '1': '#FFFFFF', '2': '#F8FAFC', '3': '#F1F5F9' }, // White, Slate-50, Slate-100
      Content: { '1': '#0F172A', '2': '#475569', '3': '#94A3B8' }  // Slate-900, Slate-600, Slate-400
    },
    Accent: {
      Surface: { '1': '#0F172A', '2': '#E2E8F0' }, // Slate-900 (Black-ish), Slate-200
      Content: { '1': '#FFFFFF', '2': '#0F172A' }  // White, Slate-900
    },
    Success: { Surface: { '1': '#DCFCE7' }, Content: { '1': '#166534' } }, // Green-100, Green-800
    Warning: { Surface: { '1': '#FEF9C3' }, Content: { '1': '#854D0E' } }, // Yellow-100, Yellow-800
    Error: { Surface: { '1': '#FEE2E2' }, Content: { '1': '#991B1B' } },   // Red-100, Red-800
    Focus: { Surface: { '1': '#EFF6FF' }, Content: { '1': '#1D4ED8' } },   // Blue-50, Blue-700
    Signal: { Surface: { '1': '#F3E8FF' }, Content: { '1': '#7E22CE' } }   // Purple-100, Purple-700
  }
};

const darkThemeColors = {
  Color: {
    Base: {
      Surface: { '1': '#020617', '2': '#0F172A', '3': '#1E293B' }, // Slate-950, Slate-900, Slate-800
      Content: { '1': '#F8FAFC', '2': '#94A3B8', '3': '#475569' }  // Slate-50, Slate-400, Slate-600
    },
    Accent: {
      Surface: { '1': '#F8FAFC', '2': '#334155' }, // Slate-50 (White-ish), Slate-700
      Content: { '1': '#0F172A', '2': '#F8FAFC' }  // Slate-900, Slate-50
    },
    Success: { Surface: { '1': '#052E16' }, Content: { '1': '#4ADE80' } }, // Green-950, Green-400
    Warning: { Surface: { '1': '#422006' }, Content: { '1': '#FACC15' } }, // Yellow-950, Yellow-400
    Error: { Surface: { '1': '#450A0A' }, Content: { '1': '#F87171' } },   // Red-950, Red-400
    Focus: { Surface: { '1': '#172554' }, Content: { '1': '#60A5FA' } },   // Blue-950, Blue-400
    Signal: { Surface: { '1': '#3B0764' }, Content: { '1': '#C084FC' } }   // Purple-950, Purple-400
  }
};

const typography = {
  Type: {
    Expressive: {
      Display: {
        L: { fontSize: { desktop: '48px', tablet: '40px', mobile: '36px' }, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.025em', tag: 'h1', fontFamily: "'Inter', sans-serif" },
        M: { fontSize: { desktop: '36px', tablet: '32px', mobile: '30px' }, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.025em', tag: 'h2', fontFamily: "'Inter', sans-serif" },
        S: { fontSize: '30px', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.025em', tag: 'h3', fontFamily: "'Inter', sans-serif" },
      },
      Headline: {
        L: { fontSize: '24px', lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.025em', tag: 'h4', fontFamily: "'Inter', sans-serif" },
        M: { fontSize: '20px', lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.015em', tag: 'h5', fontFamily: "'Inter', sans-serif" },
        S: { fontSize: '18px', lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.015em', tag: 'h6', fontFamily: "'Inter', sans-serif" },
      },
      Quote: { fontSize: '20px', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0em', tag: 'blockquote', fontFamily: "'Inter', sans-serif" },
      Data: { fontSize: '12px', lineHeight: 1.5, fontWeight: 500, letterSpacing: '0em', tag: 'code', fontFamily: "'Victor Mono', monospace" },
    },
    Readable: {
      Title: {
        L: { fontSize: '18px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0em', tag: 'h3', fontFamily: "'Inter', sans-serif" },
        M: { fontSize: '16px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0em', tag: 'h4', fontFamily: "'Inter', sans-serif" },
        S: { fontSize: '14px', lineHeight: '20px', fontWeight: 600, letterSpacing: '0em', tag: 'h5', fontFamily: "'Inter', sans-serif" },
      },
      Body: {
        L: { fontSize: '16px', lineHeight: '28px', fontWeight: 400, letterSpacing: '0em', tag: 'p', fontFamily: "'Inter', sans-serif" },
        M: { fontSize: '14px', lineHeight: '24px', fontWeight: 400, letterSpacing: '0em', tag: 'p', fontFamily: "'Inter', sans-serif" },
        S: { fontSize: '13px', lineHeight: '20px', fontWeight: 400, letterSpacing: '0em', tag: 'p', fontFamily: "'Inter', sans-serif" },
        PageSubheading: { fontSize: { mobile: '14px', tablet: '16px' }, lineHeight: { mobile: '22px', tablet: '26px' }, fontWeight: 400, letterSpacing: '0em', tag: 'p', fontFamily: "'Inter', sans-serif" },
      },
      Label: {
        L: { fontSize: '14px', lineHeight: '20px', fontWeight: 500, letterSpacing: '0em', tag: 'span', fontFamily: "'Inter', sans-serif" },
        M: { fontSize: '13px', lineHeight: '18px', fontWeight: 500, letterSpacing: '0em', tag: 'span', fontFamily: "'Inter', sans-serif" },
        S: { fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0em', tag: 'span', fontFamily: "'Inter', sans-serif" },
      },
    }
  }
};

const spacing = { 'Space.XS': px(Base.Unit.Space * 1), 'Space.S': px(Base.Unit.Space * 2), 'Space.M': px(Base.Unit.Space * 3), 'Space.L': px(Base.Unit.Space * 4), 'Space.XL': px(Base.Unit.Space * 6), 'Space.XXL': px(Base.Unit.Space * 8), 'Space.XXXL': px(Base.Unit.Space * 12) };
const radius = { 'Radius.S': '6px', 'Radius.M': '8px', 'Radius.L': '12px', 'Radius.XL': '16px', 'Radius.Full': '9999px' };
const effects = { 
  'Effect.Shadow.Drop.1': '0 1px 2px 0 rgb(0 0 0 / 0.05)', 
  'Effect.Shadow.Drop.2': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
  'Effect.Shadow.Drop.3': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', 
  'Effect.Shadow.Inset.1': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' 
};
const time = { 'Time.1x': `${Base.Unit.Time * 1}ms`, 'Time.2x': `${Base.Unit.Time * 2}ms`, 'Time.3x': `${Base.Unit.Time * 3}ms`, 'Time.4x': `${Base.Unit.Time * 4}ms`, 'Time.Subtle.1': `${Base.Unit.Time * 1 + 50}ms`, 'Time.Subtle.2': `${Base.Unit.Time * 2 + 50}ms` };

const rawTheme = { Type: typography.Type, spacing, radius, effects, time };

const themes = { light: lightThemeColors, dark: darkThemeColors };

// --- LOGIC FOR CREATING A "SMART" THEME ---

const isResponsiveObject = (value: any): value is { [key in Breakpoint]?: any } => {
  return value && typeof value === 'object' && ('mobile' in value || 'tablet' in value || 'desktop' in value);
};

// Recursively traverses the theme tokens and resolves any responsive values.
const resolveTokens = (obj: any, breakpoint: Breakpoint): any => {
  const resolved: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (isResponsiveObject(value)) {
        resolved[key] = value[breakpoint] ?? value.desktop ?? value.tablet ?? value.mobile;
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = resolveTokens(value, breakpoint);
      } else {
        resolved[key] = value;
      }
    }
  }
  return resolved;
};

// --- GLOBAL STYLES & THEME PROVIDER ---

const GlobalStyles = () => {
    const { theme } = useTheme();
    const globalCss = `
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #root { 
        height: 100%; 
        margin: 0; 
        padding: 0; 
        font-family: ${theme.Type.Readable.Body.M.fontFamily}; 
        -webkit-font-smoothing: antialiased; 
        -moz-osx-font-smoothing: grayscale; 
        text-rendering: optimizeLegibility; 
      }
      body { 
        transition: background-color ${time['Time.3x']} ease;
      }
      /* Custom Scrollbar for Webkit */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${theme.Color.Base.Surface[3]}; borderRadius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: ${theme.Color.Base.Content[3]}; }
    `;
    return <style>{globalCss}</style>;
};

type Resolved<T> = T extends { mobile: any } | { tablet: any } | { desktop: any }
  ? T[keyof T]
  : T extends object
  ? { [P in keyof T]: Resolved<T[P]> }
  : T;

type ResolvedRawTheme = Resolved<typeof rawTheme>;


type ThemeName = 'light' | 'dark';
type ThemeContextType = {
  themeName: ThemeName;
  setThemeName: (themeName: ThemeName) => void;
  theme: typeof lightThemeColors & ResolvedRawTheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [themeName, setThemeName] = useState<ThemeName>('light'); // Default to light for doc style
  const breakpoint = useBreakpoint();

  const smartTheme = useMemo(() => {
    const colorTheme = themes[themeName];
    const resolvedRawTheme = resolveTokens(rawTheme, breakpoint);
    return { ...colorTheme, ...resolvedRawTheme };
  }, [themeName, breakpoint]);

  const value = {
    themeName,
    setThemeName,
    theme: smartTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <GlobalStyles />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
