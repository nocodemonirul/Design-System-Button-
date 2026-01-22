/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useTheme } from '../../Theme.tsx';
import { motion } from 'framer-motion';
import { SusButtonType, SusButtonSize, SusButtonIconPlacement, SusButtonRadius } from '../../types/index.tsx';
import StateLayer from './StateLayer.tsx';
import RippleLayer, { Ripple } from './RippleLayer.tsx';

// --- SUS SYSTEM CONSTANTS ---
const SIZES: Record<string, { fontSize: string; lineHeight: string; padding: string; height: string; gap: string }> = {
    xl: { fontSize: '20px', lineHeight: '24px', padding: '16px 32px', height: '56px', gap: '12px' },
    l: { fontSize: '16px', lineHeight: '20px', padding: '12px 24px', height: '48px', gap: '8px' },
    m: { fontSize: '16px', lineHeight: '20px', padding: '10px 20px', height: '40px', gap: '8px' },
    s: { fontSize: '14px', lineHeight: '18px', padding: '8px 16px', height: '32px', gap: '6px' },
    xs: { fontSize: '14px', lineHeight: '18px', padding: '6px 12px', height: '28px', gap: '4px' },
};

interface ButtonProps {
  label: string;
  type?: SusButtonType;
  size?: SusButtonSize;
  radius?: SusButtonRadius;
  iconPlacement?: SusButtonIconPlacement;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  // 3D/Interactive Props
  layerSpacing?: any; 
  view3D?: boolean;
  forcedHover?: boolean;
  forcedFocus?: boolean;
  forcedActive?: boolean;
  // Legacy support
  customRadius?: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  label,
  type = 'primary',
  size = 'm',
  radius = '8px',
  iconPlacement = 'none',
  icon,
  disabled = false,
  onClick,
  layerSpacing,
  view3D = false,
  forcedHover = false,
  forcedFocus = false,
  forcedActive = false,
  customRadius,
}, ref) => {
  const { theme, themeName } = useTheme();
  
  // Interaction State
  const [isHovered, setIsHovered] = useState(false);
  const effectiveHover = forcedHover || isHovered;
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Helper for coordinates
  const getCoords = (e: React.PointerEvent | React.MouseEvent) => {
    const buttonEl = e.currentTarget as HTMLButtonElement;
    const rect = buttonEl.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  // Handlers
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (disabled) return;
    const { width, height } = getCoords(e);
    setDimensions({ width, height });
    setIsHovered(true);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled) return;
    const { x, y } = getCoords(e);
    setCoords({ x, y });
  };
  const handlePointerLeave = () => setIsHovered(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const { x, y, width, height } = getCoords(e);
    setCoords({ x, y });
    setDimensions({ width, height });
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    let { x, y, width, height } = getCoords(e);
    if (e.detail === 0) { x = width / 2; y = height / 2; } // Keyboard
    setRipples(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);
    if (onClick) onClick();
  };
  const handleRippleComplete = (id: number) => setRipples(prev => prev.filter(r => r.id !== id));

  // --- THEME MAPPING ---
  // Mapping standard SUS themes to our Theme.tsx tokens
  const getThemeStyles = () => {
    const isDark = themeName === 'dark';
    
    // Explicit color mapping based on SUS Design System Spec provided
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      primary: {
        bg: isDark ? '#FFFFFF' : '#0F172A',
        text: isDark ? '#0F172A' : '#FFFFFF',
        border: 'transparent',
        hover: isDark ? '#E2E8F0' : '#334155',
      },
      secondary: {
        bg: isDark ? '#334155' : '#F1F5F9',
        text: isDark ? '#FFFFFF' : '#0F172A',
        border: 'transparent',
        hover: isDark ? '#475569' : '#E2E8F0',
      },
      tertiary: {
        bg: 'transparent',
        text: isDark ? '#FFFFFF' : '#0F172A',
        border: isDark ? '#475569' : '#CBD5E1',
        hover: isDark ? '#1E293B' : '#F8FAFC',
      },
      ghost: {
        bg: 'transparent',
        text: isDark ? '#FFFFFF' : '#0F172A',
        border: 'transparent',
        hover: isDark ? '#334155' : '#E2E8F0',
      },
      success: {
        bg: isDark ? '#166534' : '#10B981',
        text: '#FFFFFF',
        border: 'transparent',
        hover: isDark ? '#14532D' : '#059669',
      },
      fail: {
        bg: isDark ? '#991B1B' : '#EF4444',
        text: '#FFFFFF',
        border: 'transparent',
        hover: isDark ? '#7F1D1D' : '#DC2626',
      }
    };

    return colors[type] || colors.primary;
  };

  const variantStyle = getThemeStyles();
  const sizeStyle = SIZES[size] || SIZES.m;

  // Radius Logic
  const radiusMap: Record<string, string> = {
    'Sharp': '0px',
    '4px': '4px',
    '8px': theme.radius['Radius.M'], // 8px from token
    '16px': theme.radius['Radius.XL'], // 16px from token
    'Pill': theme.radius['Radius.Full'],
  };
  const borderRadius = radiusMap[radius] || '8px';

  // Helper to calculate outer focus ring radius (Radius + Padding)
  const getFocusRadius = (r: string) => {
    if (r.includes('9999')) return '9999px';
    const val = parseInt(r);
    return isNaN(val) ? r : `${val + 4}px`;
  };
  const focusRadius = getFocusRadius(borderRadius);

  // Base Container Style
  const styles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    borderRadius: borderRadius,
    outline: 'none',
    border: `1px solid ${variantStyle.border}`,
    backgroundColor: variantStyle.bg, // We use this for the base, updated by Motion later
    color: variantStyle.text,
    padding: sizeStyle.padding,
    height: sizeStyle.height,
    gap: sizeStyle.gap,
    fontSize: sizeStyle.fontSize,
    lineHeight: sizeStyle.lineHeight,
    boxSizing: 'border-box',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transformStyle: 'preserve-3d',
  };

  // Determine Icon
  const iconEl = icon ? <i className={`ph-bold ${icon}`} style={{ fontSize: '1.2em' }} /> : null;
  
  // Layer Logic
  const layerWrapperStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      borderRadius: 'inherit', pointerEvents: 'none', transformStyle: 'preserve-3d',
  };
  
  // Animation States
  const animateState = {
    y: disabled ? 0 : (forcedActive ? 1 : (effectiveHover ? -2 : 0)),
    scale: disabled ? 1 : (forcedActive ? 0.98 : 1),
    backgroundColor: effectiveHover ? variantStyle.hover : variantStyle.bg,
  };

  return (
    <motion.button
      ref={ref}
      style={styles}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      animate={animateState}
      whileTap={!disabled && !forcedActive ? { scale: 0.98, y: 1 } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* --- LAYERS --- */}
      
      {/* 0. Surface */}
      <motion.div style={{ ...layerWrapperStyle, zIndex: 0 }} />

      {/* 1. Focus Ring */}
      <motion.div 
        style={{ ...layerWrapperStyle, zIndex: 1 }}
        animate={{ opacity: forcedFocus ? 1 : 0, scale: forcedFocus ? 1 : 0.95 }}
      >
         <div style={{
             position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
             borderRadius: focusRadius,
             border: `3px solid ${theme.Color.Focus.Content[1]}44`,
         }} />
      </motion.div>

      {/* 2. Ripple Layer (for click burst) */}
      <motion.div style={{ ...layerWrapperStyle, zIndex: 2 }}>
         <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}>
            <RippleLayer
                color={variantStyle.text} // Ripple matches text color usually
                ripples={ripples}
                onRippleComplete={handleRippleComplete}
                width={dimensions.width} 
                height={dimensions.height}
                opacity={0.2}
                forced={forcedActive}
            />
         </div>
      </motion.div>
      
      {/* 3. Content */}
      <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: sizeStyle.gap }}>
        {(iconPlacement === 'left' || iconPlacement === 'iconOnly') && iconEl}
        {iconPlacement !== 'iconOnly' && <span>{label}</span>}
        {iconPlacement === 'right' && iconEl}
      </div>

    </motion.button>
  );
});

export default Button;