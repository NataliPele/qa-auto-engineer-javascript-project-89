import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import { AppPO } from './page-objects/AppPO.js'
import { WidgetPO } from './page-objects/WidgetPO.js'

describe('Интеграция виджета с хост-приложением (PO)', () => {
  test('рендер приложения не вызывает ошибку', () => {
    const renderApp = () => render(<App />)

    expect(renderApp).not.toThrow()
  })

  test('хост-приложение: форма → таблица → назад', async () => {
    render(<App />)

    const app = new AppPO()
    await app.fillForm()
    await app.submit()
    await app.expectResultTable()
    await app.back()

    expect(
      await screen.findByRole('button', { name: /зарегистрироваться/i }),
    ).toBeInTheDocument()
  })

  test('виджет встраивается, запускается и не ломает хост-приложение', async () => {
    render(<App />)

    const widget = new WidgetPO()
    await widget.open()
    await widget.start()
    await widget.closeByEsc()
    widget.expectDialogGone()

    expect(
      await screen.findByRole('button', { name: /зарегистрироваться/i }),
    ).toBeInTheDocument()
  })

  test('работа виджета не влияет на работу приложения', async () => {
    render(<App />)

    const app = new AppPO()
    const widget = new WidgetPO()

    await app.fillForm()

    await widget.open()
    await widget.start()
    await widget.clickByText(/попробовать себя в it/i)

    await screen.findByText(/подготовительные курсы/i)

    await widget.closeByX()

    await app.submit()
    await app.expectResultTable()
    await app.back()

    expect(
      await screen.findByRole('button', { name: /зарегистрироваться/i }),
    ).toBeInTheDocument()
  })
})
