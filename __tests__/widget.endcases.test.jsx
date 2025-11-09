/* eslint-disable no-undef */
// __tests__/widget.edgecases.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import * as userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import {
  stepsEmpty,
  stepsNoWelcome,
  stepsGhostTarget,
  stepsEmptyStep,
  stepsMinimal,
} from '../__fixtures__/steps.edge.js'

const setupUser = () => (userEvent.default ? userEvent.default.setup() : userEvent.setup())

describe('Чат-бот: крайние случаи', () => {
  test('пустой набор шагов: виджет открывается, не падает', async () => {
    const user = setupUser()
    render(Widget(stepsEmpty))

    // Плавающая кнопка есть всегда
    const toggleBtn = screen.getByRole('button', { name: /открыть чат/i })
    await user.click(toggleBtn)

    // Диалог появляется и приложение не падает
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Внутри может не быть стандартной кнопки «Начать разговор» — и это ок.
    expect(screen.queryByRole('button', { name: /начать разговор/i })).toBeNull()
  })

  test('нет welcome-шага: открытие диалога без падения', async () => {
    const user = setupUser()
    render(Widget(stepsNoWelcome))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    // Проверяем только факт появления диалога (контент может быть нестандартным)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  test('переход на несуществующий шаг: не бросает ошибок, диалог остаётся живым', async () => {
    const user = setupUser()
    render(Widget(stepsGhostTarget))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    // Кликаем «Дальше» → nextStepId указывает на несуществующий шаг
    await user.click(screen.getByRole('button', { name: /дальше/i }))

    // Ожидаем, что диалог не исчез и не упал
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  test('шаг без сообщений и кнопок: не падает, диалог остаётся', async () => {
    const user = setupUser()
    render(Widget(stepsEmptyStep))

    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    // Переходим на пустой шаг — внутри ничего нет, но диалог жив
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    // И никаких известных стандартных кнопок
    expect(screen.queryAllByRole('button').length).toBeGreaterThanOrEqual(1) // как минимум плавающая кнопка остаётся
  })

  test('быстрые/двойные клики и повторное закрытие не ломают виджет', async () => {
    const user = setupUser()
    render(Widget(stepsMinimal))

    // Двойной клик по открытию
    const toggleBtn = screen.getByRole('button', { name: /открыть чат/i })
    await user.dblClick(toggleBtn)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    // Несколько быстрых кликов по кнопкам внутри
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    await Promise.all([user.click(startBtn), user.click(startBtn)])

    // Кликаем по «Остаться» несколько раз подряд
    const stayBtn = await screen.findByRole('button', { name: /остаться/i })
    await user.click(stayBtn)
    await user.click(stayBtn)

    // Закрытие по Esc несколько раз подряд
    await user.keyboard('{Escape}{Escape}')

    // Диалог должен закрыться
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })
})
