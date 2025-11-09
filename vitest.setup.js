// vitest.setup.js
import '@testing-library/jest-dom'

// Полная и безопасная заглушка scrollIntoView для JSDOM
const noop = () => {}

if (typeof window !== 'undefined') {
  // для всех элементных нод
  if (window.HTMLElement && !window.HTMLElement.prototype.scrollIntoView) {
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      value: noop,
      writable: true,
      configurable: true,
    })
  }
  // на случай, если пакет обращается через Element.prototype
  if (window.Element && !window.Element.prototype.scrollIntoView) {
    Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
      value: noop,
      writable: true,
      configurable: true,
    })
  }
}
