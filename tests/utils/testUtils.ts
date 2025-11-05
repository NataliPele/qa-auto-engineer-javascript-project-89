import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'


export function setup(ui: React.ReactElement) {
  const utils = render(ui)
  const user = userEvent.setup()
  return { ...utils, user }
}
export async function pressEsc(user: ReturnType<typeof userEvent.setup>) {
  await user.keyboard('{Escape}')
}

export function withinModal(root: HTMLElement) {
  const modal = root.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement
  if (!modal) throw new Error('Modal not found')
  return { container: modal }
}

export const LONG_TEXT = 'x'.repeat(2000)
