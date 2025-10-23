# ⚡ Quick Start - Mise à Jour Node.js

## 🎯 Solution Rapide

Votre projet requiert **Node.js >= 20.19.0** ou **>= 22.12.0**  
Vous avez actuellement : **Node.js 20.11.0**

---

## Option 1 : Avec NVM (Recommandé) ⭐

### 1. Vérifier si NVM est installé

```powershell
nvm version
```

Si vous obtenez une version, NVM est installé → passez à l'étape 3.

### 2. Si NVM n'est pas installé

Télécharger **nvm-windows** :  
👉 https://github.com/coreybutler/nvm-windows/releases

- Télécharger `nvm-setup.exe`
- Installer (suivre l'assistant)
- **Redémarrer PowerShell**

### 3. Installer Node.js 22 LTS

```powershell
# Lister les versions disponibles
nvm list available

# Installer Node.js 22 (LTS)
nvm install 22

# Utiliser cette version
nvm use 22

# Vérifier
node --version
# Devrait afficher v22.x.x
```

### 4. Relancer le projet

```powershell
# Nettoyer les caches
Remove-Item -Recurse -Force .nuxt
Remove-Item -Recurse -Force .output
Remove-Item -Recurse -Force node_modules\.cache

# Réinstaller les dépendances
npm install

# Démarrer le serveur
npm run dev
```

✅ **Le serveur devrait démarrer sur http://localhost:3000**

---

## Option 2 : Installation Manuelle

### 1. Télécharger Node.js

Aller sur 👉 https://nodejs.org/

- Télécharger **Node.js 22.x LTS** (Current)
- Exécuter l'installateur
- Accepter les options par défaut

### 2. Vérifier l'installation

**Redémarrer PowerShell** puis :

```powershell
node --version
# Devrait afficher v22.x.x

npm --version
# Devrait afficher 10.x.x
```

### 3. Relancer le projet

```powershell
# Aller dans le dossier du projet
cd C:\Dev\DeveloppementFont+Type\PWA_M1TP1\PWATP1

# Nettoyer
Remove-Item -Recurse -Force .nuxt, .output, node_modules\.cache

# Réinstaller
npm install

# Démarrer
npm run dev
```

---

## 🧪 Vérification

Une fois le serveur démarré :

1. **Ouvrir** : http://localhost:3000
2. **Page Home** devrait s'afficher avec la présentation
3. **Cliquer sur "Commencer"** → Page Réception
4. **Autoriser caméra et notifications** si demandé

### Tester les fonctionnalités :

#### ✅ Connexion
- Entrer un pseudo
- Cliquer sur "Prendre une photo"
- Capturer et valider
- Se connecter

#### ✅ Créer une Room
- Cliquer sur "➕ Créer une salle"
- Entrer nom et description
- Créer

#### ✅ Chat
- Cliquer sur une room
- Envoyer un message texte
- Cliquer sur 📷 pour prendre une photo
- La photo apparaît dans le chat ET la galerie

#### ✅ Galerie
- Retour → "🖼️ Voir la galerie"
- Toutes les photos s'affichent
- Cliquer pour agrandir
- Télécharger ou supprimer

#### ✅ Mode Offline
1. Ouvrir DevTools (F12)
2. Application > Service Workers
3. Vérifier que le SW est actif
4. Network > Cocher "Offline"
5. Recharger → L'app fonctionne !

---

## ❓ Problèmes Courants

### "nvm: command not found"
→ NVM n'est pas installé ou PowerShell pas redémarré

### "node: command not found" après installation
→ Redémarrer PowerShell ou l'ordinateur

### Le serveur démarre sur le port 3001 au lieu de 3000
→ Normal si 3000 est occupé. Utiliser le port affiché.

### "Cannot find module..." erreurs TypeScript
→ Normal en dev avec Nuxt auto-import. Ignorer ou build pour vérifier.

---

## 📞 Besoin d'Aide ?

Consulter :
- **INSTALL.md** : Guide complet d'installation
- **README.md** : Documentation du projet
- **PROJECT_SUMMARY.md** : Récapitulatif des fonctionnalités

---

## ⏱️ Temps Estimé

- **Avec NVM** : 5-10 minutes
- **Installation manuelle** : 10-15 minutes

Bon développement ! 🚀
