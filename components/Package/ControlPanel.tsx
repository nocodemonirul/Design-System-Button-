/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { type MotionValue } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import { MetaButtonProps } from '../../types/index.tsx';
import Input from '../Core/Input.tsx';
import Select from '../Core/Select.tsx';
import RangeSlider from '../Core/RangeSlider.tsx';
import Toggle from '../Core/Toggle.tsx';

interface ControlPanelProps {
  btnProps: MetaButtonProps;
  onPropChange: (keyOrObj: string | Partial<MetaButtonProps>, value?: any) => void;
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
  showTokens: boolean;
  onToggleTokens: () => void;
  // 3D View Props
  view3D: boolean;
  onToggleView3D: () => void;
  layerSpacing: MotionValue<number>;
  viewRotateX: MotionValue<number>;
  viewRotateZ: MotionValue<number>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  btnProps, 
  onPropChange, 
  showMeasurements, 
  onToggleMeasurements, 
  showTokens,
  onToggleTokens,
  view3D,
  onToggleView3D,
  layerSpacing,
  viewRotateX,
  viewRotateZ
}) => {
  const { theme } = useTheme();

  // Helper to determine current interaction state
  const currentInteraction = btnProps.disabled ? 'disabled' 
    : btnProps.forcedActive ? 'active'
    : btnProps.forcedFocus ? 'focus'
    : btnProps.forcedHover ? 'hover'
    : 'default';

  const handleInteractionChange = (e: any) => {
    const val = e.target.value;
    const updates: Partial<MetaButtonProps> = {
      disabled: false,
      forcedHover: false,
      forcedFocus: false,
      forcedActive: false,
    };
    if (val !== 'default') {
        if (val === 'disabled') updates.disabled = true;
        else if (val === 'hover') updates.forcedHover = true;
        else if (val === 'focus') updates.forcedFocus = true;
        else if (val === 'active') updates.forcedActive = true;
    }
    onPropChange(updates);
  };

  return (
    <>
      <div style={{ marginBottom: theme.spacing['Space.L'] }}>
        <h4 style={{ ...theme.Type.Readable.Title.S, margin: 0, marginBottom: '4px' }}>Properties</h4>
        <p style={{ ...theme.Type.Readable.Body.S, margin: 0, color: theme.Color.Base.Content[2] }}>Core attributes of the component.</p>
      </div>

      <Input
        label="Label"
        value={btnProps.label}
        onChange={(e) => onPropChange('label', e.target.value)}
      />

      <div style={{ display: 'flex', gap: theme.spacing['Space.M'], marginTop: theme.spacing['Space.L'] }}>
        <div style={{ flex: 1 }}>
          <Select
            label="Type"
            value={btnProps.type}
            onChange={(e) => onPropChange('type', e.target.value)}
            options={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'tertiary', label: 'Tertiary' },
              { value: 'success', label: 'Success' },
              { value: 'fail', label: 'Fail' },
            ]}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select
            label="Size"
            value={btnProps.size}
            onChange={(e) => onPropChange('size', e.target.value)}
            options={[
              { value: 'xl', label: 'XL (56px)' },
              { value: 'l', label: 'L (48px)' },
              { value: 'm', label: 'M (40px)' },
              { value: 's', label: 'S (32px)' },
              { value: 'xs', label: 'XS (28px)' },
            ]}
          />
        </div>
      </div>

      <div style={{ marginTop: theme.spacing['Space.L'] }}>
         <Select
            label="Radius"
            value={btnProps.radius}
            onChange={(e) => onPropChange('radius', e.target.value)}
            options={[
                { value: 'Sharp', label: 'Sharp (0px)' },
                { value: '4px', label: 'Small (4px)' },
                { value: '8px', label: 'Medium (8px)' },
                { value: '16px', label: 'Large (16px)' },
                { value: 'Pill', label: 'Pill (Full)' },
            ]}
          />
      </div>

      <div style={{ marginTop: theme.spacing['Space.L'] }}>
          <Select
            label="Icon Placement"
            value={btnProps.iconPlacement}
            onChange={(e) => onPropChange('iconPlacement', e.target.value)}
            options={[
                { value: 'none', label: 'None' },
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
                { value: 'iconOnly', label: 'Icon Only' },
            ]}
          />
      </div>

      <div style={{ marginTop: theme.spacing['Space.L'] }}>
          <Select
            label="Icon"
            value={btnProps.icon || ''}
            onChange={(e) => onPropChange('icon', e.target.value)}
            options={[
                { value: 'ph-check', label: 'Check' },
                { value: 'ph-arrow-right', label: 'Arrow Right' },
                { value: 'ph-plus', label: 'Plus' },
                { value: 'ph-trash', label: 'Trash' },
                { value: 'ph-envelope', label: 'Mail' },
                { value: 'ph-magnifying-glass', label: 'Search' },
                { value: 'ph-x', label: 'X' },
            ]}
          />
      </div>

      <div style={{ borderTop: `1px solid ${theme.Color.Base.Surface[3]}`, margin: `${theme.spacing['Space.L']} 0` }} />
      
      {/* --- FORCED STATES --- */}
      <div style={{ width: '100%' }}>
            <Select 
                label="State"
                value={currentInteraction}
                onChange={handleInteractionChange}
                options={[
                    { value: 'default', label: 'Default' },
                    { value: 'hover', label: 'Hover' },
                    { value: 'focus', label: 'Focus' },
                    { value: 'active', label: 'Active' },
                    { value: 'disabled', label: 'Disabled' },
                ]}
            />
      </div>

      <div style={{ borderTop: `1px solid ${theme.Color.Base.Surface[3]}`, margin: `${theme.spacing['Space.L']} 0` }} />
      
      {/* --- INSPECTION TOOLS --- */}
      <label style={{ ...theme.Type.Readable.Label.S, display: 'block', marginBottom: theme.spacing['Space.M'], color: theme.Color.Base.Content[2], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Inspector
      </label>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['Space.M'] }}>
        <Toggle
          label="Blueprint Mode"
          isOn={showMeasurements}
          onToggle={onToggleMeasurements}
        />
        <Toggle
          label="Token View"
          isOn={showTokens}
          onToggle={onToggleTokens}
        />
        <Toggle
          label="3D Layers"
          isOn={view3D}
          onToggle={onToggleView3D}
        />
        
        {view3D && (
          <div style={{ 
            marginTop: theme.spacing['Space.S'], 
            padding: theme.spacing['Space.M'], 
            backgroundColor: theme.Color.Base.Surface[2], 
            borderRadius: theme.radius['Radius.M'],
            border: `1px solid ${theme.Color.Base.Surface[3]}`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing['Space.M']
          }}>
             <RangeSlider
              label="Layer Spacing"
              motionValue={layerSpacing}
              onCommit={() => {}}
              min={0}
              max={150}
            />
            <RangeSlider
              label="Rotate X"
              motionValue={viewRotateX}
              onCommit={() => {}}
              min={0}
              max={90}
            />
            <RangeSlider
              label="Rotate Z"
              motionValue={viewRotateZ}
              onCommit={() => {}}
              min={0}
              max={360}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ControlPanel;