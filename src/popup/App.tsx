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
  formatTime,
} from '../utils/timer-utils';
import '../styles/globals.css';

function App() {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [newInterval, setNewInterval] = useState<string>('60');
  const [loading, setLoading] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);

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
      setNewInterval(state.interval.toString());
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
    }, 100); // Atualiza a cada 100ms para suavidade

    return () => clearInterval(interval);
  }, [timerState, calculateRemainingTime]);

  // Recarregar estado do service worker periodicamente
  useEffect(() => {
    loadState();

    const interval = setInterval(() => {
      loadState();
    }, 5000); // A cada 5 segundos sincroniza com o service worker

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
      console.error('Erro ao despausar timer:', error);
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
      await snoozeTimer();
      await loadState();
    } catch (error) {
      console.error('Erro ao adiar timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterval = async () => {
    const interval = parseInt(newInterval);
    if (isNaN(interval) || interval < 1 || interval > 480) {
      alert('Por favor, insira um valor válido entre 1 e 480 minutos.');
      return;
    }

    setLoading(true);
    try {
      await updateInterval(interval);
      await loadState();
      setShowSettings(false);
    } catch (error) {
      console.error('Erro ao atualizar intervalo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular porcentagem para o anel de progresso
  const getProgressPercentage = (): number => {
    if (!timerState) return 0;
    const total = timerState.interval * 60;
    return ((total - displayTime) / total) * 100;
  };

  if (!timerState) {
    return (
      <div className="w-[420px] min-h-[580px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  const progress = getProgressPercentage();
  const isLowTime = displayTime < 300 && timerState.isActive; // Menos de 5 minutos

  return (
    <div className="w-[420px] min-h-[580px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header com glassmorphism */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Stand Up Reminder</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Bell className="w-3 h-3" />
                Cuide da sua saúde
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl transition-all duration-300 ${showSettings
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow-md'
              }`}
            disabled={loading}
          >
            <Settings className={`w-5 h-5 ${showSettings ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Settings Panel com animação */}
        <div
          className={`transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Configurações do Timer
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={newInterval}
                  onChange={(e) => setNewInterval(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Entre 1 e 480 minutos (8 horas)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveInterval}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Check className="w-4 h-4" />
                  Salvar
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Display com anel de progresso */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            {/* Anel de progresso circular */}
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="transform -rotate-90 w-48 h-48">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                  className={`transition-all duration-300 ${isLowTime
                      ? 'text-orange-500'
                      : timerState.isPaused
                        ? 'text-yellow-500'
                        : timerState.isActive
                          ? 'text-blue-500'
                          : 'text-gray-300'
                    }`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Timer no centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-5xl font-bold font-mono transition-colors duration-300 ${isLowTime
                      ? 'text-orange-600 animate-pulse'
                      : timerState.isPaused
                        ? 'text-yellow-600'
                        : timerState.isActive
                          ? 'text-blue-600'
                          : 'text-gray-400'
                    }`}
                >
                  {formatTime(displayTime)}
                </div>
              </div>
            </div>

            {/* Status e Info */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {timerState.isActive
                  ? timerState.isPaused
                    ? '⏸️ Pausado'
                    : isLowTime
                      ? '🔔 Quase na hora!'
                      : '⏱️ Timer Ativo'
                  : '⏹️ Timer Inativo'}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Intervalo configurado: {timerState.interval} minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons com melhor design */}
        <div className="space-y-3">
          {!timerState.isActive ? (
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <Play className="w-6 h-6" />
              <span className="text-lg">Iniciar Timer</span>
            </button>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {timerState.isPaused ? (
                  <button
                    onClick={handleResume}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Play className="w-5 h-5" />
                    <span className="text-sm">Continuar</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-4 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Pause className="w-5 h-5" />
                    <span className="text-sm">Pausar</span>
                  </button>
                )}
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-4 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm">Resetar</span>
                </button>
              </div>
              <button
                onClick={handleSnooze}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Clock className="w-5 h-5" />
                <span>Adiar +15 minutos</span>
              </button>
            </>
          )}
        </div>

        {/* Dica com melhor design */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 border border-blue-200/50">
          <p className="text-xs text-blue-900 text-center leading-relaxed">
            <span className="text-lg">💡</span>
            <strong className="ml-2">Dica de Saúde:</strong> Levante-se, estique-se e movimente-se regularmente. Seu corpo agradece!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
