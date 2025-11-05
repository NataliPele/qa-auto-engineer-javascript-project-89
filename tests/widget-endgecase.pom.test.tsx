// tests/widget-endgecase.pom.test.tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { describe, expect, test } from 'vitest'
import React from 'react'

class ChatWidget {
  user = userEvent.setup()

  open = async () => {
    const openBtn = screen.getByRole('button', { name: /открыть чат/i })
    await this.user.click(openBtn)

    await screen.findByText(/виртуальный помощник/i)
  }

  startConversation = async () => {
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    await this.user.click(startBtn)
  }

  async spamKeyboard(times = 2000) {
    for (let i = 0; i < times; i += 1) {
      await this.user.keyboard('a')
    }
  }

  async pressEscape() {
    await this.user.keyboard('{Escape}')
  }

  async expectClosed() {
    const dialogs = screen.queryAllByRole('dialog')
    if (dialogs.length > 0) {
      expect(screen.queryByText(/виртуальный помощник/i)).toBeNull()
    }
  }
}

class FormUnderWidget {
  user = userEvent.setup()

  get email() {
    return screen.getByRole('textbox', { name: /email/i })
  }
  get password() {
    return screen.getByLabelText(/пароль/i)
  }
  get address() {
    return screen.getByRole('textbox', { name: /адрес/i })
  }
  get city() {
    return screen.getByRole('textbox', { name: /город/i })
  }
  get country() {
    return screen.getByRole('combobox', { name: /страна/i })
  }
  get acceptRules() {
    return screen.getByRole('checkbox', { name: /принять правила/i })
  }
  get submit() {
    return screen.getByRole('button', { name: /зарегистрироваться/i })
  }

  async fill({
    email = '',
    password = '',
    address = '',
    city = '',
    country = '',
    acceptRules = false,
  }) {
    if (email) await this.user.type(this.email, email)
    if (password) await this.user.type(this.password, password)
    if (address) await this.user.type(this.address, address)
    if (city) await this.user.type(this.city, city)
    if (country) await this.user.selectOptions(this.country, country)
    if (acceptRules) await this.user.click(this.acceptRules)
  }

  async submitForm() {
    await this.user.click(this.submit)
  }

  valueCell(rusKey: string) {
    const row = screen.getByRole('row', { name: new RegExp(`^${rusKey}\\s`, 'i') })
    const cells = within(row).getAllByRole('cell')
    return cells[1]
  }
}

describe('edge cases for widget (POM)', () => {
  test('виджет рендерится с минимальной конфигурацией шагов (без падений)', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    await screen.findByRole('button', { name: /начать разговор/i })
  })

  test('чат переживает очень длинный ввод (без текстбокса): шлём клавиатуру и не падаем', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    await chat.spamKeyboard(1500)

    await screen.findByRole('button', { name: /начать разговор/i })
  })

  test('форма продолжает работать после открытия чата', async () => {
    render(<App />)

    const chat = new ChatWidget()
    const form = new FormUnderWidget()

    await chat.open()

    await form.fill({
      email: 'test@example.com',
      password: 'secret',
      address: 'Невский проспект, 12',
      city: 'Питер',
      country: 'Россия',
      acceptRules: true,
    })

    await form.submitForm()

    expect(form.valueCell('Email')).toHaveTextContent('test@example.com')
    expect(form.valueCell('Пароль')).toHaveTextContent('secret')
    expect(form.valueCell('Адрес')).toHaveTextContent('Невский проспект, 12')
    expect(form.valueCell('Город')).toHaveTextContent('Питер')
    expect(form.valueCell('Страна')).toHaveTextContent('Россия')
    expect(form.valueCell('Принять правила')).toHaveTextContent('true')
  })

  test('escape закрывает модалку даже если фокус внутри (без поиска textbox)', async () => {
    render(<App />)

    const chat = new ChatWidget()
    await chat.open()

    await chat.pressEscape()
    await chat.expectClosed()
  })
})
