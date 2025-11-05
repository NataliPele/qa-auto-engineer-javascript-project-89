import React from 'react'
import { describe, test, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../src/App.jsx'

beforeAll(() => {
  const orig = CSSStyleDeclaration.prototype.setProperty
  CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
    if (name === 'border' && typeof value === 'string' && value.includes('var(')) {
      return
    }
    return orig.call(this, name, value, priority)
  }
})

describe('edge cases for widget', () => {
  test('виджет рендерится с минимальной конфигурацией (через App) без падений', async () => {
    const user = userEvent.setup()
    render(<App />)

    const openBtn = screen.getByRole('button', { name: /открыть чат/i })
    expect(openBtn).toBeInTheDocument()

    await user.click(openBtn)
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()

    const modalQ = within(modal)
    expect(modalQ.getByRole('button', { name: /начать разговор/i })).toBeInTheDocument()
  })

  test('чат переживает очень длинный ввод (без текстбокса): шлём клавиатуру и не падаем', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    const modal = screen.getByRole('dialog')
    const modalQ = within(modal)

    const startBtn = modalQ.getByRole('button', { name: /начать разговор/i })
    await user.click(startBtn)

    const longText = 'x'.repeat(2000)
    await user.keyboard(longText)

    expect(modal).toBeInTheDocument()
  })

  test('форма продолжает работать после открытия чата', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    const modal = screen.getByRole('dialog')

    const closeBtn = within(modal).getByRole('button', { name: /close/i })
    await user.click(closeBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/пароль/i)
    await user.type(email, 'test@example.com')
    await user.type(password, 'secret')

    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))

    expect(screen.getByRole('button', { name: /назад/i })).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('secret')).toBeInTheDocument()
  })

  test('escape закрывает модалку даже если фокус внутри (без поиска textbox)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    const modal = screen.getByRole('dialog')
    const modalQ = within(modal)

    const startBtn = modalQ.getByRole('button', { name: /начать разговор/i })
    startBtn.focus()
    expect(startBtn).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
