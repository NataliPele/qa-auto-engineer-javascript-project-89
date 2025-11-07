/* eslint-disable no-undef */
import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom'

expect.extend(matchers)

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

const originalSetProperty = CSSStyleDeclaration.prototype.setProperty

beforeAll(() => {
  CSSStyleDeclaration.prototype.setProperty = function (prop, value, priority) {
    try {
      if (prop === 'border' && typeof value === 'string' && value.includes('var(')) {
        return
      }
    } catch {// noop 
      }
    return originalSetProperty.call(this, prop, value, priority)
  }
})

afterAll(() => {
  CSSStyleDeclaration.prototype.setProperty = originalSetProperty
})
