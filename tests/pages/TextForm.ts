import { screen, within } from '@testing-library/react'
import { expect } from 'vitest'

const norm = (s: string | null | undefined) =>
  (s ?? '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()

export class FormUnderWidget {
  private get table() {
    return screen.getByRole('table')
  }

  private rowByLabel(label: string | RegExp) {
    const rows = within(this.table).getAllByRole('row')
    const re = typeof label === 'string'
      ? new RegExp(`^${label}(?:\\s|$)`, 'i')
      : label

    const row = rows.find(r => {
      const firstCell = within(r).queryAllByRole('cell')[0]
      return firstCell ? re.test(norm(firstCell.textContent)) : false
    })

    if (!row) {
      throw new Error(`Row not found for label: ${String(label)}`)
    }
    return row
  }

  private valueCell(label: string | RegExp): HTMLTableCellElement {
    const row = this.rowByLabel(label)
    const cells = within(row).getAllByRole('cell')
    if (cells.length < 2) {
      throw new Error(`No value cell for label: ${String(label)}`)
    }
    return cells[cells.length - 1] as HTMLTableCellElement
  }

  acceptRulesCell() { return this.valueCell(/принять правила/i) }
  emailCell()       { return this.valueCell(/email/i) }
  passwordCell()    { return this.valueCell(/пароль/i) }
  addressCell()     { return this.valueCell(/адрес/i) }
  cityCell()        { return this.valueCell(/город/i) }
  countryCell()     { return this.valueCell(/страна/i) }

  expectEmail(value: string) {
    expect(norm(this.emailCell().textContent)).toBe(value)
  }
  expectPassword(value: string) {
    expect(norm(this.passwordCell().textContent)).toBe(value)
  }
  expectAddress(value: string) {
    expect(norm(this.addressCell().textContent)).toBe(value)
  }
  expectCity(value: string) {
    expect(norm(this.cityCell().textContent)).toBe(value)
  }
  expectCountry(value: string) {
    expect(norm(this.countryCell().textContent)).toBe(value)
  }
  expectAccepted(flag: boolean) {
    expect(norm(this.acceptRulesCell().textContent)).toBe(flag ? 'true' : 'false')
  }
  async waitReady() {
    await screen.findByRole('table')
  }
}
