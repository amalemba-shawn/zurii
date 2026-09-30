/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FarmOperator, SectorTelemetry, FarmTask } from './types/farm';
import { farmDb } from './services/db';
import { FarmLoginView } from './components/FarmLoginView';
import { FarmDashboard } from './components/FarmDashboard';
import { sound } from './utils/audio';
import { useTheme } from './context/ThemeContext';

// Static image imports or direct asset paths
import mistImage from './assets/images/farm_morning_mist_1790702315859.jpg';
import greenhouseImage from './assets/images/farm_greenhouse_clean_1790702328965.jpg';

export default function App() {
  const { isDark } = useTheme();
  const [operators, setOperators] = useState<FarmOperator[]>([]);
  const [sectors, setSectors] = useState<SectorTelemetry[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [activeOperator, setActiveOperator] = useState<FarmOperator | null>(null);
  const [bgMode, setBgMode] = useState<'mist' | 'greenhouse' | 'solid'>('mist');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Load from database service
  useEffect(() => {
    const loadFromDb = async () => {
      const [dbOps, dbSectors, dbTasks] = await Promise.all([
        farmDb.getOperators(),
        farmDb.getSectors(),
        farmDb.getTasks()
      ]);
      setOperators(dbOps);
      setSectors(dbSectors);
      setTasks(dbTasks);
    };
    loadFromDb();
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) {
      sound.playKeyTap();
    }
  };

  const handleSuccessfulLogin = (op: FarmOperator) => {
    setActiveOperator(op);
  };

  const handleLockTerminal = () => {
    sound.playBackspace();
    setActiveOperator(null);
  };

  const handleAddOperator = async (newOp: FarmOperator) => {
    await farmDb.saveOperator(newOp);
    setOperators((prev) => [newOp, ...prev.filter(o => o.id !== newOp.id)]);
  };

  const getActiveBackgroundImage = () => {
    if (bgMode === 'mist') return mistImage;
    if (bgMode === 'greenhouse') return greenhouseImage;
    return null;
  };

  const activeBg = getActiveBackgroundImage();

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0D1510] text-[#E5EAE7] selection:bg-[#34533C] selection:text-white' 
        : 'bg-[#F8FAF9] text-[#0F172A] selection:bg-emerald-200 selection:text-emerald-950'
    }`}>
      {/* Background Layer with Zero-Broken-Image Policy */}
      {activeBg && !imageError ? (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={activeBg}
            alt="Agricultural Farm Landscape"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center scale-105 filter blur-[1px] transition-all duration-700 ease-in-out ${
              isDark 
                ? 'brightness-[0.38] contrast-[1.05]' 
                : 'brightness-[0.95] contrast-[1.0] opacity-35'
            }`}
          />
          {/* Subtle Organic Field Grid Scrim */}
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D1510]/80 via-[#0D1510]/85 to-[#0D1510]/95" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,21,16,0.7)_100%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#F8FAF9]/85 to-[#F8FAF9]/98" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,249,0.5)_100%)]" />
            </>
          )}
        </div>
      ) : (
        /* Fallback subtle geometric mesh when in solid mode or if image fails */
        <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-200 ${
          isDark ? 'bg-[#0D1510]' : 'bg-[#F8FAF9]'
        }`}>
          <div className={`absolute inset-0 [background-size:24px_24px] ${
            isDark 
              ? 'opacity-20 bg-[radial-gradient(#2F4C38_1px,transparent_1px)]' 
              : 'opacity-30 bg-[radial-gradient(#15803D_1px,transparent_1px)]'
          }`} />
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-t from-[#0D1510] via-transparent to-[#0D1510]' 
              : 'bg-gradient-to-t from-[#F8FAF9] via-transparent to-[#F8FAF9]'
          }`} />
        </div>
      )}

      {/* Main View Router: Login vs Authenticated Terminal Dashboard */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {!activeOperator ? (
          <FarmLoginView
            operators={operators}
            onSuccessfulLogin={handleSuccessfulLogin}
            onAddOperator={handleAddOperator}
            bgMode={bgMode}
            onChangeBgMode={(mode) => {
              setImageError(false);
              setBgMode(mode);
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        ) : (
          <FarmDashboard
            operator={activeOperator}
            operators={operators}
            onLockTerminal={handleLockTerminal}
            onAddOperator={handleAddOperator}
            bgMode={bgMode}
            onChangeBgMode={(mode) => {
              setImageError(false);
              setBgMode(mode);
            }}
          />
        )}
      </div>
    </div>
  );
}
