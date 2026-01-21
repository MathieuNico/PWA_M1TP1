# PWA Chat & Gallery - M1 TP Front

L'application est accessible en production sur : [https://vps106845.serveur-vps.net/](https://vps106845.serveur-vps.net/)

## 🚀 Fonctionnalités
- 💬 **Chat Temps Réel** : Échanges instantanés via WebSockets (Socket.io).
- 🏠 **Gestion de Salons** : Création et navigation entre différentes salles de discussion.
- 👤 **Profil Utilisateur** : Personnalisation du pseudo et de l'avatar (capture caméra ou upload).
- 📱 **PWA (Progressive Web App)** : Installable sur mobile/desktop avec support complet du mode hors-ligne.
- 📍 **Partage de Position** : Envoi de coordonnées GPS via Google Maps en un clic.
- 📸 **Partage de Photos** : Prise de vue directe et gestion d'une galerie d'images locale.
- 🔋 **Indicateur de Batterie** : Suivi de l'état de l'appareil intégré à l'interface.
- 🔔 **Notifications** : Alertes push locales pour ne manquer aucun message.

## 🛠 Stack Technique
- **Framework Core** : [Nuxt 4](https://nuxt.com/) (Vue.js 3 API Composition)
- **Bundler & Server** : Vite & Nitro Engine
- **Styling** : Vanilla CSS 3 (Design moderne, responsive et fluide)
- **Temps Réel** : Socket.io (Client-side integration)
- **PWA** : @vite-pwa/nuxt (Service Workers & Manifest)
- **Tests** : Vitest (Tests unitaires et de composants)

## 📦 Installation & Démarrage

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/MathieuNico/PWA_M1TP1.git
   cd PWA_M1TP1
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer en mode développement**
   ```bash
   npm run dev
   ```
   L'application sera disponible sur `http://localhost:3000`.

## 🧪 Qualité & Tests
Le projet intègre une suite de tests pour garantir la stabilité des fonctionnalités clés.

| Commande | Action |
| :--- | :--- |
| `npm run test` | Lance les tests unitaires avec Vitest |
| `npm run build` | Génère le build de production optimisé |
| `npm run preview` | Prévisualise localement le build de production |

## 📚 Documentation Additionnelle
Pour une compréhension approfondie de l'implémentation, consultez les guides suivants :

- 📘 [DOCS_ARCHITECTURE.md](./DOCS_ARCHITECTURE.md) : Analyse de la structure des composants et des flux.
- 🎨 [DOCS_RENDU.md](./DOCS_RENDU.md) : Choix des stratégies de rendu (SSR vs CSR) et mode offline.
- 📊 [DOCS_SEO.md](./DOCS_SEO.md) : Rapport de performance et optimisation pour les moteurs de recherche.

