import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, beforeAll, describe, expect, test } from 'vitest'
import App from '../src/App'

vi.mock('@hexlet/chatbot-v2/example-steps', () => ({ default: [] }))

beforeAll(() => {
  const proto = (globalThis as any).CSSStyleDeclaration?.prototype
  if (!proto || (proto as any).__hex_patch_applied__) return
  const originalSetProperty = proto.setProperty
  proto.setProperty = function (name: string, value: string, priority?: string) {
    if (name === 'border' && typeof value === 'string' && value.includes('var(')) {
      return
    }
    return originalSetProperty.call(this, name, value, priority)
  }
  ;(proto as any).__hex_patch_applied__ = true
})

class ChatWidget {
  private user = userEvent.setup()

  open = async () => {
    const openBtn =
      screen.queryByRole('button', { name: /открыть чат|начать разговор/i }) ??
      (Array.from(screen.getAllByRole('button')).find((b) =>
        /открыть чат/i.test(b.textContent || '')
      ) as HTMLButtonElement | undefined)

    expect(openBtn, 'Не нашёл кнопку открытия чата').toBeTruthy()
    await this.user.click(openBtn!)

    await screen.findByRole('dialog')
  }

  isOpen = () => screen.queryByRole('dialog') !== null

  focusInside = () => {
    const dialog = screen.getByRole('dialog')
    const focusTarget =
      within(dialog).queryByRole('button') ||
      within(dialog).queryByRole('textbox') ||
      dialog
    ;(focusTarget as HTMLElement).focus()
    expect(focusTarget).toHaveFocus()
  }

  closeWithEscape = async () => {
    await this.user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  }
  spamKeyboard = async (len = 2000) => {
    await this.user.keyboard('x'.repeat(len))
  }
}

class FormOnApp {
  private user = userEvent.setup()

  fillEmail = async (v: string) => {
    await this.user.type(screen.getByLabelText(/email/i), v)
  }
  fillPassword = async (v: string) => {
    await this.user.type(screen.getByLabelText(/пароль/i), v)
  }
  fillAddress = async (v: string) => {
    await this.user.type(screen.getByLabelText(/адрес/i), v)
  }
  fillCity = async (v: string) => {
    await this.user.type(screen.getByLabelText(/город/i), v)
  }
  selectCountry = async (v: string) => {
    await this.user.selectOptions(screen.getByLabelText(/страна/i), v)
  }
  acceptRules = async () => {
    await this.user.click(screen.getByLabelText(/принять правила/i))
  }
  submit = async () => {
    await this.user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))
  }

  getValueCellHelper = async () => {
    const table = await screen.findByRole('table')
    const rowByLabel = (label: string) =>
      within(table).getByRole('row', { name: new RegExp(`^${label}\\s+`, 'i') })
    const valueCell = (label: string) => {
      const row = rowByLabel(label)
      const cells = within(row).getAllByRole('cell')
      return cells[1]
    }
    return valueCell
  }

  backToForm = async () => {
    await this.user.click(screen.getByRole('button', { name: /назад/i }))
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument()
  }
}

describe('edge cases for widget (POM)', () => {
  test('виджет рендерится с минимальной конфигурацией шагов (без падений)', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    expect(chat.isOpen()).toBe(true)
  })

  test('чат переживает очень длинный ввод (без текстбокса): шлём клавиатуру и не падаем', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    await chat.spamKeyboard(2000)
    expect(chat.isOpen()).toBe(true)
  })

  test('форма продолжает работать после открытия чата', async () => {
    render(<App />)

    const user = userEvent.setup()
    const form = new FormOnApp()
    const chat = new ChatWidget()

    await form.fillEmail('test@example.com')
    await form.fillPassword('secret')
    await form.fillAddress('Невский проспект, 12')
    await form.fillCity('Санкт-Петербург')
    await form.selectCountry('Россия')
    await form.acceptRules()

    await chat.open()
    await chat.spamKeyboard(200)
    await chat.closeWithEscape()

    await form.submit()

    const valueCell = await form.getValueCellHelper()
    await waitFor(() => {
      expect(valueCell('Email')).toHaveTextContent('test@example.com')
    })
    expect(valueCell('Пароль')).toHaveTextContent('secret')
    expect(valueCell('Адрес')).toHaveTextContent('Невский проспект, 12')
    expect(valueCell('Город')).toHaveTextContent('Санкт-Петербург')
    expect(valueCell('Страна')).toHaveTextContent('Россия')
    expect(valueCell('Принять правила')).toHaveTextContent('true')

    await form.backToForm()
    await user.type(screen.getByLabelText(/email/i), '.dev')
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com.dev')
  })

  test('escape закрывает модалку даже если фокус внутри (без поиска textbox)', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    chat.focusInside()
    await chat.closeWithEscape()
  })
})
