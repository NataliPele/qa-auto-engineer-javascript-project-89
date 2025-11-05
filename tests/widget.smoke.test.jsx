/* eslint-disable no-undef */
/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'
import steps from '@hexlet/chatbot-v2/example-steps'

test('чат-бот рендерится без ошибок (есть кнопка "Открыть Чат")', () => {
    render(Widget(steps))
    // screen.debug()
    const trigger = screen.getByRole('button', { name: /открыть чат/i })
    expect(trigger).toBeInTheDocument()
  })
