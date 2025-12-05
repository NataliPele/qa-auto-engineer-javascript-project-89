import * as userEvent from '@testing-library/user-event'

export const setupUser = () =>
  (userEvent.default ? userEvent.default.setup() : userEvent.setup())

// Закрытие диалога по крестику
export const closeByX = async (user, dialog) => {
  if (!dialog) return

  const closeBtn =
    dialog.querySelector('button[aria-label="close"]')
    || dialog.querySelector('button[aria-label="закрыть"]')
    || dialog.querySelector('button')?.closest('[data-testid="close"]')

  if (closeBtn) {
    await user.click(closeBtn)
  }
}

// Закрытие диалога по Escape
export const closeByEsc = async (user) => {
  await user.keyboard('{Escape}')
}
