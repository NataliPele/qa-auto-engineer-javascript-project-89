/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic'

test('виджет открывается и отображает первый шаг из фикстуры', async () => {
  const user = userEvent.setup()
  render(Widget(steps))

  await user.click(screen.getByRole('button', { name: /открыть чат/i }))

  expect(await screen.findByText(/Привет! Я ваш виртуальный помощник/i)).toBeInTheDocument()

  const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
  expect(startBtn).toBeInTheDocument()
})

test('переход на шаг "start" и возврат назад работает по фикстуре', async () => {
    const user = userEvent.setup()
    render(Widget(steps))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    expect(startBtn).toBeInTheDocument()
  
    await user.click(startBtn)
    expect(screen.queryByRole('button', { name: /начать разговор/i })).toBeNull()

    await user.click(await screen.findByRole('button', { name: /назад/i }))
    expect(await screen.findByRole('button', { name: /начать разговор/i })).toBeInTheDocument()
  })
  