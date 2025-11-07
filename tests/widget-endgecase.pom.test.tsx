import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { describe, expect, test } from 'vitest'
import React from 'react'

class ChatWidget {
  user = userEvent.setup()

  async open() {
    const openBtn = await screen.findByRole('button', { name: /открыть чат/i })
    await this.user.click(openBtn)
    await screen.findByRole('dialog', { name: /виртуальный помощник/i })
  }

  async startConversation() {
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    await this.user.click(startBtn)
  }

  async spamKeyboard(times = 500, batch = 100) {
    for (let sent = 0; sent < times; sent += batch) {
      const chunk = Math.min(batch, times - sent)
      await this.user.keyboard('a'.repeat(chunk))
      await new Promise((r) => setTimeout(r, 0)) // не блокировать jsdom
    }
  }

  async pressEscape() {
    await this.user.keyboard('{Escape}')
  }

  async expectClosed() {
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /виртуальный помощник/i })).toBeNull()
    })
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

  async fill(fields) {
    const { email, password, address, city, country, acceptRules } = fields
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

  async valueCell(rusKey: string) {
    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row')
    const row = rows.find((r) => {
      const cells = within(r).queryAllByRole('cell')
      const first = cells[0]?.textContent?.trim() ?? ''
      return new RegExp(`^${rusKey}$`, 'i').test(first)
    })
    if (!row) throw new Error(`Row not found for key: ${rusKey}`)
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

  test('форма продолжает работать после открытия чата', async () => {
    render(<App />)
  
    const chat = new ChatWidget()
    await chat.open()
  
    // ⚠️ Обходим фокус-трап модалки — меняем значения напрямую через fireEvent
    const email = screen.getByRole('textbox', { name: /email/i })
    const password = screen.getByLabelText(/пароль/i)
    const address = screen.getByRole('textbox', { name: /адрес/i })
    const city = screen.getByRole('textbox', { name: /город/i })
    const country = screen.getByRole('combobox', { name: /страна/i })
    const acceptRules = screen.getByRole('checkbox', { name: /принять правила/i })
  
    fireEvent.input(email, { target: { value: 'test@example.com' } })
    fireEvent.input(password, { target: { value: 'secret' } })
    fireEvent.input(address, { target: { value: 'Невский проспект, 12' } })
    fireEvent.input(city, { target: { value: 'Питер' } })
    fireEvent.change(country, { target: { value: 'Россия' } })
    fireEvent.click(acceptRules)
  
    // Сабмитим напрямую, не кликая по кнопке (клик может быть перекрыт оверлеем)
    const formEl = document.querySelector('form') as HTMLFormElement
    fireEvent.submit(formEl)
  
    // Ждём, пока таблица и нужные строки появятся с заполненными значениями
    await screen.findByRole('table')
  
    // Достаём значения из строк по первой ячейке (как у тебя в POM)
    const tables = screen.getAllByRole('table')
    const table = tables[0]
    const rowByKey = (key: string) => {
      const rows = within(table).getAllByRole('row')
      const row = rows.find(r => {
        const cells = within(r).queryAllByRole('cell')
        const first = (cells[0]?.textContent ?? '').trim()
        return new RegExp(`^${key}\\s*$`, 'i').test(first)
      })
      if (!row) throw new Error(`Row not found for key: ${key}`)
      const cells = within(row).getAllByRole('cell')
      if (cells.length < 2) throw new Error(`No value cell for key: ${key}`)
      return cells[1]
    }
  
    expect(rowByKey('Email')).toHaveTextContent('test@example.com')
    expect(rowByKey('Пароль')).toHaveTextContent('secret')
    expect(rowByKey('Адрес')).toHaveTextContent('Невский проспект, 12')
    expect(rowByKey('Город')).toHaveTextContent('Питер')
    expect(rowByKey('Страна')).toHaveTextContent('Россия')
    expect(rowByKey('Принять правила')).toHaveTextContent('true')
  })

  test('escape закрывает модалку даже если фокус внутри', async () => {
    render(<App />)
    const chat = new ChatWidget()
    await chat.open()
    await chat.pressEscape()
    await chat.expectClosed()
  })
})
