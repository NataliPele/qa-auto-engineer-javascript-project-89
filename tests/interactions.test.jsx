/* eslint-disable no-undef */
/// <reference types="vitest/globals" />

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic'

// sanity-check, чтобы файл точно содержал хотя бы один тест
test('sanity: vitest видит тесты', () => {
  expect(true).toBe(true)
})

test('клик по "Открыть Чат" показывает модалку и заголовок', async () => {
  const user = userEvent.setup()
  render(Widget(steps))
  expect(screen.queryByRole('dialog')).toBeNull()
  await user.click(screen.getByRole('button', { name: /открыть чат/i }))

  const dialog = await screen.findByRole('dialog', { name: /виртуальный помощник/i })
  expect(dialog).toBeInTheDocument()
})

test('закрытие модалки по крестику', async () => {
  const user = userEvent.setup()
  render(Widget(steps))
  
  await user.click(screen.getByRole('button', { name: /открыть чат/i }))
  
  // Кликаем на кнопку "Close" в хедере модалки
  await user.click(await screen.findByRole('button', { name: /close/i }))
  
  // Даем времени на анимацию/размонтирование
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).toBeNull()
    })
})

test('переход: "Начать разговор" → следующий шаг', async () => {
  const user = userEvent.setup()
  render(Widget(steps))
  await user.click(screen.getByRole('button', { name: /открыть чат/i }))
  await user.click(await screen.findByRole('button', { name: /начать разговор/i }))
  expect(await screen.findByText(/помогу вам выбрать подходящий курс/i)).toBeInTheDocument()
})

test('возврат назад показывает снова "Начать разговор"', async () => {
  const user = userEvent.setup()
  render(Widget(steps))
  await user.click(screen.getByRole('button', { name: /открыть чат/i }))
  await user.click(await screen.findByRole('button', { name: /начать разговор/i }))
  await user.click(await screen.findByRole('button', { name: /назад/i }))
  expect(await screen.findByRole('button', { name: /начать разговор/i })).toBeInTheDocument()
})

test('новое сообщение вызывает scrollIntoView', async () => {
  const user = userEvent.setup()
  const original = Element.prototype.scrollIntoView
  const spy = vi.fn()
  // eslint-disable-next-line no-extend-native
  Element.prototype.scrollIntoView = spy
  try {
    render(Widget(steps))
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await user.click(await screen.findByRole('button', { name: /начать разговор/i }))
    expect(spy).toHaveBeenCalled()
  } finally {
    Element.prototype.scrollIntoView = original
  }
})
