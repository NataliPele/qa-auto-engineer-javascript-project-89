import { screen, within } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import { withinModal } from '../utils/testUtils'

export class ChatWidget {
  constructor(private user: ReturnType<typeof userEvent.setup>) {}

  async open() {
    await this.user.click(screen.getByRole('button', { name: /открыть чат/i }))
    return this
  }

  modal() {
    const { container } = withinModal(document.body)
    return within(container)
  }

  header() {
    return this.modal().getByRole('heading', { name: /виртуальный помощник/i })
  }

  tryGetInput() {
    const q = this.modal().queryByRole('textbox')
    return q ?? null
  }

  async typeMessage(text: string) {
    const input = this.tryGetInput()
    if (!input) throw new Error('Textbox not present in modal')
    await this.user.type(input, text)
    return this
  }

  async startConversation() {
    const btn = this.modal().getByRole('button', { name: /начать разговор/i })
    await this.user.click(btn)
    return this
  }

  async closeWithEsc() {
    await this.user.keyboard('{Escape}')
  }

  async closeByX() {
    const btn = this.modal().getByRole('button', { name: /close/i })
    await this.user.click(btn)
  }
}
