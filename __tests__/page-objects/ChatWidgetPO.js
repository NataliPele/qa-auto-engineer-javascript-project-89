/* eslint-disable no-undef */
import { screen, within } from '@testing-library/react'
import { setupUser, closeByX, closeByEsc } from '../utils/test-utils.js'

export class ChatWidgetPO {
  constructor() {
    this.user = setupUser()
  }

  getToggleButton() {
    return screen.getByRole('button', {
      name: /открыть чат|начать разговор/i,
    })
  }

  getDialog() {
    return screen.getByRole('dialog')
  }

  async open() {
    await this.user.click(await screen.findByRole('button', {
      name: /открыть чат|начать разговор/i,
    }))
  }

  async start() {
    await this.user.click(await screen.findByRole('button', {
      name: /начать разговор/i,
    }))
  }

  async clickByText(nameRe) {
    await this.user.click(await screen.findByRole('button', { name: nameRe }))
  }

  async dblClickToggle() {
    await this.user.dblClick(await screen.findByRole('button', {
      name: /открыть чат|начать разговор/i,
    }))
  }

  async clickButtonTwice(nameRe) {
    const btn = await screen.findByRole('button', { name: nameRe })
    await this.user.click(btn)
    try { await this.user.click(btn) } catch {} // ок
  }

  async closeByX() {
    const dialog = await screen.findByRole('dialog')
    await closeByX(this.user, dialog)
  }

  async closeByEsc() {
    await closeByEsc(this.user)
  }

  expectDialogPresent() {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  }

  expectDialogGone() {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  }

  expectButtonAbsent(nameRe) {
    expect(screen.queryByRole('button', { name: nameRe })).not.toBeInTheDocument()
  }

  expectHasButtons() {
    expect(screen.queryAllByRole('button').length).toBeGreaterThanOrEqual(1)
  }
}
