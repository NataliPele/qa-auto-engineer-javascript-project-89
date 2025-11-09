import '@testing-library/jest-dom'

const noop = () => {}

if (typeof window !== 'undefined') {
  if (window.HTMLElement && !window.HTMLElement.prototype.scrollIntoView) {
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      value: noop,
      writable: true,
      configurable: true,
    })
  }
  if (window.Element && !window.Element.prototype.scrollIntoView) {
    Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
      value: noop,
      writable: true,
      configurable: true,
    })
  }
}
