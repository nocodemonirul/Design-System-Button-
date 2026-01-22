/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import Button from '../Core/Button.tsx';
import { useTheme } from '../../Theme.tsx';

interface UndoRedoProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedo: React.FC<UndoRedoProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: theme.spacing['Space.S'],
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Button
        label="Undo"
        icon="ph-arrow-u-up-left"
        iconPlacement="iconOnly"
        size="s"
        type="ghost"
        disabled={!canUndo}
        onClick={onUndo}
      />
      <Button
        label="Redo"
        icon="ph-arrow-u-up-right"
        iconPlacement="iconOnly"
        size="s"
        type="ghost"
        disabled={!canRedo}
        onClick={onRedo}
      />
    </div>
  );
};

export default UndoRedo;