/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Window Management ---
export type WindowId = 'control' | 'code' | 'console';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  zIndex: number;
  x: number;
  y: number;
}

// --- Console Logging ---
export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

// --- Button Props for SUS Design System ---
export type SusButtonType = 'primary' | 'secondary' | 'tertiary' | 'success' | 'fail' | 'ghost';
export type SusButtonSize = 'xl' | 'l' | 'm' | 's' | 'xs';
export type SusButtonRadius = 'Sharp' | '4px' | '8px' | '16px' | 'Pill';
export type SusButtonIconPlacement = 'none' | 'left' | 'right' | 'iconOnly';

export interface MetaButtonProps {
    label: string;
    type: SusButtonType;
    size: SusButtonSize;
    radius: SusButtonRadius;
    iconPlacement: SusButtonIconPlacement;
    icon: string; // Icon name (Phosphor)
    // States
    disabled: boolean;
    forcedHover: boolean;
    forcedFocus: boolean;
    forcedActive: boolean;
    // Legacy props (kept for potential override logic, but primarily unused in new system)
    customFill?: string;
    customColor?: string;
    customRadius?: string;
}