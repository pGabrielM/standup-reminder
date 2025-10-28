/// <reference types="chrome"/>
import { TimerState, DEFAULT_INTERVAL, ALARM_NAME, SNOOZE_TIME } from '../types/timer';

// Estado inicial do timer
const getInitialState = (): TimerState => ({
  interval: DEFAULT_INTERVAL,
  remainingTime: DEFAULT_INTERVAL * 60,
  isPaused: false,
  isActive: false,
  lastUpdateTime: Date.now(),
});

// Carregar estado do storage
const loadState = async (): Promise<TimerState> => {
  const result = await chrome.storage.local.get('timerState');
  return result.timerState || getInitialState();
};

// Salvar estado no storage
const saveState = async (state: TimerState): Promise<void> => {
  await chrome.storage.local.set({ timerState: state });
};

// Criar alarme do Chrome
const createAlarm = (delayInMinutes: number = 1): void => {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes,
    periodInMinutes: 1,
  });
};

// Limpar alarme
const clearAlarm = (): void => {
  chrome.alarms.clear(ALARM_NAME);
};

// Mostrar notificação
const showNotification = async (): Promise<void> => {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '⏰ Hora de se levantar!',
    message: 'Você está sentado há um tempo. Levante-se, estique-se e movimente-se por alguns minutos!',
    priority: 2,
    requireInteraction: true,
    buttons: [
      { title: '✓ Já me levantei' },
      { title: '⏰ Adiar 15 min' },
    ],
  });
};

// Atualizar badge do ícone da extensão
const updateBadge = async (state: TimerState): Promise<void> => {
  if (!state.isActive) {
    await chrome.action.setBadgeText({ text: '' });
    return;
  }

  if (state.isPaused) {
    await chrome.action.setBadgeText({ text: '⏸' });
    await chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    return;
  }

  const minutes = Math.ceil(state.remainingTime / 60);
  await chrome.action.setBadgeText({ text: minutes.toString() });
  await chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9' });
};

// Iniciar timer
export const startTimer = async (): Promise<void> => {
  const state = await loadState();
  state.isActive = true;
  state.isPaused = false;
  state.lastUpdateTime = Date.now();

  if (state.remainingTime <= 0) {
    state.remainingTime = state.interval * 60;
  }

  await saveState(state);
  await updateBadge(state);
  createAlarm(1);
};

// Pausar timer
export const pauseTimer = async (): Promise<void> => {
  const state = await loadState();
  state.isPaused = true;
  state.lastUpdateTime = Date.now();

  await saveState(state);
  await updateBadge(state);
  clearAlarm();
};

// Despausar timer
export const resumeTimer = async (): Promise<void> => {
  const state = await loadState();
  state.isPaused = false;
  state.lastUpdateTime = Date.now();

  await saveState(state);
  await updateBadge(state);
  createAlarm(1);
};

// Resetar timer
export const resetTimer = async (): Promise<void> => {
  const state = await loadState();
  state.remainingTime = state.interval * 60;
  state.lastUpdateTime = Date.now();

  await saveState(state);
  await updateBadge(state);

  if (state.isActive && !state.isPaused) {
    createAlarm(1);
  }
};

// Adiar timer - ADICIONA 15 minutos ao tempo atual
export const snoozeTimer = async (): Promise<void> => {
  const state = await loadState();
  // Adiciona 15 minutos ao tempo restante atual
  state.remainingTime = state.remainingTime + (SNOOZE_TIME * 60);
  state.lastUpdateTime = Date.now();

  await saveState(state);
  await updateBadge(state);

  if (state.isActive && !state.isPaused) {
    createAlarm(1);
  }
};

// Atualizar intervalo
export const updateInterval = async (minutes: number): Promise<void> => {
  const state = await loadState();
  state.interval = minutes;
  state.remainingTime = minutes * 60;
  state.lastUpdateTime = Date.now();

  await saveState(state);
  await updateBadge(state);
};

// Processar tick do alarme
const processAlarmTick = async (): Promise<void> => {
  const state = await loadState();

  if (!state.isActive || state.isPaused) {
    return;
  }

  // Calcular tempo decorrido desde a última atualização
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);

  state.remainingTime = Math.max(0, state.remainingTime - elapsedSeconds);
  state.lastUpdateTime = now;

  if (state.remainingTime <= 0) {
    await showNotification();
    state.remainingTime = state.interval * 60;
  }

  await saveState(state);
  await updateBadge(state);
};

// Event Listeners
chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === ALARM_NAME) {
    processAlarmTick();
  }
});

chrome.notifications.onButtonClicked.addListener(async (notificationId: string, buttonIndex: number) => {
  if (buttonIndex === 0) {
    // Botão "Já me levantei"
    await resetTimer();
  } else if (buttonIndex === 1) {
    // Botão "Adiar 15 min"
    await snoozeTimer();
  }

  chrome.notifications.clear(notificationId);
});

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  const handleMessage = async () => {
    switch (message.action) {
      case 'start':
        await startTimer();
        break;
      case 'pause':
        await pauseTimer();
        break;
      case 'resume':
        await resumeTimer();
        break;
      case 'reset':
        await resetTimer();
        break;
      case 'snooze':
        await snoozeTimer();
        break;
      case 'updateInterval':
        await updateInterval(message.interval);
        break;
      case 'getState':
        return await loadState();
      default:
        break;
    }
    return await loadState();
  };

  handleMessage()
    .then(sendResponse)
    .catch((error) => {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    });

  return true; // Mantém o canal de mensagem aberto para resposta assíncrona
});

// Inicialização quando a extensão é instalada
chrome.runtime.onInstalled.addListener(async () => {
  const state = getInitialState();
  await saveState(state);
  await updateBadge(state);
});

console.log('Stand Up Reminder Service Worker initialized');
