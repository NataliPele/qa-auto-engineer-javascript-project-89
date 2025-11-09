// __fixtures__/steps.edge.js

// A. Пустой набор шагов
export const stepsEmpty = []

// B. Нет welcome-шага (обычно стартовая кнопка «Начать разговор» там)
//   Проверяем, что диалог всё равно открывается и приложение не падает.
export const stepsNoWelcome = [
  {
    id: 'start',
    messages: ['Старт без welcome.'],
    buttons: [{ text: 'В никуда', nextStepId: 'ghost', type: 'button' }],
  },
]

// C. Переход на несуществующий шаг
export const stepsGhostTarget = [
  {
    id: 'welcome',
    messages: ['Добро пожаловать'],
    buttons: [{ text: 'Начать разговор', nextStepId: 'start', type: 'button' }],
  },
  {
    id: 'start',
    messages: ['Шаг старт'],
    // Кнопка ведёт на несуществующий id
    buttons: [{ text: 'Дальше', nextStepId: 'no_such_step', type: 'button' }],
  },
]

// D. Шаг без сообщений и без кнопок
export const stepsEmptyStep = [
  {
    id: 'welcome',
    messages: ['Привет'],
    buttons: [{ text: 'Начать разговор', nextStepId: 'empty', type: 'button' }],
  },
  {
    id: 'empty',
    messages: [],
    buttons: [],
  },
]

// E. Минимальный корректный сценарий для «быстрых кликов»
export const stepsMinimal = [
  {
    id: 'welcome',
    messages: ['Привет'],
    buttons: [{ text: 'Начать разговор', nextStepId: 'start', type: 'button' }],
  },
  {
    id: 'start',
    messages: ['Меню'],
    buttons: [{ text: 'Остаться', nextStepId: 'start', type: 'button' }],
  },
]
