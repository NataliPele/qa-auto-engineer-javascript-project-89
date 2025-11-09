/* eslint-disable no-undef */
import { screen, within } from '@testing-library/react'
import { setupUser } from '../utils/test-utils.js'

export class AppPO {
  constructor() {
    this.user = setupUser()
  }

  async fillForm({
    email = 'user@example.com',
    password = 'secret',
    address = 'Невский пр., 12',
    city = 'Санкт-Петербург',
    country = 'Россия',
    acceptRules = true,
  } = {}) {
    await this.user.type(screen.getByLabelText(/email/i), email)
    await this.user.type(screen.getByLabelText(/пароль/i), password)
    await this.user.type(screen.getByLabelText(/адрес/i), address)
    await this.user.type(screen.getByLabelText(/город/i), city)
    await this.user.selectOptions(screen.getByLabelText(/страна/i), country)
    if (acceptRules) await this.user.click(screen.getByLabelText(/принять правила/i))
    return this
  }

  async submit() {
    await this.user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))
    return this
  }

  async expectResultTable() {
    const table = await screen.findByRole('table')
    const tbody = within(table).getByRole('rowgroup')
    expect(tbody).toBeInTheDocument()
    return this
  }

  async back() {
    await this.user.click(screen.getByRole('button', { name: /назад/i }))
    return this
  }
}
