import { useState, useEffect } from 'react';
import { Database, AlertTriangle, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { ErrorLog } from './ErrorLog';
import { Settings } from './Settings';
import { useUserPreferences } from '../store/userPreferences';
import { logger } from '../utils/logger';

interface HeaderProps {
  onToggleTheme: () => void;
}

export function Header({ onToggleTheme }: HeaderProps) {
  const [showErrorLog, setShowErrorLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDark, showLogs } = useUserPreferences();
  const [errorCount, setErrorCount] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const errors = logger.getErrorLogs();
      const all = logger.getLogs();
      setErrorCount(errors.length);
      setTotalLogs(all.length);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">NX Content Tracker</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {showLogs && totalLogs > 0 && (
            <button
              onClick={() => setShowErrorLog(true)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                ${errorCount > 0 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                }
              `}
              title={`${totalLogs} total log${totalLogs !== 1 ? 's' : ''}${
                errorCount > 0 ? `, including ${errorCount} error${errorCount !== 1 ? 's' : ''}` : ''
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">View Logs {errorCount > 0 ? `(${errorCount})` : ''}</span>
              <span className="sm:hidden">{errorCount > 0 ? errorCount : totalLogs}</span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <a
            href="https://github.com/ghost-land/NX-Content"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {showErrorLog && <ErrorLog onClose={() => setShowErrorLog(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </header>
  );
}