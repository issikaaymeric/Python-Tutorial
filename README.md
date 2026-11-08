# Python Path — Learn by building

A browser-based Python learning platform with guided lessons, runnable examples, quizzes, project challenges, and local progress tracking.

**Live site:** https://issikaaymeric.github.io/Python-Tutorial/

## Features

- **12 guided lessons** covering Python fundamentals, control flow, data structures, functions, exceptions, files, strings, OOP, modules, algorithms, and testing.
- **Interactive Python playground** powered by Pyodide (WebAssembly) in a dedicated Web Worker.
- **Knowledge checks** with instant feedback and explanations.
- **12 automatic coding challenges** with Python assertions, retry feedback, and saved completion status.
- **Guided practice flow**: understand the task, write a solution, then run the tests.
- **Project challenges** with beginner, intermediate, and advanced levels, each with a runnable starter template.
- **Automatic code drafts** saved locally per lesson and project, so unfinished work survives navigation and reloads.
- **Personal learning dashboard** with weekly goals, an activity calendar, current streaks, achievements, and a clickable lesson roadmap.
- Learning activity is recorded when a lesson is completed, a quiz is answered correctly, or a coding challenge is passed.
- **Progress tracking** stored in the current browser using `localStorage`.
- A warm, colorful learning interface with light mode enabled by default, a saved dark-mode option, responsive layouts, and reduced-motion support.
- **English and French** interface and lesson content.
- **Light and dark themes**, lesson search, keyboard-friendly navigation, and responsive layouts.
- Static hosting on GitHub Pages; no application server or account is required.

## Getting started

1. Open the [live application](https://issikaaymeric.github.io/Python-Tutorial/).
2. Choose **FR** or **EN** in the top navigation to switch languages.
3. Select a lesson from the learning path.
4. Edit the sample code and choose **Run code** (or press `Ctrl+Enter` / `Cmd+Enter` in the editor).
5. Complete the knowledge check and try the lesson's automatic coding challenge.
6. Use the challenge feedback to correct your solution; passed challenges are saved.
7. Visit **Learning dashboard** to review weekly activity, streaks, achievements, lesson completion, and your next step.

The first Python execution downloads the Pyodide runtime from its CDN, so an internet connection is required for the initial load.

## Local development

This is a static site. You can serve the repository root with any static HTTP server. For example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

Run the browser regression suite with:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

The browser tests use a deterministic worker stub to verify the interface-to-worker message flow. They do not download or benchmark the full Pyodide runtime.

Do not open `index.html` directly as a `file://` URL: browser workers and WebAssembly assets generally require an HTTP(S) origin.

## Architecture

- `index.html` — responsive application UI, curriculum, translations, quizzes, projects, and progress state.
- `python-worker.js` — browser worker that loads Pyodide and executes Python code.
- `.github/workflows/validate.yml` — JavaScript checks, feature-presence checks, and Chromium browser regression tests on pushes and pull requests.
- `tests/ide.spec.js` and `playwright.config.js` — automated IDE tests for editing, local draft persistence, execution feedback, challenge completion/reset, and the plain-text fallback.

## Important limitations

- Progress is local to one browser/device. There is currently no account system or cloud synchronization.
- The first Python run requires an internet connection to load Pyodide.
- The playground is intended for educational snippets, not long-running or production workloads. Executions are terminated after 10 seconds.
- Python file operations in the playground use the runtime's virtual filesystem; they do not read or write files on the learner's computer.
- Browser-based execution is not a substitute for a hardened server-side sandbox. Do not use this playground to run sensitive or untrusted production workloads.

## Deployment

The site is published with GitHub Pages from the repository's configured publishing source. Changes merged into `main` are picked up by the Pages deployment process.

---

# Version française

Python Path est une plateforme d’apprentissage de Python dans le navigateur. Elle propose des leçons guidées, des exemples exécutables, des quiz, des projets pratiques et un suivi local de la progression.

## Fonctionnalités

- 12 leçons guidées, des bases de Python aux tests et bonnes pratiques.
- Éditeur Python interactif propulsé par Pyodide et WebAssembly.
- Quiz avec correction et explications immédiates.
- Projets pratiques de niveaux débutant, intermédiaire et avancé, avec du code de départ exécutable.
- 12 défis de programmation avec tests automatiques, conseils de correction et suivi des réussites.
- Parcours de pratique guidé : comprendre, coder, puis vérifier sa solution.
- Tableau de bord personnel avec objectifs hebdomadaires, calendrier d’activité, séries de jours d’apprentissage, réussites et parcours de leçons interactif.
- L’activité est enregistrée lorsqu’une leçon est terminée, qu’un quiz reçoit une bonne réponse ou qu’un défi de programmation est réussi.
- Suivi de progression enregistré dans le navigateur avec `localStorage`.
- Interface et contenu pédagogique en anglais et en français.
- Interface chaleureuse et colorée, thème clair par défaut, thème sombre mémorisé, recherche de leçons et interface adaptative.
- Hébergement statique avec GitHub Pages, sans serveur applicatif ni compte obligatoire.

## Utilisation

1. Ouvrez le [site](https://issikaaymeric.github.io/Python-Tutorial/).
2. Choisissez **FR** ou **EN** dans la barre supérieure.
3. Sélectionnez une leçon.
4. Modifiez l’exemple puis cliquez sur **Exécuter** (ou utilisez `Ctrl+Entrée` / `Cmd+Entrée`).
5. Répondez au quiz puis réalisez le défi de programmation avec ses tests automatiques.
6. Consultez le **Tableau de bord** pour suivre votre activité hebdomadaire, vos séries, vos réussites et votre prochaine leçon.

Le premier lancement de Python télécharge Pyodide depuis son CDN. Une connexion Internet est donc nécessaire.

## Développement local

Lancez un serveur HTTP statique depuis la racine du dépôt :

```bash
python -m http.server 8000
```

Puis ouvrez http://localhost:8000. Évitez d'ouvrir le fichier directement avec une URL `file://`, car les Web Workers et les ressources WebAssembly nécessitent généralement une origine HTTP(S).

## Limites

- La progression n'est pas synchronisée entre plusieurs appareils.
- Le premier lancement nécessite Internet.
- Les exécutions sont interrompues après 10 secondes.
- Les fichiers Python utilisent un système de fichiers virtuel et ne touchent pas aux fichiers de l'ordinateur.
- Cet environnement pédagogique ne remplace pas un bac à sable serveur renforcé pour l'exécution de code non fiable en production.
