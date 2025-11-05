/* eslint-disable no-undef */
// vitest.setup.js
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom'

expect.extend(matchers)

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
