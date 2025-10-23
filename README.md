# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

# 📱 PWA Chat & Gallery

Application Progressive Web App (PWA) complète avec fonctionnalités de chat, caméra, galerie photos, notifications et mode offline.

## 🎯 Fonctionnalités

### ✅ Implémentées

- **Page Home** : Présentation du projet et des technologies utilisées
- **Page Réception** : 
  - Connexion avec pseudo et photo de profil (via caméra)
  - Création et gestion de salles de discussion (rooms)
  - Liste des rooms disponibles
- **Page Room (Chat)** :
  - Envoi de messages texte
  - Partage de photos via caméra
  - Historique des conversations persistant
  - Interface chat moderne avec avatars
- **Page Galerie** :
  - Affichage de toutes les photos capturées
  - Téléchargement des photos
  - Suppression individuelle ou complète
  - Métadonnées (date, salle d'origine)
- **Caméra** :
  - Accès à la caméra via getUserMedia API
  - Capture de photos
  - Prévisualisation avant validation
- **Notifications** :
  - Demande de permission au démarrage
  - Notifications lors de prise de photo
  - Notifications lors d'envoi de messages
- **Mode Offline** :
  - Service Worker avec Workbox
  - Cache automatique des assets (JS, CSS, images)
  - Fonctionnement complet offline avec localStorage
- **PWA Manifest** :
  - Installation sur mobile et desktop
  - Icônes adaptatives
  - Mode standalone

### 📦 Stockage LocalStorage

L'application utilise localStorage pour persister les données :

- `pwa_user` : Profil utilisateur (pseudo + avatar)
- `pwa_rooms` : Liste des salles de discussion
- `pwa_messages_{roomId}` : Messages de chaque salle
- `pwa_gallery` : Collection de toutes les photos

## 🛠️ Technologies Utilisées

- **Vue 3** : Framework JavaScript réactif avec Composition API
- **Nuxt** : Framework SSR/SSG pour Vue
- **@vite-pwa/nuxt** : Module PWA avec Workbox pour Nuxt
- **TypeScript** : Typage statique
- **Camera API** : getUserMedia() pour accès caméra
- **Notifications API** : Notifications push système
- **Service Worker** : Mode offline et cache
- **localStorage** : Stockage persistant client-side

## 🚀 Installation et Lancement

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

**Note** : Pour tester les fonctionnalités PWA (caméra, notifications) en développement :
- Utilisez HTTPS (ou localhost est autorisé)
- Acceptez les permissions caméra et notifications dans le navigateur

### Build Production

```bash
# Build pour production
npm run build

# Preview du build
npm run preview
```

### Génération statique

```bash
# Générer un site statique
npm run generate
```

## 📱 Utilisation

### 1. Page d'accueil
- Présentation du projet
- Cliquer sur "Commencer" pour accéder à la réception

### 2. Connexion
- Entrer un pseudo
- Prendre une photo de profil (optionnel)
- Se connecter

### 3. Gestion des Salles
- Créer une nouvelle salle avec nom et description
- Rejoindre une salle existante
- Supprimer une salle

### 4. Chat
- Envoyer des messages texte
- Cliquer sur l'icône caméra pour prendre une photo
- Les photos sont automatiquement ajoutées à la galerie

### 5. Galerie
- Voir toutes les photos capturées
- Cliquer sur une photo pour l'agrandir
- Télécharger ou supprimer des photos

## 🔐 Permissions Requises

- **Caméra** : Pour capturer des photos de profil et dans les chats
- **Notifications** : Pour recevoir des notifications d'événements

## 📂 Structure du Projet

```
app/
├── app.vue                      # Point d'entrée avec routing
├── components/
│   ├── HomePage.vue             # Page d'accueil
│   ├── ReceptionPage.vue        # Connexion + liste rooms
│   ├── RoomPage.vue             # Salle de chat
│   ├── GalleryPage.vue          # Galerie photos
│   └── CameraCapture.vue        # Composant caméra
├── modules/
│   └── socket-io.ts             # Module Socket.IO (optionnel)
└── plugins/
    └── socket.client.ts         # Plugin Socket.IO client

public/
├── icons/
│   ├── icon-192x192.png         # Icône PWA 192px
│   └── icon-512x512.png         # Icône PWA 512px
├── favicon.ico
└── robots.txt

nuxt.config.ts                   # Configuration Nuxt + PWA
package.json
tsconfig.json
README.md
```

## 🌐 Déploiement (HTTPS Requis)

Pour le déploiement en production, l'application **doit être servie via HTTPS** pour que les APIs Caméra et Notifications fonctionnent.

### Options de déploiement :

#### 1. Netlify / Vercel (Recommandé)
```bash
npm run generate
# Déployer le dossier .output/public
```

#### 2. VPS avec Nginx + Let's Encrypt

```bash
# Build
npm run build

# Sur le serveur VPS
# Installer Node.js et PM2
npm install -g pm2

# Démarrer l'application
pm2 start npm --name "pwa-chat" -- run preview
pm2 save
pm2 startup
```

**Configuration Nginx avec SSL** :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## 🧪 Tester le Mode Offline

1. Ouvrir l'application dans Chrome/Edge
2. Ouvrir DevTools (F12)
3. Aller dans Application > Service Workers
4. Vérifier que le SW est enregistré et actif
5. Cocher "Offline" dans l'onglet Network
6. Recharger la page → L'application fonctionne offline !

## 📝 Notes Importantes

- Les données sont stockées **localement** dans le navigateur (localStorage)
- Effacer les données du navigateur supprimera toutes les conversations et photos
- Les photos sont stockées en base64 dans localStorage (limite ~5-10MB selon navigateur)
- Pour production, considérer IndexedDB pour stocker plus de photos

## 🐛 Troubleshooting

### La caméra ne fonctionne pas
- Vérifier que l'application est servie en HTTPS (ou localhost)
- Vérifier les permissions dans les paramètres du navigateur
- Essayer un autre navigateur (Chrome/Edge recommandés)

### Les notifications ne s'affichent pas
- Vérifier que les permissions notifications sont accordées
- Les notifications ne fonctionnent pas en navigation privée
- Sur mobile, vérifier les paramètres système

### Le Service Worker ne se met pas à jour
- Ouvrir DevTools > Application > Service Workers
- Cliquer sur "Unregister" puis recharger
- En dev : vérifier que `devOptions.enabled: true`

## 📄 Licence

Projet académique - M1 TP1

## 👨‍💻 Auteur

PWA Chat & Gallery © 2025

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
