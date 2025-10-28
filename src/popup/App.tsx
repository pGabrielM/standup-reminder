/// <reference types="chrome"/>
import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Settings,
  Check,
  X,
  Timer,
  Activity,
  Bell,
  Sparkles,
  Globe,
} from 'lucide-react';
import { TimerState } from '../types/timer';
import {
  getTimerState,
  startTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  snoozeTimer,
  updateInterval,
  updateSnoozeTime,
  formatTime,
  formatTimeFriendly,
} from '../utils/timer-utils';
import { Language, translations } from '../i18n/translations';
import '../styles/globals.css';

function App() {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [newInterval, setNewInterval] = useState<string>('60');
  const [newSnoozeTime, setNewSnoozeTime] = useState<string>('15');
  const [loading, setLoading] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const [showSnoozeAnimation, setShowSnoozeAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [language, setLanguage] = useState<Language>('pt');

  // Tradução atual
  const t = translations[language];

  // Calcular tempo restante considerando o tempo decorrido
  const calculateRemainingTime = useCallback((state: TimerState): number => {
    if (!state.isActive || state.isPaused) {
      return state.remainingTime;
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);
    return Math.max(0, state.remainingTime - elapsedSeconds);
  }, []);

  // Carregar estado do service worker
  const loadState = useCallback(async () => {
    try {
      const state = await getTimerState();
      setTimerState(state);
      setNewInterval(state?.interval?.toString() || '60');
      setNewSnoozeTime(state?.snoozeTime?.toString() || '15');
      setLanguage(state?.language || 'pt');
      setDisplayTime(calculateRemainingTime(state));
    } catch (error) {
      console.error('Erro ao carregar estado:', error);
    }
  }, [calculateRemainingTime]);

  // Atualizar display time a cada segundo
  useEffect(() => {
    if (!timerState) return;

    const interval = setInterval(() => {
      const remaining = calculateRemainingTime(timerState);
      setDisplayTime(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [timerState, calculateRemainingTime]);

  // Recarregar estado do service worker periodicamente
  useEffect(() => {
    loadState();

    const interval = setInterval(() => {
      loadState();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadState]);

  const handleStart = async () => {
    setLoading(true);
    try {
      await startTimer();
      await loadState();
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await pauseTimer();
      await loadState();
    } catch (error) {
      console.error('Erro ao pausar timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await resumeTimer();
      await loadState();
    } catch (error) {
      console.error('Erro ao retomar timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetTimer();
      await loadState();
    } catch (error) {
      console.error('Erro ao resetar timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnooze = async () => {
    setLoading(true);
    try {
      setShowSnoozeAnimation(true);
      await snoozeTimer();
      await loadState();
      setTimeout(() => {
        setShowSnoozeAnimation(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao adiar timer:', error);
      setShowSnoozeAnimation(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterval = async () => {
    setErrorMessage('');

    const interval = parseInt(newInterval);
    const snooze = parseInt(newSnoozeTime);

    if (newInterval.trim() === '' || isNaN(interval)) {
      setErrorMessage(t.errorNumericInterval);
      return;
    }

    if (interval < 1) {
      setErrorMessage(t.errorMinInterval);
      return;
    }

    if (interval > 480) {
      setErrorMessage(t.errorMaxInterval);
      return;
    }

    if (newSnoozeTime.trim() === '' || isNaN(snooze)) {
      setErrorMessage(t.errorNumericSnooze);
      return;
    }

    if (snooze < 1) {
      setErrorMessage(t.errorMinSnooze);
      return;
    }

    if (snooze > 120) {
      setErrorMessage(t.errorMaxSnooze);
      return;
    }

    if (snooze > interval) {
      setErrorMessage(t.errorSnoozeGreater);
      return;
    }

    setLoading(true);
    try {
      await updateInterval(interval);
      await updateSnoozeTime(snooze);

      if (language !== timerState?.language) {
        await chrome.storage.local.set({
          timerState: { ...timerState, language }
        });
      }

      await loadState();
      setShowSettings(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      setErrorMessage(t.errorSaving);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (): number => {
    if (!timerState) return 0;
    const total = timerState.interval * 60;
    return ((total - displayTime) / total) * 100;
  };

  if (!timerState) {
    return (
      <div className="w-[420px] min-h-[540px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 font-medium">{t.timerInactive}</p>
        </div>
      </div>
    );
  }

  const progress = getProgressPercentage();
  const isLowTime = displayTime < 300 && timerState.isActive;

  return (
    <div className="w-[420px] min-h-[540px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800">{t.appName}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Bell className="w-3 h-3" />
                {t.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all duration-300 ${showSettings ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow-sm'}`}
            disabled={loading}
          >
            <Settings className={`w-5 h-5 ${showSettings ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className={`transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4" />
              {t.timerSettings}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {t.language}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={loading}
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t.interval}
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={newInterval}
                  onChange={(e) => setNewInterval(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={loading}
                  placeholder={t.intervalPlaceholder}
                />
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <button type="button" onClick={() => setNewInterval('30')} className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors" disabled={loading}>30{t.min}</button>
                  <button type="button" onClick={() => setNewInterval('45')} className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors" disabled={loading}>45{t.min}</button>
                  <button type="button" onClick={() => setNewInterval('60')} className="px-2.5 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors" disabled={loading}>1{t.hour}</button>
                  <button type="button" onClick={() => setNewInterval('90')} className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors" disabled={loading}>1h30</button>
                  <button type="button" onClick={() => setNewInterval('120')} className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors" disabled={loading}>2{t.hours}</button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.rangeInterval}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t.snoozeTime}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newSnoozeTime}
                  onChange={(e) => setNewSnoozeTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={loading}
                  placeholder={t.snoozePlaceholder}
                />
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <button type="button" onClick={() => setNewSnoozeTime('5')} className="px-2.5 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors" disabled={loading}>5{t.min}</button>
                  <button type="button" onClick={() => setNewSnoozeTime('10')} className="px-2.5 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors" disabled={loading}>10{t.min}</button>
                  <button type="button" onClick={() => setNewSnoozeTime('15')} className="px-2.5 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors" disabled={loading}>15{t.min}</button>
                  <button type="button" onClick={() => setNewSnoozeTime('20')} className="px-2.5 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors" disabled={loading}>20{t.min}</button>
                  <button type="button" onClick={() => setNewSnoozeTime('30')} className="px-2.5 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors" disabled={loading}>30{t.min}</button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.rangeSnooze}</p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-pulse">
                  <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={() => { setShowSettings(false); setErrorMessage(''); }} disabled={loading} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 text-sm">
                  <X className="w-4 h-4" />
                  {t.cancel}
                </button>
                <button onClick={handleSaveInterval} disabled={loading} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 text-sm">
                  <Check className="w-4 h-4" />
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="relative w-36 h-36 mx-auto mb-3">
              <svg className="transform -rotate-90 w-36 h-36">
                <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="7" fill="none" className="text-gray-200" />
                <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="7" fill="none" strokeDasharray={2 * Math.PI * 66} strokeDashoffset={2 * Math.PI * 66 * (1 - progress / 100)} className={`transition-all duration-300 ${isLowTime ? 'text-orange-500' : timerState.isPaused ? 'text-yellow-500' : timerState.isActive ? 'text-blue-500' : 'text-gray-300'}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`${displayTime >= 3600 ? 'text-3xl' : 'text-4xl'} font-bold font-mono transition-all duration-300 ${isLowTime ? 'text-orange-600 animate-pulse' : timerState.isPaused ? 'text-yellow-600' : timerState.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {formatTime(displayTime)}
                </div>
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <p className="text-sm font-medium text-gray-600">
                {timerState.isActive ? timerState.isPaused ? `⏸️ ${t.paused}` : isLowTime ? `🔔 ${t.almostTime}` : `⏱️ ${t.timerActive}` : `⏹️ ${t.timerInactive}`}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{t.configuredInterval}: {formatTimeFriendly(timerState.interval * 60)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {!timerState.isActive ? (
            <button onClick={handleStart} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100">
              <Play className="w-5 h-5" />
              <span>{t.startTimer}</span>
            </button>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                {timerState.isPaused ? (
                  <button onClick={handleResume} disabled={loading} className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                    <Play className="w-5 h-5" />
                    <span className="text-sm">{t.continue}</span>
                  </button>
                ) : (
                  <button onClick={handlePause} disabled={loading} className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                    <Pause className="w-5 h-5" />
                    <span className="text-sm">{t.pause}</span>
                  </button>
                )}
                <button onClick={handleReset} disabled={loading} className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm">{t.reset}</span>
                </button>
              </div>
              <button onClick={handleSnooze} disabled={loading} className="w-full relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden">
                {showSnoozeAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <Sparkles key={i} className="absolute w-4 h-4 text-yellow-300 animate-ping" style={{ animationDelay: `${i * 0.1}s`, transform: `rotate(${i * 30}deg) translateY(-25px)`, opacity: 0.8 }} />
                    ))}
                  </div>
                )}
                <Clock className="w-5 h-5" />
                <span>{t.snooze} +{timerState?.snoozeTime || 15} {t.min}</span>
              </button>
            </>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3 border border-blue-200/50">
          <p className="text-xs text-blue-900 text-center leading-relaxed">
            <span className="text-base">💡</span>
            <strong className="ml-1">{t.healthTip}:</strong> {t.healthTipText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
