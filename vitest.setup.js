/* eslint-disable no-undef */
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {}
}

afterEach(() => {
  cleanup()
})

const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
beforeAll(() => {
  CSSStyleDeclaration.prototype.setProperty = function (prop, value, priority) {
    try {
      if (prop === 'border' && typeof value === 'string' && value.includes('var(')) {
        return
      }
    } catch { /* empty */ }
    return originalSetProperty.call(this, prop, value, priority)
  }
})

afterAll(() => {
  CSSStyleDeclaration.prototype.setProperty = originalSetProperty
})
