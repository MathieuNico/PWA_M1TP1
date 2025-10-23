# 🔧 Guide d'Installation - PWA Chat & Gallery

## ⚠️ Problème de Version Node.js

### Erreur Rencontrée

```
ERROR  Cannot start nuxt:  crypto.hash is not a function
```

### Cause

Nuxt 4.1.2 et Vite 7+ requièrent **Node.js >= 20.19.0 ou >= 22.12.0**  
Votre version actuelle : **Node.js 20.11.0**

## ✅ Solutions (Choisir une option)

### Option 1 : Mettre à Jour Node.js (Recommandé)

#### Avec NVM (Node Version Manager)

Si vous avez NVM installé :

```powershell
# Lister les versions disponibles
nvm list available

# Installer Node.js 22 LTS (recommandé)
nvm install 22

# Utiliser la nouvelle version
nvm use 22

# Vérifier
node --version
```

#### Sans NVM

1. Télécharger Node.js 22.x LTS depuis [nodejs.org](https://nodejs.org/)
2. Installer la nouvelle version
3. Redémarrer votre terminal
4. Vérifier la version :

```powershell
node --version
# Devrait afficher v22.x.x ou v20.19+
```

#### Puis relancer l'application

```powershell
# Nettoyer les caches
Remove-Item -Recurse -Force .nuxt, .output, node_modules/.cache

# Réinstaller les dépendances
npm install

# Démarrer le serveur dev
npm run dev
```

---

### Option 2 : Downgrade Nuxt et Vite (Alternative)

Si vous ne pouvez pas mettre à jour Node.js :

```powershell
# Downgrade vers des versions compatibles Node 20.11
npm install nuxt@3.13 vite@5 --save
npm install @vite-pwa/nuxt@0.9 --save

# Nettoyer et relancer
Remove-Item -Recurse -Force .nuxt, .output, node_modules/.cache
npm install
npm run dev
```

**Note** : Certaines fonctionnalités récentes de Nuxt 4 ne seront pas disponibles.

---

### Option 3 : Utiliser Docker (Pour déploiement)

Créer un `Dockerfile` :

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

Puis :

```powershell
# Build l'image
docker build -t pwa-chat-gallery .

# Lancer le conteneur
docker run -p 3000:3000 pwa-chat-gallery
```

---

## 📋 Vérifications Après Installation

Une fois Node.js mis à jour :

1. **Vérifier la version** :
   ```powershell
   node --version
   # Devrait être >= 20.19.0 ou >= 22.12.0
   ```

2. **Nettoyer les caches** :
   ```powershell
   Remove-Item -Recurse -Force .nuxt, .output, node_modules/.cache
   ```

3. **Réinstaller les dépendances** :
   ```powershell
   npm install
   ```

4. **Démarrer le serveur de développement** :
   ```powershell
   npm run dev
   ```

5. **Accéder à l'application** :
   - Ouvrir `http://localhost:3000` dans votre navigateur
   - Accepter les permissions caméra et notifications si demandées

---

## 🧪 Tests des Fonctionnalités PWA

### Tester la Caméra

1. Aller sur la page Réception
2. Cliquer sur "Prendre une photo"
3. Autoriser l'accès à la caméra
4. Capturer et valider la photo

### Tester les Notifications

1. Autoriser les notifications dans le navigateur
2. Prendre une photo → notification affichée
3. Envoyer un message dans le chat → notification affichée

### Tester le Mode Offline

1. Ouvrir DevTools (F12)
2. Aller dans **Application > Service Workers**
3. Vérifier que le SW est enregistré et actif
4. Aller dans **Network**, cocher "Offline"
5. Recharger la page
6. ✅ L'application devrait fonctionner offline !

---

## 🚀 Déploiement Production

### Build pour Production

```powershell
# Build l'application
npm run build

# Tester le build en local
npm run preview
```

### Déploiement sur VPS avec HTTPS

Voir le fichier [README.md](./README.md) section "Déploiement" pour :
- Configuration Nginx + Let's Encrypt
- Utilisation de PM2
- Docker deployment

---

## 🛠️ Dépannage

### Le serveur dev ne démarre pas

```powershell
# Tuer les processus Node
taskkill /F /IM node.exe

# Nettoyer complètement
Remove-Item -Recurse -Force .nuxt, .output, node_modules

# Réinstaller
npm install
npm run dev
```

### Erreurs TypeScript

Les erreurs TypeScript sur les imports de composants Vue sont normales en dev avec Nuxt (auto-import). Elles disparaissent au build.

### Service Worker ne se met pas à jour

```powershell
# En développement, nettoyer le cache du navigateur :
# Chrome DevTools > Application > Storage > Clear site data
```

---

## 📦 Versions Recommandées

- **Node.js** : >= 22.12.0 (LTS) ou >= 20.19.0
- **npm** : >= 10.x
- **Navigateur** : Chrome/Edge >= 90, Firefox >= 88, Safari >= 14

---

## 📞 Support

Si vous rencontrez d'autres problèmes :

1. Vérifier les logs de la console (F12)
2. Vérifier les permissions caméra/notifications
3. S'assurer d'être en HTTPS (ou localhost pour dev)
4. Consulter la documentation Nuxt : https://nuxt.com/

---

## ✅ Checklist Installation Rapide

- [ ] Mettre à jour Node.js >= 20.19.0 ou >= 22.12.0
- [ ] `npm install`
- [ ] Nettoyer les caches (`.nuxt`, `.output`)
- [ ] `npm run dev`
- [ ] Ouvrir `http://localhost:3000`
- [ ] Autoriser caméra + notifications
- [ ] Tester les fonctionnalités (login, chat, gallery, camera)
- [ ] Tester le mode offline (DevTools > Network > Offline)

Bon développement ! 🎉
