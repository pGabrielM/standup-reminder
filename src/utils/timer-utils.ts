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

export const getTimerState = async (): Promise<TimerState> => {
  return sendMessage('getState');
};

// Formatar tempo em MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
