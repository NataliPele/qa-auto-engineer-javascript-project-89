/* eslint-disable no-undef */
import { render, screen, within, waitFor } from '@testing-library/react'
import * as userEvent from '@testing-library/user-event'
import App from '../src/App.jsx'

const setupUser = () => (userEvent.default ? userEvent.default.setup() : userEvent.setup())

describe('Интеграция виджета с хост-приложением', () => {
  test('хост-приложение работает как до встраивания (форма → таблица)', async () => {
    const user = setupUser()
    render(<App />)

    // Заполняем форму
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/пароль/i), 'secret')
    await user.type(screen.getByLabelText(/адрес/i), 'Невский пр., 12')
    await user.type(screen.getByLabelText(/город/i), 'Санкт-Петербург')
    await user.selectOptions(screen.getByLabelText(/страна/i), 'Россия')
    await user.click(screen.getByLabelText(/принять правила/i))

    // Сабмит
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))

    // Проверяем таблицу результатов
    const table = await screen.findByRole('table')
    const tbody = within(table).getByRole('rowgroup')
    const cellsText = within(tbody).getAllByRole('cell').map((c) => c.textContent)

    // Ключевые значения присутствуют
    expect(cellsText.join(' ')).toMatch(/user@example\.com/i)
    expect(cellsText.join(' ')).toMatch(/secret/i)
    expect(cellsText.join(' ')).toMatch(/санкт-петербург/i)
    expect(cellsText.join(' ')).toMatch(/россия/i)
    expect(cellsText.join(' ')).toMatch(/невский пр\., 12/i)
    expect(cellsText.join(' ')).toMatch(/true/i)

    // Кнопка "Назад" возвращает к форме
    await user.click(screen.getByRole('button', { name: /назад/i }))
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument()
  })

  test('виджет встраивается и открывается (не ломая хост-приложение)', async () => {
    const user = setupUser()
    render(<App />)

    // Плавающая кнопка виджета
    const toggleBtn = screen.getByRole('button', { name: /открыть чат/i })
    expect(toggleBtn).toBeInTheDocument()

    // Открываем чат
    await user.click(toggleBtn)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Внутри диалога появится кнопка "Начать разговор"
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    expect(startBtn).toBeInTheDocument()

    // Закрываем по Esc — диалог исчезает
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // Убеждаемся, что элементы формы доступны после взаимодействия с виджетом
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument()
  })
})
