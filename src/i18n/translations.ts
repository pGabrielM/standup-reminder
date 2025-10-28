export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  // Header
  appName: string;
  tagline: string;

  // Settings
  settings: string;
  timerSettings: string;
  interval: string;
  intervalPlaceholder: string;
  snoozeTime: string;
  snoozePlaceholder: string;
  language: string;
  save: string;
  cancel: string;

  // Timer states
  timerInactive: string;
  timerActive: string;
  paused: string;
  almostTime: string;

  // Buttons
  startTimer: string;
  pause: string;
  continue: string;
  reset: string;
  snooze: string;

  // Info
  configuredInterval: string;
  healthTip: string;
  healthTipText: string;

  // Time units
  min: string;
  hour: string;
  hours: string;

  // Validation messages
  errorNumericInterval: string;
  errorMinInterval: string;
  errorMaxInterval: string;
  errorNumericSnooze: string;
  errorMinSnooze: string;
  errorMaxSnooze: string;
  errorSnoozeGreater: string;
  errorSaving: string;

  // Ranges
  rangeInterval: string;
  rangeSnooze: string;

  // Notification
  notificationTitle: string;
  notificationMessage: string;
  notificationButton1: string;
  notificationButton2: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Stand Up Reminder',
    tagline: 'Take care of your health',
    settings: 'Settings',
    timerSettings: 'Timer Settings',
    interval: 'Interval (minutes)',
    intervalPlaceholder: 'e.g.: 60',
    snoozeTime: 'Snooze Time (minutes)',
    snoozePlaceholder: 'e.g.: 15',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    timerInactive: 'Timer Inactive',
    timerActive: 'Timer Active',
    paused: 'Paused',
    almostTime: 'Almost time!',
    startTimer: 'Start Timer',
    pause: 'Pause',
    continue: 'Continue',
    reset: 'Reset',
    snooze: 'Snooze',
    configuredInterval: 'Interval',
    healthTip: 'Health Tip',
    healthTipText: 'Stand up, stretch and move regularly. Your body thanks you!',
    min: 'min',
    hour: 'h',
    hours: 'h',
    errorNumericInterval: 'Please enter a numeric value for the interval.',
    errorMinInterval: 'The minimum interval is 1 minute.',
    errorMaxInterval: 'The maximum interval is 480 minutes (8 hours).',
    errorNumericSnooze: 'Please enter a numeric value for snooze.',
    errorMinSnooze: 'The minimum snooze time is 1 minute.',
    errorMaxSnooze: 'The maximum snooze time is 120 minutes (2 hours).',
    errorSnoozeGreater: 'Snooze time cannot be greater than the main interval.',
    errorSaving: 'Error saving settings. Please try again.',
    rangeInterval: 'Between 1 and 480 minutes (8 hours)',
    rangeSnooze: 'Between 1 and 120 minutes (2 hours)',
    notificationTitle: '⏰ Time to stand up!',
    notificationMessage: 'You\'ve been sitting for a while. Stand up, stretch and move for a few minutes!',
    notificationButton1: '✓ Already stood up',
    notificationButton2: '⏰ Snooze',
  },
  pt: {
    appName: 'Lembrete de Levantar',
    tagline: 'Cuide da sua saúde',
    settings: 'Configurações',
    timerSettings: 'Configurações do Timer',
    interval: 'Intervalo (minutos)',
    intervalPlaceholder: 'Ex: 60',
    snoozeTime: 'Tempo de Adiamento (minutos)',
    snoozePlaceholder: 'Ex: 15',
    language: 'Idioma',
    save: 'Salvar',
    cancel: 'Cancelar',
    timerInactive: 'Timer Inativo',
    timerActive: 'Timer Ativo',
    paused: 'Pausado',
    almostTime: 'Quase na hora!',
    startTimer: 'Iniciar Timer',
    pause: 'Pausar',
    continue: 'Continuar',
    reset: 'Resetar',
    snooze: 'Adiar',
    configuredInterval: 'Intervalo',
    healthTip: 'Dica de Saúde',
    healthTipText: 'Levante-se, estique-se e movimente-se regularmente. Seu corpo agradece!',
    min: 'min',
    hour: 'h',
    hours: 'h',
    errorNumericInterval: 'Por favor, insira um valor numérico para o intervalo.',
    errorMinInterval: 'O intervalo mínimo é 1 minuto.',
    errorMaxInterval: 'O intervalo máximo é 480 minutos (8 horas).',
    errorNumericSnooze: 'Por favor, insira um valor numérico para o adiamento.',
    errorMinSnooze: 'O tempo de adiamento mínimo é 1 minuto.',
    errorMaxSnooze: 'O tempo de adiamento máximo é 120 minutos (2 horas).',
    errorSnoozeGreater: 'O tempo de adiamento não pode ser maior que o intervalo principal.',
    errorSaving: 'Erro ao salvar configurações. Tente novamente.',
    rangeInterval: 'Entre 1 e 480 minutos (8 horas)',
    rangeSnooze: 'Entre 1 e 120 minutos (2 horas)',
    notificationTitle: '⏰ Hora de se levantar!',
    notificationMessage: 'Você está sentado há um tempo. Levante-se, estique-se e movimente-se por alguns minutos!',
    notificationButton1: '✓ Já me levantei',
    notificationButton2: '⏰ Adiar',
  },
  es: {
    appName: 'Recordatorio de Levantarse',
    tagline: 'Cuida tu salud',
    settings: 'Configuración',
    timerSettings: 'Configuración del Temporizador',
    interval: 'Intervalo (minutos)',
    intervalPlaceholder: 'Ej: 60',
    snoozeTime: 'Tiempo de Aplazamiento (minutos)',
    snoozePlaceholder: 'Ej: 15',
    language: 'Idioma',
    save: 'Guardar',
    cancel: 'Cancelar',
    timerInactive: 'Temporizador Inactivo',
    timerActive: 'Temporizador Activo',
    paused: 'Pausado',
    almostTime: '¡Casi es hora!',
    startTimer: 'Iniciar Temporizador',
    pause: 'Pausar',
    continue: 'Continuar',
    reset: 'Reiniciar',
    snooze: 'Aplazar',
    configuredInterval: 'Intervalo',
    healthTip: 'Consejo de Salud',
    healthTipText: '¡Levántate, estírate y muévete regularmente. Tu cuerpo te lo agradecerá!',
    min: 'min',
    hour: 'h',
    hours: 'h',
    errorNumericInterval: 'Por favor, ingresa un valor numérico para el intervalo.',
    errorMinInterval: 'El intervalo mínimo es 1 minuto.',
    errorMaxInterval: 'El intervalo máximo es 480 minutos (8 horas).',
    errorNumericSnooze: 'Por favor, ingresa un valor numérico para el aplazamiento.',
    errorMinSnooze: 'El tiempo mínimo de aplazamiento es 1 minuto.',
    errorMaxSnooze: 'El tiempo máximo de aplazamiento es 120 minutos (2 horas).',
    errorSnoozeGreater: 'El tiempo de aplazamiento no puede ser mayor que el intervalo principal.',
    errorSaving: 'Error al guardar la configuración. Inténtalo de nuevo.',
    rangeInterval: 'Entre 1 y 480 minutos (8 horas)',
    rangeSnooze: 'Entre 1 y 120 minutos (2 horas)',
    notificationTitle: '⏰ ¡Hora de levantarse!',
    notificationMessage: '¡Has estado sentado un tiempo. Levántate, estírate y muévete unos minutos!',
    notificationButton1: '✓ Ya me levanté',
    notificationButton2: '⏰ Aplazar',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};
