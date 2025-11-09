const stepsEmpty = []

const stepsNoWelcome = [
  {
    id: 'start',
    messages: ['Старт без welcome.'],
    buttons: [{ text: 'В никуда', nextStepId: 'ghost', type: 'button' }],
  },
]

const stepsGhostTarget = [
  {
    id: 'welcome',
    messages: ['Добро пожаловать'],
    buttons: [{ text: 'Начать разговор', nextStepId: 'start', type: 'button' }],
  },
  {
    id: 'start',
    messages: ['Шаг старт'],
    buttons: [{ text: 'Дальше', nextStepId: 'no_such_step', type: 'button' }],
  },
]

const stepsEmptyStep = [
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

const stepsMinimal = [
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

export default {
  stepsEmpty,
  stepsNoWelcome,
  stepsGhostTarget,
  stepsEmptyStep,
  stepsMinimal,
}
