# Python Path — Learn by building

A browser-based Python learning platform with guided lessons, runnable examples, quizzes, project challenges, and local progress tracking.

**Live site:** https://issikaaymeric.github.io/Python-Tutorial/

## Features

- **12 guided lessons** covering Python fundamentals, control flow, data structures, functions, exceptions, files, strings, OOP, modules, algorithms, and testing.
- **Interactive Python playground** powered by Pyodide (WebAssembly) in a dedicated Web Worker.
- **Knowledge checks** with instant feedback and explanations.
- **Project challenges** with beginner, intermediate, and advanced levels.
- **Progress tracking** stored in the current browser using `localStorage`.
- **English and French** interface and lesson content.
- **Light and dark themes**, lesson search, keyboard-friendly navigation, and responsive layouts.
- Static hosting on GitHub Pages; no application server or account is required.

## Getting started

1. Open the [live application](https://issikaaymeric.github.io/Python-Tutorial/).
2. Choose **FR** or **EN** in the top navigation to switch languages.
3. Select a lesson from the learning path.
4. Edit the sample code and choose **Run code** (or press `Ctrl+Enter` / `Cmd+Enter` in the editor).
5. Complete the knowledge check and mark the lesson complete.
6. Visit **My progress** to review completion on this device.

The first Python execution downloads the Pyodide runtime from its CDN, so an internet connection is required for the initial load.

## Local development

This is a static site. You can serve the repository root with any static HTTP server. For example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

Do not open `index.html` directly as a `file://` URL: browser workers and WebAssembly assets generally require an HTTP(S) origin.

## Architecture

- `index.html` — responsive application UI, curriculum, translations, quizzes, projects, and progress state.
- `python-worker.js` — browser worker that loads Pyodide and executes Python code.
- `.github/workflows/validate.yml` — basic JavaScript and feature-presence checks on pushes and pull requests.

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
- Projets pratiques de niveaux débutant, intermédiaire et avancé.
- Suivi de progression enregistré dans le navigateur avec `localStorage`.
- Interface et contenu pédagogique en anglais et en français.
- Thèmes clair et sombre, recherche de leçons et interface adaptative.
- Hébergement statique avec GitHub Pages, sans serveur applicatif ni compte obligatoire.

## Utilisation

1. Ouvrez le [site](https://issikaaymeric.github.io/Python-Tutorial/).
2. Choisissez **FR** ou **EN** dans la barre supérieure.
3. Sélectionnez une leçon.
4. Modifiez l’exemple puis cliquez sur **Exécuter** (ou utilisez `Ctrl+Entrée` / `Cmd+Entrée`).
5. Répondez au quiz et marquez la leçon comme terminée.
6. Consultez **Ma progression** pour suivre votre avancement sur cet appareil.

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
