/* eslint-disable no-undef */
// __tests__/page-objects/ChatWidgetPO.js
import {
  setupUser,
  getToggleBtn,
  findDialog,
  findStartBtn,
  closeByX,
  closeByEsc,
} from '../utils/test-utils.js'
import { screen } from '@testing-library/react'

export class ChatWidgetPO {
  constructor() {
    this.user = setupUser()   // ← это обычный объект, не промис
    this.dialog = null
  }

  async open() {
    await this.user.click(getToggleBtn())
    this.dialog = await findDialog()
    return this
  }

  async closeByX() {
    await closeByX(this.user, this.dialog)
    return this
  }

  async closeByEsc() {
    await closeByEsc(this.user)
    return this
  }

  async start() {
    const startBtn = await findStartBtn()
    await this.user.click(startBtn)
    return this
  }

  async clickByText(rx) {
    const btn = screen.getByRole('button', { name: rx })
    await this.user.click(btn)
    return this
  }

  async expectButton(rx) {
    const btn = await screen.findByRole('button', { name: rx })
    expect(btn).toBeInTheDocument()
    return this
  }

  expectDialogPresent() {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    return this
  }

  expectDialogGone() {
    expect(screen.queryByRole('dialog')).toBeNull()
    return this
  }
}
