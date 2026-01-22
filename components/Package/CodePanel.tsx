/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import TextArea from '../Core/TextArea.tsx';
import { MetaButtonProps } from '../../types/index.tsx';

interface CodePanelProps {
  codeText: string;
  onCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCopyCode: () => void;
  onFocus: () => void;
  onBlur: () => void;
  btnProps: MetaButtonProps;
}

const CodePanel: React.FC<CodePanelProps> = ({ codeText, onCodeChange, onCopyCode, onFocus, onBlur, btnProps }) => {
  const { theme, themeName } = useTheme();
  const [mode, setMode] = useState<'json' | 'framer'>('json');

  // Helper to resolve current colors for defaults
  const getResolvedColors = () => {
    const isDark = themeName === 'dark';
    const type = btnProps.type;
    
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

  const resolvedColors = getResolvedColors();
  
  // Helper to resolve font size based on size prop
  const getFontSize = () => {
      const sizes: Record<string, string> = { xl: '20px', l: '16px', m: '16px', s: '14px', xs: '14px' };
      return sizes[btnProps.size] || '16px';
  };

  const generateFramerCode = () => {
    return `import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

/**
 * SUS Button
 * @framerSupported
 */
export default function SusButton(props) {
  const { 
    label, 
    size, 
    radius, 
    iconPlacement,
    iconType,
    iconName,
    customIcon,
    disabled, 
    onTap,
    // Visual Props
    backgroundColor,
    textColor,
    borderColor,
    hoverColor,
    // Typography Props
    fontFamily,
    fontWeight,
    fontSize
  } = props

  // --- Inject Phosphor Icons Script ---
  // This ensures icons show up in the Framer Canvas without external setup
  React.useEffect(() => {
    if (iconType === "phosphor") {
        const scriptId = "phosphor-icons-script"
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script")
            script.id = scriptId
            script.src = "https://unpkg.com/@phosphor-icons/web"
            script.async = true
            document.head.appendChild(script)
        }
    }
  }, [iconType])

  // Radius Map
  const radiusMap = {
    Sharp: "0px",
    "4px": "4px",
    "8px": "8px",
    "16px": "16px",
    Pill: "9999px"
  }
  
  // Size Map (Padding & Gap only, fontSize handled by prop)
  const sizes = {
    xl: { padding: "16px 32px", height: "56px", gap: "12px" },
    l: { padding: "12px 24px", height: "48px", gap: "8px" },
    m: { padding: "10px 20px", height: "40px", gap: "8px" },
    s: { padding: "8px 16px", height: "32px", gap: "6px" },
    xs: { padding: "6px 12px", height: "28px", gap: "4px" }
  }
  
  const currentSize = sizes[size] || sizes.m
  const currentRadius = radiusMap[radius] || "8px"

  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: currentSize.gap,
    background: backgroundColor,
    color: textColor,
    border: borderColor !== "transparent" ? \`1px solid \${borderColor}\` : "none",
    borderRadius: currentRadius,
    padding: currentSize.padding,
    height: currentSize.height,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  }

  // --- Icon Logic ---
  let iconNode = null

  if (iconType === "phosphor" && iconName) {
      // Auto-prefix 'ph-' if missing to allow simple names like 'check'
      const className = iconName.startsWith("ph-") ? \`ph-bold \${iconName}\` : \`ph-bold ph-\${iconName}\`
      iconNode = <i className={className} style={{ fontSize: "1.2em", lineHeight: 1 }} />
  } else if (iconType === "custom" && customIcon) {
      iconNode = (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em", lineHeight: 1 }}>
            {customIcon}
        </div>
      )
  }

  return (
    <motion.button
      style={style}
      whileHover={!disabled ? { backgroundColor: hoverColor } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onTap}
    >
      {(iconPlacement === "left" || iconPlacement === "iconOnly") && iconNode}
      {iconPlacement !== "iconOnly" && <span>{label}</span>}
      {iconPlacement === "right" && iconNode}
    </motion.button>
  )
}

addPropertyControls(SusButton, {
  // Content
  label: { 
    type: ControlType.String, 
    defaultValue: "${btnProps.label}",
    title: "Label"
  },
  
  // Icon Configuration
  iconPlacement: {
    type: ControlType.Enum,
    options: ["none", "left", "right", "iconOnly"],
    defaultValue: "${btnProps.iconPlacement}",
    title: "Icon Align"
  },
  iconType: {
    type: ControlType.Enum,
    options: ["phosphor", "custom"],
    defaultValue: "phosphor",
    title: "Icon Source",
    hidden: (props) => props.iconPlacement === "none"
  },
  iconName: {
    type: ControlType.String,
    defaultValue: "${btnProps.icon.replace('ph-', '')}",
    title: "Icon Name",
    placeholder: "check, heart, user...",
    hidden: (props) => props.iconPlacement === "none" || props.iconType === "custom",
    description: "Type any Phosphor Icon name (e.g. 'check', 'arrow-right')"
  },
  customIcon: {
    type: ControlType.ComponentInstance,
    title: "Custom Icon",
    hidden: (props) => props.iconPlacement === "none" || props.iconType === "phosphor"
  },
  
  // Layout
  size: {
    type: ControlType.Enum,
    options: ["xl", "l", "m", "s", "xs"],
    defaultValue: "${btnProps.size}",
    title: "Size"
  },
  radius: {
    type: ControlType.Enum,
    options: ["Sharp", "4px", "8px", "16px", "Pill"],
    defaultValue: "${btnProps.radius}",
    title: "Radius"
  },

  // Colors
  backgroundColor: {
    type: ControlType.Color,
    defaultValue: "${resolvedColors.bg}",
    title: "Background"
  },
  textColor: {
    type: ControlType.Color,
    defaultValue: "${resolvedColors.text}",
    title: "Text"
  },
  borderColor: {
    type: ControlType.Color,
    defaultValue: "${resolvedColors.border}",
    title: "Border"
  },
  hoverColor: {
    type: ControlType.Color,
    defaultValue: "${resolvedColors.hover}",
    title: "Hover Fill"
  },

  // Typography
  fontFamily: {
    type: ControlType.String,
    defaultValue: "Inter, sans-serif",
    title: "Font Family"
  },
  fontWeight: {
    type: ControlType.Number,
    defaultValue: 500,
    min: 100,
    max: 900,
    step: 100,
    title: "Weight"
  },
  fontSize: {
    type: ControlType.String,
    defaultValue: "${getFontSize()}",
    title: "Font Size"
  },

  // Interaction
  disabled: { 
    type: ControlType.Boolean, 
    defaultValue: ${btnProps.disabled},
    title: "Disabled"
  },
  onTap: { 
    type: ControlType.EventHandler 
  }
})`;
  };

  const generateUsage = () => {
      let code = `<Button\n  theme="${themeName}"\n  type="${btnProps.type}"\n  size="${btnProps.size}"`;
      
      if (btnProps.radius !== '8px') {
          code += `\n  radius="${btnProps.radius}"`;
      }
      
      if (btnProps.label && btnProps.iconPlacement !== 'iconOnly') {
          code += `\n  label="${btnProps.label}"`;
      }

      if (btnProps.iconPlacement !== 'none') {
          code += `\n  iconPlacement="${btnProps.iconPlacement}"`;
          if (btnProps.iconPlacement === 'left') code += `\n  leftIcon={<Icon name="${btnProps.icon}" />}`;
          if (btnProps.iconPlacement === 'right') code += `\n  rightIcon={<Icon name="${btnProps.icon}" />}`;
          if (btnProps.iconPlacement === 'iconOnly') code += `\n  leftIcon={<Icon name="${btnProps.icon}" />}`;
      }

      if (btnProps.disabled) code += `\n  disabled`;

      code += `\n/>`;
      return code;
  };

  const currentCode = mode === 'json' ? codeText : generateFramerCode();

  const handleCopy = () => {
    if (mode === 'json') {
      onCopyCode();
    } else {
      navigator.clipboard.writeText(currentCode);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: theme.spacing['Space.S'] }}>
         <button
            onClick={() => setMode('json')}
            style={{
                background: mode === 'json' ? theme.Color.Base.Surface[3] : 'transparent',
                color: mode === 'json' ? theme.Color.Base.Content[1] : theme.Color.Base.Content[2],
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.Type.Expressive.Data.fontFamily
            }}
         >
            JSON CONFIG
         </button>
         <button
            onClick={() => setMode('framer')}
            style={{
                background: mode === 'framer' ? theme.Color.Base.Surface[3] : 'transparent',
                color: mode === 'framer' ? theme.Color.Base.Content[1] : theme.Color.Base.Content[2],
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.Type.Expressive.Data.fontFamily
            }}
         >
            FRAMER COMPONENT
         </button>
      </div>

      <div style={{ position: 'relative' }}>
        <TextArea 
            value={currentCode} 
            onChange={onCodeChange} 
            onFocus={onFocus} 
            onBlur={onBlur}
            readOnly={mode === 'framer'}
        />
        <motion.button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: theme.spacing['Space.S'],
            right: theme.spacing['Space.S'],
            background: theme.Color.Base.Surface[1],
            border: `1px solid ${theme.Color.Base.Surface[3]}`,
            borderRadius: theme.radius['Radius.S'],
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.Color.Base.Content[1],
          }}
          whileHover={{ scale: 1.1, backgroundColor: theme.Color.Accent.Surface[1], color: theme.Color.Accent.Content[1] }}
          whileTap={{ scale: 0.9 }}
          aria-label={mode === 'json' ? "Copy JSON" : "Copy Code"}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <i className="ph-bold ph-copy" style={{ fontSize: '14px' }} />
        </motion.button>
      </div>
      
      {mode === 'json' && (
        <div style={{ marginTop: theme.spacing['Space.L'] }}>
            <p style={{ ...theme.Type.Readable.Label.S, color: theme.Color.Base.Content[2], marginBottom: theme.spacing['Space.S'] }}>REACT COMPONENT</p>
            <pre style={{ ...theme.Type.Expressive.Data, fontSize: '11px', color: theme.Color.Base.Content[2], backgroundColor: 'transparent', padding: 0, margin: 0, whiteSpace: 'pre-wrap' }}>
            {generateUsage()}
            </pre>
        </div>
      )}
    </>
  );
};

export default CodePanel;