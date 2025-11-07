import React, { useState } from 'react'
import Widget from '@hexlet/chatbot-v2'
import steps from './steps.basic.js'

const fallbackSteps = [
  { id: 'empty', message: 'Бот запущен без сценария дл теста', end: true },
]

const EMPTY_PLACEHOLDER = '—'

const asCellText = (v) => {
  if (v == null) return EMPTY_PLACEHOLDER
  const s = typeof v === 'boolean' ? String(v) : String(v)
  return s === '' ? EMPTY_PLACEHOLDER : s
}

const asCellAria = (v) => {
  if (v == null) return ' '
  if (typeof v === 'boolean') return String(v)
  const s = String(v).trim()
  return s === '' ? ' ' : s
}

const App = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    city: '',
    country: '',
    address: '',
    acceptRules: false,
  })
  const [submittingState, setSubmittingState] = useState('fillingForm')

  const handleChangeField = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm((prev) => ({ ...prev, [target.name]: value }))
  }

  const handleBackToForm = () => setSubmittingState('fillingForm')

  const handleSubmitForm = (e) => {
    e.preventDefault()
    setSubmittingState('submitted')
  }

  const enToRus = {
    email: 'Email',
    password: 'Пароль',
    city: 'Город',
    country: 'Страна',
    address: 'Адрес',
    acceptRules: 'Принять правила',
  }

  const renderRow = (key) => {
    const rus = enToRus[key]
    const ariaValue = asCellAria(form[key])
    const label = `${rus}${ariaValue === ' ' ? '\u00A0' : ' ' + ariaValue}`
  
    return (
      <tr key={key} role="row" aria-label={label}>
        <td role="cell">{rus}</td>
        <td role="cell">{asCellText(form[key])}</td>
      </tr>
    )
  }

  const renderResult = () => {
    const keys = Object.keys(form).sort()
    return (
      <div className="m-3" role="region" aria-label="Результат отправки формы">
        <button type="button" className="btn btn-primary" onClick={handleBackToForm}>
          Назад
        </button>
        <table className="table" role="table" aria-label="Итоги формы">
          <tbody>{keys.map(renderRow)}</tbody>
        </table>
      </div>
    )
  }

  const renderForm = () => (
    <form className="m-3" onSubmit={handleSubmitForm} name="myForm">
      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="col-form-label">Email</label>
        <input
          autoComplete="on"
          type="email"
          name="email"
          onChange={handleChangeField}
          value={form.email}
          className="form-control"
          id="email"
          placeholder="Email"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="password" className="col-form-label">Пароль</label>
        <input
          autoComplete="on"
          type="password"
          onChange={handleChangeField}
          value={form.password}
          name="password"
          className="form-control"
          id="password"
          placeholder="Пароль"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="address" className="col-form-label">Адрес</label>
        <textarea
          type="text"
          name="address"
          value={form.address}
          onChange={handleChangeField}
          className="form-control"
          id="address"
          placeholder="Невский проспект, 12"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="city" className="col-form-label">Город</label>
        <input
          autoComplete="on"
          type="text"
          name="city"
          onChange={handleChangeField}
          value={form.city}
          className="form-control"
          id="city"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="country" className="col-form-label">Страна</label>
        <select
          id="country"
          name="country"
          onChange={handleChangeField}
          className="form-control"
          value={form.country}
        >
          <option value="">Выберите</option>
          <option value="Аргентина">Аргентина</option>
          <option value="Россия">Россия</option>
          <option value="Китай">Китай</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <div className="form-check">
          <label className="form-check-label" htmlFor="rules">
            <input
              autoComplete="on"
              id="rules"
              name="acceptRules"
              className="form-check-input"
              onChange={handleChangeField}
              type="checkbox"
              checked={form.acceptRules}
            />
            Принять правила
          </label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Зарегистрироваться
      </button>
    </form>
  )

  const finalSteps = Array.isArray(steps) && steps.length > 0 ? steps : fallbackSteps

  return (
    <>
      {submittingState === 'fillingForm' ? renderForm() : renderResult()}
      {Widget(finalSteps)}
    </>
  )
}

export default App
