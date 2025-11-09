/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic.js'
import { ChatWidgetPO } from './page-objects/ChatWidgetPO.js'

describe('Чат-бот: взаимодействия (PO)', () => {
  test('открытие / закрытие по крестику', async () => {
    render(Widget(steps))
    const widget = new ChatWidgetPO()
    await widget.open()
    widget.expectDialogPresent()
    await widget.closeByX()
    widget.expectDialogGone()
    expect(await screen.findByRole('button', { name: /открыть чат/i })).toBeInTheDocument()
  })

  test('открытие / закрытие по Esc', async () => {
    render(Widget(steps))
    const widget = new ChatWidgetPO()
    await widget.open()
    await widget.closeByEsc()
    widget.expectDialogGone()
  })

  test('после «Начать разговор» три варианта', async () => {
    render(Widget(steps))
    const widget = new ChatWidgetPO()
    await widget.open()
    await widget.start()
    await widget.expectButton(/сменить профессию|трудоустроиться/i)
    await widget.expectButton(/попробовать себя в it/i)
    await widget.expectButton(/я разработчик.*углубить.*знан/i)
  })
})
