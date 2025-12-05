### Hexlet tests and linter status:
[![Actions Status](https://github.com/NataliPele/qa-auto-engineer-javascript-project-89/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/NataliPele/qa-auto-engineer-javascript-project-89/actions)

### Project CI and Quality:
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=NataliPele_qa-auto-engineer-javascript-project-89&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=NataliPele_qa-auto-engineer-javascript-project-89)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=NataliPele_qa-auto-engineer-javascript-project-89&metric=coverage)](https://sonarcloud.io/summary/new_code?id=NataliPele_qa-auto-engineer-javascript-project-89)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=NataliPele_qa-auto-engineer-javascript-project-89&metric=bugs)](https://sonarcloud.io/summary/new_code?id=NataliPele_qa-auto-engineer-javascript-project-89)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=NataliPele_qa-auto-engineer-javascript-project-89&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=NataliPele_qa-auto-engineer-javascript-project-89)

Описание проекта
Проект создан в рамках курса «Инженер по автоматизации тестирования на JavaScript» на платформе Hexlet.io.
Цель - протестировать готовый React-виджет чат-бота, встроенный в веб-страницу.
Тесты проверяют корректность работы интерфейса, навигации по шагам, устойчивость к ошибкам и корректную интеграцию виджета в стороннее React-приложение.
__________________________________________________________________________________________
Используемые технологии

Основной стек:
React + Vite — создание и запуск тестового окружения;
Vitest + React Testing Library — написание и исполнение тестов;
GitHub Actions — CI/CD для автоматического запуска тестов;
SonarCloud — анализ качества кода и покрытие тестами;
ESLint — статический анализ кода.

Особенности проекта

Тестируются готовые компоненты библиотеки, а не свой код;
Использован подход Page Object для изоляции логики тестов;
Проверена интеграция чат-бота в внешнее приложение (компонент App).

___________________________________________________________________________________________
Как собрать и запустить проект
1. Клонировать репозиторий
git clone https://github.com/NataliPele/qa-auto-engineer-javascript-project-89.git
cd qa-auto-engineer-javascript-project-89
2. Установить зависимости
npm ci
3. Запустить dev-окружение
npm run dev
После запуска открой в браузере http://localhost:5173 — отобразится форма с интегрированным чат-ботом.
4. Запустить тесты
npm test
