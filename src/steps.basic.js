const steps = [
  {
    id: 'welcome',
    messages: [
      'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
    ],
    buttons: [{ text: 'Начать разговор', nextStepId: 'start', type: 'button' }],
  },
  {
    id: 'start',
    messages: ['Помогу вам выбрать подходящий курс. Выбирайте категорию вопроса.'],
    buttons: [{ text: 'Назад', nextStepId: 'welcome', type: 'button' }],
  },
]

export default steps
