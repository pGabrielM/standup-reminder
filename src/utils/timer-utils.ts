import { TimerState } from '../types/timer';

// Enviar mensagem para o service worker
export const sendMessage = async (action: string, data?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, ...data }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

// Funções para controlar o timer
export const startTimer = async (): Promise<TimerState> => {
  return sendMessage('start');
};

export const pauseTimer = async (): Promise<TimerState> => {
  return sendMessage('pause');
};

export const resumeTimer = async (): Promise<TimerState> => {
  return sendMessage('resume');
};

export const resetTimer = async (): Promise<TimerState> => {
  return sendMessage('reset');
};

export const snoozeTimer = async (): Promise<TimerState> => {
  return sendMessage('snooze');
};

export const updateInterval = async (interval: number): Promise<TimerState> => {
  return sendMessage('updateInterval', { interval });
};

export const updateSnoozeTime = async (snoozeTime: number): Promise<TimerState> => {
  return sendMessage('updateSnoozeTime', { snoozeTime });
};

export const getTimerState = async (): Promise<TimerState> => {
  return sendMessage('getState');
};

// Formatar tempo em MM:SS ou HH:MM:SS se passar de 60 minutos
export const formatTime = (seconds: number): string => {
  const totalMinutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Se tiver menos de 60 minutos, mostrar MM:SS
  if (totalMinutes < 60) {
    return `${totalMinutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Se tiver 60 minutos ou mais, mostrar HH:MM:SS
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Formatar tempo de forma amigável (ex: "1h 15min" ou "45min")
export const formatTimeFriendly = (seconds: number): string => {
  const totalMinutes = Math.floor(seconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
};
