/* global expect */
import { screen } from '@testing-library/react'
import { setupUser } from '../utils/test-utils.js'

export class AppPO {
  constructor() {
    this.user = setupUser()
  }

  getEmailInput() {
    return screen.getByLabelText(/email/i)
  }

  getPasswordInput() {
    return screen.getByLabelText(/пароль/i)
  }

  getAddressInput() {
    return screen.getByLabelText(/адрес/i)
  }

  getCityInput() {
    return screen.getByLabelText(/город/i)
  }

  getCountrySelect() {
    return screen.getByLabelText(/страна/i)
  }

  getRulesCheckbox() {
    return screen.getByLabelText(/принять правила/i)
  }

  getSubmitButton() {
    return screen.getByRole('button', { name: /зарегистрироваться/i })
  }

  getBackButton() {
    return screen.getByRole('button', { name: /назад/i })
  }

  async fillForm({
    email = 'user@example.com',
    password = 'secret',
    address = 'Невский пр., 12',
    city = 'Санкт-Петербург',
    country = 'Россия',
    acceptRules = true,
  } = {}) {
    await this.user.type(this.getEmailInput(), email)
    await this.user.type(this.getPasswordInput(), password)
    await this.user.type(this.getAddressInput(), address)
    await this.user.type(this.getCityInput(), city)
    await this.user.selectOptions(this.getCountrySelect(), country)

    if (acceptRules) {
      await this.user.click(this.getRulesCheckbox())
    }
  }

  async submit() {
    await this.user.click(this.getSubmitButton())
  }

  async back() {
    await this.user.click(this.getBackButton())
  }

  async expectResultTable() {
    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()
  }
}
