/// <reference types="chrome"/>
import { TimerState, DEFAULT_INTERVAL, DEFAULT_SNOOZE_TIME, ALARM_NAME } from '../types/timer';

// Estado inicial do timer
const getInitialState = (): TimerState => ({
  interval: DEFAULT_INTERVAL,
  remainingTime: DEFAULT_INTERVAL * 60,
  isPaused: false,
  isActive: false,
  lastUpdateTime: Date.now(),
  snoozeTime: DEFAULT_SNOOZE_TIME,
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
  try {
    console.log('⏰ Timer finalizado! Disparando notificação...');

    // Criar um ícone simples usando data URL
    const iconDataUrl = 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="25" fill="#3b82f6"/>
        <circle cx="64" cy="64" r="35" fill="none" stroke="white" stroke-width="8"/>
        <line x1="64" y1="64" x2="54" y2="50" stroke="white" stroke-width="8" stroke-linecap="round"/>
        <line x1="64" y1="64" x2="68" y2="38" stroke="white" stroke-width="8" stroke-linecap="round"/>
        <circle cx="64" cy="64" r="5" fill="white"/>
      </svg>
    `);

    const notificationId = await chrome.notifications.create({
      type: 'basic',
      iconUrl: iconDataUrl,
      title: '⏰ Hora de se levantar!',
      message: 'Você está sentado há um tempo. Levante-se, estique-se e movimente-se por alguns minutos!',
      priority: 2,
      requireInteraction: true,
      silent: false, // Reproduz som de notificação
      buttons: [
        { title: '✓ Já me levantei' },
        { title: '⏰ Adiar' },
      ],
    });

    console.log('✅ Notificação criada com ID:', notificationId);

    // Feedback adicional via badge
    await chrome.action.setBadgeText({ text: '!' });
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error);
    // Fallback: apenas atualizar badge
    await chrome.action.setBadgeText({ text: '!' });
  }
};// Formatar tempo para badge (compacto)
const formatBadgeTime = (seconds: number): string => {
  const totalMinutes = Math.ceil(seconds / 60);

  // Menos de 60 minutos: mostrar apenas minutos
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  // 60 minutos ou mais: mostrar horas e minutos
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h${mins}`;
};

// Atualizar badge da extensão
const updateBadge = async (state: TimerState): Promise<void> => {
  try {
    if (!state.isActive) {
      await chrome.action.setBadgeText({ text: '' });
      return;
    }

    if (state.isPaused) {
      await chrome.action.setBadgeText({ text: '⏸' });
      return;
    }

    // Badge com tempo formatado (apenas texto, sem cores)
    const badgeText = formatBadgeTime(state.remainingTime);
    await chrome.action.setBadgeText({ text: badgeText });
  } catch (error) {
    console.error('Erro ao atualizar badge:', error);
  }
};// Iniciar timer
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

  // Se estiver ativo e não pausado, calcular tempo restante antes de pausar
  if (state.isActive && !state.isPaused) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);
    state.remainingTime = Math.max(0, state.remainingTime - elapsedSeconds);
  }

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

// Adiar timer - ADICIONA snoozeTime minutos ao tempo atual
export const snoozeTimer = async (): Promise<void> => {
  const state = await loadState();
  // Adiciona snoozeTime minutos ao tempo restante atual
  state.remainingTime = state.remainingTime + (state.snoozeTime * 60);
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

// Atualizar tempo de adiamento
export const updateSnoozeTime = async (minutes: number): Promise<void> => {
  const state = await loadState();
  state.snoozeTime = minutes;
  state.lastUpdateTime = Date.now();

  await saveState(state);
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

  console.log(`⏱️ Tick do alarme - Tempo restante: ${state.remainingTime}s`);

  if (state.remainingTime <= 0) {
    console.log('🔔 Tempo esgotado! Disparando notificação...');
    await showNotification();
    state.remainingTime = state.interval * 60;
    console.log(`♻️ Timer resetado para ${state.interval} minutos`);
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
      case 'updateSnoozeTime':
        await updateSnoozeTime(message.snoozeTime);
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
