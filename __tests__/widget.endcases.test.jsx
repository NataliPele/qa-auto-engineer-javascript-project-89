/* eslint-disable no-undef */
import { render, screen, waitFor } from '@testing-library/react'
import * as userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import allEdgeSteps from '../__fixtures__/steps.edge.js'

const setupUser = () => (userEvent.default ? userEvent.default.setup() : userEvent.setup())

describe('Чат-бот: крайние случаи', () => {
  test('пустой набор шагов: виджет открывается, не падает', async () => {
    const user = setupUser()
    render(<Widget steps={allEdgeSteps.stepsEmpty} />)

    const toggleBtn = await screen.findByRole('button', { name: /открыть чат|начать разговор/i })
    await user.click(toggleBtn)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /начать разговор/i })).toBeNull()
  })

  test('нет welcome-шага: открытие диалога без падения', async () => {
    const user = setupUser()
    render(<Widget steps={allEdgeSteps.stepsNoWelcome} />)

    await user.click(await screen.findByRole('button', { name: /открыть чат|начать разговор/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  test('переход на несуществующий шаг: не бросает ошибок, диалог остаётся живым', async () => {
    const user = setupUser()
    render(<Widget steps={allEdgeSteps.stepsGhostTarget} />)

    await user.click(await screen.findByRole('button', { name: /открыть чат|начать разговор/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    await user.click(await screen.findByRole('button', { name: /дальше/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  test('шаг без сообщений и кнопок: не падает, диалог остаётся', async () => {
    const user = setupUser()
    render(<Widget steps={allEdgeSteps.stepsEmptyStep} />)

    await user.click(await screen.findByRole('button', { name: /открыть чат|начать разговор/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.queryAllByRole('button').length).toBeGreaterThanOrEqual(1)
  })

  test('быстрые/двойные клики и повторное закрытие не ломают виджет', async () => {
    const user = setupUser()
    render(<Widget steps={allEdgeSteps.stepsMinimal} />)

    const toggleBtn = await screen.findByRole('button', { name: /открыть чат|начать разговор/i })
    await user.dblClick(toggleBtn)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    await Promise.all([user.click(startBtn), user.click(startBtn)])

    const stayBtn = await screen.findByRole('button', { name: /остаться/i })
    await user.click(stayBtn)
    await user.click(stayBtn)

    await user.keyboard('{Escape}{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })
})
