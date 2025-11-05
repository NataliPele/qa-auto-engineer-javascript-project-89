import { screen } from '@testing-library/react'

export class FormUnderWidget {
  acceptRulesCell() {
    return screen.getByText(/принять правила/i).closest('tr')!.querySelector('td:last-child')!
  }
  emailCell() {
    return screen.getByText(/email/i).closest('tr')!.querySelector('td:last-child')!
  }
  passwordCell() {
    return screen.getByText(/пароль/i).closest('tr')!.querySelector('td:last-child')!
  }

  expectEmail(value: string) {
    expect(this.emailCell()).toHaveTextContent(value)
  }
  expectPassword(value: string) {
    expect(this.passwordCell()).toHaveTextContent(value)
  }
  expectAccepted(flag: boolean) {
    expect(this.acceptRulesCell()).toHaveTextContent(flag ? 'true' : 'false')
  }
}
