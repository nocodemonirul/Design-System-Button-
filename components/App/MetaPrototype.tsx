/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import ThemeToggleButton from '../Core/ThemeToggleButton.tsx';
import FloatingWindow from '../Package/FloatingWindow.tsx';
import Dock from '../Section/Dock.tsx';
import Stage from '../Section/Stage.tsx';
import ControlPanel from '../Package/ControlPanel.tsx';
import CodePanel from '../Package/CodePanel.tsx';
import ConsolePanel from '../Package/ConsolePanel.tsx';
import UndoRedo from '../Package/UndoRedo.tsx';
import Confetti from '../Core/Confetti.tsx';
import { WindowId, WindowState, LogEntry, MetaButtonProps } from '../../types/index.tsx';

/**
 * 🏎️ Meta Prototype App (SUS System Edition)
 * Acts as the main state orchestrator for the application.
 */
const MetaPrototype = () => {
  const { theme } = useTheme();
  
  // -- App State --
  const [btnProps, setBtnProps] = useState<MetaButtonProps>({
    label: 'SusButton',
    type: 'primary',
    size: 'm',
    radius: '8px',
    iconPlacement: 'left',
    icon: 'ph-check',
    disabled: false,
    forcedHover: false,
    forcedFocus: false,
    forcedActive: false,
  });
  
  // -- View / Inspection State --
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  
  // 3D Layer View State
  const [view3D, setView3D] = useState(false);
  const layerSpacing = useMotionValue(0);
  const viewRotateX = useMotionValue(55);
  const viewRotateZ = useMotionValue(45);

  // -- Confetti State --
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Auto-expand layers when entering 3D mode
  useEffect(() => {
    if (view3D) {
      layerSpacing.set(40);
    } else {
      layerSpacing.set(0);
    }
  }, [view3D, layerSpacing]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // -- History State --
  const [history, setHistory] = useState<MetaButtonProps[]>([]);
  const [future, setFuture] = useState<MetaButtonProps[]>([]);

  // --- Window Management ---
  const WINDOW_WIDTH = 400;
  const CONTROL_PANEL_HEIGHT = 680; 
  const CODE_PANEL_HEIGHT = 420;
  const CONSOLE_PANEL_HEIGHT = 200;

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    control: { id: 'control', title: 'Control', isOpen: true, zIndex: 1, x: -WINDOW_WIDTH / 2 - 220, y: -CONTROL_PANEL_HEIGHT / 2 },
    code: { id: 'code', title: 'Code I/O', isOpen: false, zIndex: 2, x: -WINDOW_WIDTH / 2 + 220, y: -CODE_PANEL_HEIGHT / 2 },
    console: { id: 'console', title: 'Console', isOpen: false, zIndex: 3, x: -WINDOW_WIDTH / 2, y: 150 },
  });

  // -- Code Editor State --
  const [codeText, setCodeText] = useState('');
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  
  useEffect(() => {
    if (!isCodeFocused) {
      setCodeText(JSON.stringify(btnProps, null, 2));
    }
  }, [btnProps, isCodeFocused]);

  // -- Actions --

  const logEvent = (msg: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message: msg,
    };
    setLogs(prev => [...prev, entry].slice(-50));
  };
  
  useEffect(() => {
      logEvent('System Ready. SUS Design System initialized.');
  }, []);

  const updateBtnProps = (newProps: MetaButtonProps, saveHistory: boolean = true) => {
    if (saveHistory) {
      setHistory(prev => [...prev, btnProps]);
      setFuture([]);
    }
    setBtnProps(newProps);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setFuture(prev => [btnProps, ...prev]);
    setBtnProps(previous);
    setHistory(newHistory);
    logEvent('Undo performed');
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory(prev => [...prev, btnProps]);
    setBtnProps(next);
    setFuture(newFuture);
    logEvent('Redo performed');
  };

  const bringToFront = (id: WindowId) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex));
      if (prev[id].zIndex === maxZ) return prev;
      return { ...prev, [id]: { ...prev[id], zIndex: maxZ + 1 } };
    });
  };

  const toggleWindow = (id: WindowId) => {
    setWindows(prev => {
      const isOpen = !prev[id].isOpen;
      const next = { ...prev, [id]: { ...prev[id], isOpen } };
      if (isOpen) {
        const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex));
        next[id].zIndex = maxZ + 1;
      }
      return next;
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(btnProps, null, 2));
    logEvent('JSON copied to clipboard');
  };
  
  const handlePropChange = (keyOrObj: string | Partial<MetaButtonProps>, value?: any) => {
    if (typeof keyOrObj === 'string') {
        updateBtnProps({ ...btnProps, [keyOrObj]: value });
        logEvent(`Prop updated: ${keyOrObj} = ${value}`);
    } else {
        updateBtnProps({ ...btnProps, ...keyOrObj });
        logEvent(`State updated: ${Object.keys(keyOrObj).join(', ')}`);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setCodeText(newVal);
    try {
      const parsed = JSON.parse(newVal);
      updateBtnProps(parsed, true);
    } catch (err) {
      // Invalid JSON
    }
  };

  const handleToggleMeasurements = () => {
    setShowMeasurements(prev => !prev);
    if (showTokens) setShowTokens(false);
    logEvent(`Measurements toggled: ${!showMeasurements ? 'On' : 'Off'}`);
  };

  const handleToggleTokens = () => {
    setShowTokens(prev => !prev);
    if (showMeasurements) setShowMeasurements(false);
    logEvent(`Tokens toggled: ${!showTokens ? 'On' : 'Off'}`);
  };
  
  const handleStageButtonClick = () => {
    logEvent('Button Clicked!');
    setConfettiTrigger(prev => prev + 1);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.Color.Base.Surface[1],
      backgroundImage: `radial-gradient(${theme.Color.Base.Content[3]}33 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ThemeToggleButton />
      <Confetti trigger={confettiTrigger} />

      <Stage
        btnProps={btnProps}
        onButtonClick={handleStageButtonClick}
        showMeasurements={showMeasurements}
        showTokens={showTokens}
        view3D={view3D}
        viewRotateX={viewRotateX}
        viewRotateZ={viewRotateZ}
        layerSpacing={layerSpacing}
      />

      {/* --- WINDOWS --- */}
      <AnimatePresence>
        {windows.control.isOpen && (
          <FloatingWindow
            key="control"
            {...windows.control}
            onClose={() => toggleWindow('control')}
            onFocus={() => bringToFront('control')}
            footer={<UndoRedo onUndo={handleUndo} onRedo={handleRedo} canUndo={history.length > 0} canRedo={future.length > 0} />}
          >
            <ControlPanel
                btnProps={btnProps}
                onPropChange={handlePropChange}
                showMeasurements={showMeasurements}
                onToggleMeasurements={handleToggleMeasurements}
                showTokens={showTokens}
                onToggleTokens={handleToggleTokens}
                view3D={view3D}
                onToggleView3D={() => setView3D(!view3D)}
                layerSpacing={layerSpacing}
                viewRotateX={viewRotateX}
                viewRotateZ={viewRotateZ}
            />
          </FloatingWindow>
        )}

        {windows.code.isOpen && (
          <FloatingWindow
            key="code"
            {...windows.code}
            onClose={() => toggleWindow('code')}
            onFocus={() => bringToFront('code')}
          >
            <CodePanel
              codeText={codeText}
              onCodeChange={handleCodeChange}
              onCopyCode={handleCopyCode}
              onFocus={() => setIsCodeFocused(true)}
              onBlur={() => setIsCodeFocused(false)}
              btnProps={btnProps}
            />
          </FloatingWindow>
        )}

        {windows.console.isOpen && (
          <FloatingWindow
            key="console"
            {...windows.console}
            onClose={() => toggleWindow('console')}
            onFocus={() => bringToFront('console')}
          >
            <ConsolePanel logs={logs} />
          </FloatingWindow>
        )}
      </AnimatePresence>

      <Dock windows={windows} toggleWindow={toggleWindow} />
    </div>
  );
};

export default MetaPrototype;