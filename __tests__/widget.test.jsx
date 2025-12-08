/* eslint-env vitest */
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.basic.js'
import {
  stepsEmpty,
  stepsNoWelcome,
  stepsGhostTarget,
  stepsEmptyStep,
  stepsMinimal,
} from '../__fixtures__/steps.edge.js'
import { WidgetPO } from './page-objects/WidgetPO.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Виджет', () => {
  describe('smoke', () => {
    test('рендерится и открывается (видна кнопка "Начать разговор")', async () => {
      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      await widget.expectButton(/начать разговор/i)
    })
  })

  describe('взаимодействия (PO)', () => {
    test('открытие / закрытие по крестику', async () => {
      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      widget.expectDialogPresent()

      await widget.closeByX()
      widget.expectDialogGone()

      await widget.expectButton(/открыть чат|начать разговор/i)
    })

    test('открытие / закрытие по Esc', async () => {
      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      await widget.closeByEsc()

      widget.expectDialogGone()
    })

    test('после «Начать разговор» три варианта', async () => {
      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      await widget.start()

      await widget.expectButton(/сменить профессию|трудоустроиться/i)
      await widget.expectButton(/попробовать себя в it/i)
      await widget.expectButton(/я разработчик.*углубить.*знан/i)
    })

    test('переход на обычный существующий шаг', async () => {
      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      await widget.start()

      await widget.clickByText(/попробовать себя в it/i)
      await screen.findByText(/подготовительные курсы/i)
    })

    test('при появлении нового сообщения происходит скролл к нему', async () => {
      const scrollIntoViewMock = vi.fn()
      globalThis.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

      render(Widget(steps))
      const widget = new WidgetPO()

      await widget.open()
      await widget.start()

      await widget.clickByText(/попробовать себя в it/i)

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled()
      })
    })

    describe('крайние случаи (PO)', () => {
      test('пустой набор шагов: виджет открывается, не падает', async () => {
        render(Widget(stepsEmpty))
        const widget = new WidgetPO()

        await widget.open()

        widget.expectDialogPresent()
        widget.expectButtonAbsent(/начать разговор/i)
      })

      test('нет welcome-шага: открытие диалога без падения', async () => {
        render(Widget(stepsNoWelcome))
        const widget = new WidgetPO()

        await widget.open()

        widget.expectDialogPresent()
      })

      test('переход на несуществующий шаг: не бросает ошибок, диалог остаётся живым', async () => {
        render(Widget(stepsGhostTarget))
        const widget = new WidgetPO()

        await widget.open()
        await widget.start()
        await widget.clickByText(/дальше/i)

        await waitFor(() => {
          widget.expectDialogPresent()
        })
      })

      test('шаг без сообщений и кнопок: не падает, диалог остаётся', async () => {
        render(Widget(stepsEmptyStep))
        const widget = new WidgetPO()

        await widget.open()
        await widget.start()

        await waitFor(() => {
          widget.expectDialogPresent()
        })

        widget.expectHasButtons()
      })

      test('быстрые/двойные клики и повторное закрытие не ломают виджет', async () => {
        render(Widget(stepsMinimal))
        const widget = new WidgetPO()

        await widget.dblClickToggle()
        widget.expectDialogPresent()

        await widget.clickButtonTwice(/начать разговор/i)
        await widget.clickButtonTwice(/остаться/i)

        await widget.closeByEsc()
        await widget.closeByEsc()

        await waitFor(() => {
          widget.expectDialogGone()
        })
      })
    })
  })
})
