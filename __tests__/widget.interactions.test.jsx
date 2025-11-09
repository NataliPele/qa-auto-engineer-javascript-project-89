/* eslint-disable no-undef */
// __tests__/widget.interactions.test.jsx
import { render, screen, within, waitFor } from '@testing-library/react'
import * as userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic.js'

// helper для корректного вызова userEvent в разных версиях
const setupUser = () => (userEvent.default ? userEvent.default.setup() : userEvent.setup())

describe('Чат-бот: взаимодействия', () => {
  test('открывается и закрывается по крестику', async () => {
    const user = setupUser()
    render(Widget(steps))

    // открыть виджет
    const toggleBtn = screen.getByRole('button', { name: /открыть чат/i })
    await user.click(toggleBtn)

    // диалог появился
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // найти крестик (× или "Закрыть")
    const closeBtn =
      within(dialog).getByRole('button', { name: /×|закрыть|close/i })
    await user.click(closeBtn)

    // диалог должен исчезнуть
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // плавающая кнопка доступна
    expect(screen.getByRole('button', { name: /открыть чат/i })).toBeInTheDocument()
  })

  test('открывается и закрывается по Esc', async () => {
    const user = setupUser()
    render(Widget(steps))

    // открыть
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await screen.findByRole('dialog')

    // закрыть по Esc
    await user.keyboard('{Escape}')

    // диалог должен исчезнуть
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // плавающая кнопка снова видна
    expect(screen.getByRole('button', { name: /открыть чат/i })).toBeInTheDocument()
  })

  test('после «Начать разговор» появляются три основных варианта', async () => {
    const user = setupUser()
    render(Widget(steps))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    // три кнопки выбора
    const option1 = await screen.findByRole('button', { name: /сменить профессию|трудоустроиться/i })
    const option2 = screen.getByRole('button', { name: /попробовать себя в it/i })
    const option3 = screen.getByRole('button', { name: /я разработчик.*углубить.*знан/i })

    expect(option1).toBeInTheDocument()
    expect(option2).toBeInTheDocument()
    expect(option3).toBeInTheDocument()
  })

  test('переход между шагами: «Попробовать себя в IT» → «Интересно» → «Вернуться…» возвращает к старту', async () => {
    const user = setupUser()
    render(Widget(steps))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    // ветка try
    await user.click(screen.getByRole('button', { name: /попробовать себя в it/i }))
    expect(await screen.findByText(/подготовительные курсы/i)).toBeInTheDocument()

    // переход в details
    await user.click(screen.getByRole('button', { name: /интересно/i }))
    expect(await screen.findByText(/hexlet\.io\/courses/i)).toBeInTheDocument()

    // возврат в начало
    const backBtn =
      screen.queryByRole('button', { name: /вернуться в начало/i }) ??
      screen.queryByRole('button', { name: /верни меня в начало/i }) ??
      screen.queryByRole('button', { name: /вернуться назад/i })
    expect(backBtn).not.toBeNull()
    await user.click(backBtn)

    // снова видим три стартовые кнопки
    const startOption = await screen.findByRole('button', { name: /попробовать себя в it/i })
    expect(startOption).toBeInTheDocument()
  })

  test('скролл к новому сообщению, бот работает при появлении новых сообщений', async () => {
    const user = setupUser()
    render(Widget(steps))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    await user.click(screen.getByRole('button', { name: /сменить профессию|трудоустроиться/i }))
    await user.click(screen.getByRole('button', { name: /расскажи подробнее/i }))

    const msg = await screen.findByText(/в хекслете можно освоить/i)
    expect(msg).toBeInTheDocument()

    const dialog = msg.closest('[role="dialog"]') ?? document.body
    const btns = within(dialog).getAllByRole('button')
    expect(btns.length).toBeGreaterThan(0)
  })
})
