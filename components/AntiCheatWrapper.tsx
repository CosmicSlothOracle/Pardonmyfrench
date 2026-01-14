import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SecurityIncident } from '../types';

interface AntiCheatProps {
  children: React.ReactNode;
  isActive: boolean;
  onIncident?: (incident: SecurityIncident) => void;
}

export const AntiCheatWrapper: React.FC<AntiCheatProps> = ({ children, isActive, onIncident }) => {
  const [blur, setBlur] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const focusLossCount = useRef(0);
  const mouseLeaveTimeout = useRef<any>(null);
  const devToolsOpen = useRef(false);

  const logIncident = useCallback((type: SecurityIncident['type'], details: string) => {
    if (onIncident) {
      onIncident({
        timestamp: Date.now(),
        type,
        details
      });
    }
  }, [onIncident]);

  useEffect(() => {
    if (!isActive) {
      setBlur(false);
      focusLossCount.current = 0;
      return;
    }

    // Apply CSS protection
    document.body.style.userSelect = 'none';
    (document.body.style as any).webkitUserSelect = 'none';

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      const warningMsg = "Copying is disabled for this test.";
      setWarning(warningMsg);
      logIncident('copy_attempt', warningMsg);
      setTimeout(() => setWarning(null), 3000);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const warningMsg = "Pasting is disabled.";
      setWarning(warningMsg);
      logIncident('paste_attempt', warningMsg);
      setTimeout(() => setWarning(null), 3000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logIncident('suspicious_shortcut', 'Right-click context menu attempted');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlur(true);
        focusLossCount.current++;
        const warningMsg = `Window focus lost (${focusLossCount.current} time${focusLossCount.current > 1 ? 's' : ''})`;
        logIncident('focus_lost', warningMsg);
      } else {
        setBlur(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block print screen and common shortcuts
      if (e.key === 'PrintScreen' || (e.shiftKey && e.key === 'F12')) {
        e.preventDefault();
        const warningMsg = "Screenshot attempt detected.";
        setWarning(warningMsg);
        logIncident('screenshot_attempt', warningMsg);
        setTimeout(() => setWarning(null), 3000);
        return;
      }

      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'U')
      ) {
        e.preventDefault();
        const warningMsg = "Developer tools are disabled.";
        setWarning(warningMsg);
        logIncident('devtools', warningMsg);
        devToolsOpen.current = true;
        setTimeout(() => setWarning(null), 3000);
        return;
      }

      // Block copy/paste shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        const warningMsg = "Keyboard shortcuts are disabled.";
        setWarning(warningMsg);
        logIncident('suspicious_shortcut', `Blocked ${e.key.toUpperCase()} shortcut`);
        setTimeout(() => setWarning(null), 2000);
        return;
      }

      // Block save shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        const warningMsg = "Save/Print shortcuts are disabled.";
        setWarning(warningMsg);
        logIncident('suspicious_shortcut', `Blocked ${e.key.toUpperCase()} shortcut`);
        setTimeout(() => setWarning(null), 2000);
      }
    };

    // Detect DevTools opening via console detection
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen.current) {
          devToolsOpen.current = true;
          const warningMsg = "Developer tools detected.";
          setWarning(warningMsg);
          logIncident('devtools', warningMsg);
          setTimeout(() => setWarning(null), 3000);
        }
      } else {
        devToolsOpen.current = false;
      }
    };

    // Monitor for DevTools
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Mouse leave detection for auto-blur
    const handleMouseLeave = () => {
      if (mouseLeaveTimeout.current) {
        clearTimeout(mouseLeaveTimeout.current);
      }
      mouseLeaveTimeout.current = setTimeout(() => {
        if (document.activeElement === document.body) {
          setBlur(true);
        }
      }, 2000);
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimeout.current) {
        clearTimeout(mouseLeaveTimeout.current);
        mouseLeaveTimeout.current = null;
      }
      if (!document.hidden) {
        setBlur(false);
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(devToolsInterval);
      if (mouseLeaveTimeout.current) {
        clearTimeout(mouseLeaveTimeout.current);
      }
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
    };
  }, [isActive, logIncident]);

  return (
    <div className="relative min-h-screen anti-cheat-protected">
      {/* Multiple layered watermarks for screenshot protection */}
      <div className="watermark text-gray-200 pointer-events-none select-none">
        PARDON MY FRENCH
      </div>
      <div className="watermark text-gray-200 pointer-events-none select-none" style={{
        transform: 'translate(-50%, -50%) rotate(45deg)',
        fontSize: '4rem',
        opacity: 0.02
      }}>
        SECURE EXAM
      </div>

      {/* Floating transparent overlay to deter screenshots */}
      {isActive && (
        <div
          className="fixed inset-0 pointer-events-none select-none z-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)',
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {warning && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl font-bold animate-bounce">
          <i className="fas fa-exclamation-triangle mr-2"></i> {warning}
        </div>
      )}

      {blur && isActive && (
        <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-lg flex items-center justify-center flex-col">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Test Paused</h2>
          <p className="text-xl text-gray-700 mb-2">Please return to the window to continue.</p>
          {focusLossCount.current > 1 && (
            <p className="text-sm text-red-500 font-semibold">
              Warning: Focus lost {focusLossCount.current} times
            </p>
          )}
        </div>
      )}

      <div className={`transition-all duration-300 ${blur && isActive ? 'blur-lg opacity-50' : ''}`}>
        {children}
      </div>
    </div>
  );
};