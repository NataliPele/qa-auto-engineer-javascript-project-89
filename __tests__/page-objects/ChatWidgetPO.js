/* eslint-disable no-undef */
import { render, screen, within } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'
import steps from '../../__fixtures__/steps.basic.js'
import { setupUser, closeByX, closeByEsc } from '../utils/test-utils.js'

export class ChatWidgetPO {
  constructor() {
    this.user = setupUser()
  }

  // ===== РЕНДЕР =====

  renderBasic() {
    render(Widget(steps))
  }

  // ===== ЭЛЕМЕНТЫ =====

  getToggleButton() {
    return screen.getByRole('button', {
      name: /открыть чат|начать разговор/i,
    })
  }

  getDialog() {
    return screen.getByRole('dialog')
  }

  getStartButton() {
    return screen.getByRole('button', { name: /начать разговор/i })
  }

  // ===== ДЕЙСТВИЯ =====

  async open() {
    const toggleBtn = await screen.findByRole('button', {
      name: /открыть чат|начать разговор/i,
    })
    await this.user.click(toggleBtn)
  }

  async start() {
    const startBtn = await screen.findByRole('button', { name: /начать разговор/i })
    await this.user.click(startBtn)
  }

  async startDialog() {
    await this.start()
  }

  async closeByX() {
    const dialog = await screen.findByRole('dialog')
    await closeByX(this.user, dialog)
  }

  async closeByEsc() {
    await closeByEsc(this.user)
  }

  async dblClickToggle() {
    const toggleBtn = await screen.findByRole('button', {
      name: /открыть чат|начать разговор/i,
    })
    await this.user.dblClick(toggleBtn)
  }

  async clickButtonTwice(nameRe) {
    const btn = await screen.findByRole('button', { name: nameRe })

    await this.user.click(btn)
    try {
      await this.user.click(btn)
    } catch {
    }
  }

  async clickByText(textRe) {
    const btn = await screen.findByRole('button', { name: textRe })
    await this.user.click(btn)
  }

  // ===== ОЖИДАНИЯ =====

  expectDialogPresent() {
    expect(this.getDialog()).toBeInTheDocument()
  }

  expectDialogGone() {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  }

  async expectButton(nameRe) {
    expect(
      await screen.findByRole('button', { name: nameRe }),
    ).toBeInTheDocument()
  }

  expectButtonAbsent(nameRe) {
    expect(
      screen.queryByRole('button', { name: nameRe }),
    ).not.toBeInTheDocument()
  }

  expectHasButtons() {
    const dialog = this.getDialog()
    const buttons = within(dialog).queryAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  }
}
