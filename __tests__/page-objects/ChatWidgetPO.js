/* eslint-disable no-undef */
import { screen, within } from '@testing-library/react'
import { setupUser, closeByX, closeByEsc } from '../utils/test-utils.js'

export class ChatWidgetPO {
  constructor() {
    this.user = setupUser()
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
    // первый клик — по найденной кнопке
    const first = await screen.findByRole('button', { name: nameRe })
    await this.user.click(first)

    // второй клик — по оставшейся кнопке, если она ещё есть
    const second = screen.queryByRole('button', { name: nameRe })
    if (second) {
      await this.user.click(second)
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
    const btn = await screen.findByRole('button', { name: nameRe })
    expect(btn).toBeInTheDocument()
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
