// Types para o storage da extensão
export interface TimerState {
  interval: number; // em minutos
  remainingTime: number; // em segundos
  isPaused: boolean;
  isActive: boolean;
  lastUpdateTime: number;
}

export interface StorageData {
  timerState: TimerState;
}

export const DEFAULT_INTERVAL = 60; // 60 minutos padrão
export const SNOOZE_TIME = 15; // 15 minutos para adiar

export const ALARM_NAME = 'standupReminder';
