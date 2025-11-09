/* eslint-disable no-undef */
import {
  setupUser,
  findToggleBtn,
  findDialog,
  findStartBtn,
  closeByX,
  closeByEsc,
} from '../utils/test-utils.js'
import { screen } from '@testing-library/react'

export class ChatWidgetPO {
  constructor() {
    this.user = setupUser()
    this.dialog = null
  }

  async open() {
    const btn = await findToggleBtn()
    await this.user.click(btn)
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
