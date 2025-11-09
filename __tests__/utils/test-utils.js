import { screen, within } from '@testing-library/react'
import * as userEvent from '@testing-library/user-event'

export const setupUser = () =>
  (userEvent.default ? userEvent.default.setup() : userEvent.setup())

export const findToggleBtn = () =>
  screen.findByRole('button', { name: /открыть чат/i })

export const findDialog = () => screen.findByRole('dialog')

export const findStartBtn = () =>
  screen.findByRole('button', { name: /начать разговор/i })

export const openChat = async (user) => {
  await user.click(findToggleBtn())
  return await findDialog()
}

export const startConversation = async (user) => {
  await openChat(user)
  const startBtn = await findStartBtn()
  await user.click(startBtn)
}

export const getBackButton = () =>
  screen.queryByRole('button', { name: /вернуться в начало/i })
  ?? screen.queryByRole('button', { name: /верни меня в начало/i })
  ?? screen.queryByRole('button', { name: /вернуться назад/i })

export const closeByX = async (user, dialog) => {
  const byRole = within(dialog).queryByRole('button', { name: /×|закрыть|close/i })
  const byLabel = within(dialog).queryByLabelText(/закрыть|close/i)
  const closeBtn = byRole ?? byLabel
  if (closeBtn) await user.click(closeBtn)
}

export const closeByEsc = async (user) => {
  await user.keyboard('{Escape}')
}
