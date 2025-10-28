/* eslint-disable no-undef */
/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import steps from '@hexlet/chatbot-v2/example-steps'

// eslint-disable-next-line no-undef
test('кнопка запуска виджета рендерится', () => {
  render(Widget(steps))
  const trigger = screen.getByRole('button', { name: /открыть чат/i })
  expect(trigger).toBeInTheDocument()
})

test('после клика видно приветствие и кнопку "Начать разговор"', async () => {
  const user = userEvent.setup()
  render(Widget(steps))

  await user.click(screen.getByRole('button', { name: /открыть чат/i }))

  expect(await screen.findByText(/привет/i)).toBeInTheDocument()
  expect(await screen.findByRole('button', { name: /начать разговор/i })).toBeInTheDocument()
})
