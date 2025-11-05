import React, { useState } from 'react'
import Widget from '@hexlet/chatbot-v2'
import steps from '@hexlet/chatbot-v2/example-steps'
import '@hexlet/chatbot-v2/styles'

const fallbackSteps = [
  {
    id: 'empty',
    message: 'Бот запущен без сценария. Это ок для теста 👍',
    end: true,
  },
]

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
    setForm({ ...form, [target.name]: value })
  }

  const handleBackToForm = () => {
    setSubmittingState('fillingForm')
  }

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

  const renderRow = (key) => (
    <tr key={key}>
      <td>{enToRus[key]}</td>
      <td>{form[key].toString()}</td>
    </tr>
  )

  const renderResult = () => {
    const keys = Object.keys(form).sort()
    return (
      <div className="m-3">
        <button type="button" className="btn btn-primary" onClick={handleBackToForm}>
          Назад
        </button>
        <table className="table">
          <tbody>{keys.map(renderRow)}</tbody>
        </table>
      </div>
    )
  }

  const renderForm = () => (
    <form className="m-3" onSubmit={handleSubmitForm} name="myForm">
      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="col-form-label">
          Email
        </label>
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
        <label htmlFor="password" className="col-form-label">
          Пароль
        </label>
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
        <label htmlFor="address" className="col-form-label">
          Адрес
        </label>
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
        <label htmlFor="city" className="col-form-label">
          Город
        </label>
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
        <label htmlFor="country" className="col-form-label">
          Страна
        </label>
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
