/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import { AppPO } from './page-objects/AppPO.js'
import { ChatWidgetPO } from './page-objects/ChatWidgetPO.js'

describe('Интеграция виджета с хост-приложением (PO)', () => {
  test('хост-приложение: форма → таблица → назад', async () => {
    render(<App />)

    const app = new AppPO()
    await app.fillForm()
    await app.submit()
    await app.expectResultTable()
    await app.back()

    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument()
  })

  test('виджет встраивается, запускается и не ломает хост-приложение', async () => {
    render(<App />)

    const widget = new ChatWidgetPO()
    await widget.open()
    await widget.start()
    await widget.closeByEsc()
    widget.expectDialogGone()

    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument()
  })
})
