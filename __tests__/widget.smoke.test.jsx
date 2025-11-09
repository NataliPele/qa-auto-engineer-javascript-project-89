/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic.js'

describe('Чат-бот: smoke', () => {
  test('рендерится и открывается (видна кнопка "Начать разговор")', async () => {
    const user = userEvent.default ? userEvent.default.setup() : userEvent.setup()
    render(Widget(steps))

    const toggleBtn = await screen.findByRole('button', { name: /открыть чат|начать разговор/i })
    expect(toggleBtn).toBeInTheDocument()

    await user.click(toggleBtn)

    const startBtn = await screen.findByRole('button', { name: /начать разговор|начать разговор/i })
    expect(startBtn).toBeInTheDocument()
  })
})
