// Types para o storage da extensão
export interface TimerState {
  interval: number; // em minutos
  remainingTime: number; // em segundos
  isPaused: boolean;
  isActive: boolean;
  lastUpdateTime: number;
  snoozeTime: number; // em minutos (configurável)
  language: 'en' | 'pt' | 'es'; // idioma
}

export interface StorageData {
  timerState: TimerState;
}

export const DEFAULT_INTERVAL = 60; // 60 minutos padrão
export const DEFAULT_SNOOZE_TIME = 15; // 15 minutos padrão para adiar
export const DEFAULT_LANGUAGE = 'pt'; // Português como padrão

export const ALARM_NAME = 'standupReminder';
