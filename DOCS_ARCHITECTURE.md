# Structure et Architecture du Projet

Ce document détaille l'organisation du code et l'architecture technique de l'application PWA M1TP1.

## Architecture Globale

L'application est construite avec **Nuxt 4** et utilise une architecture de composants Vue.js 3 avec l'API de Composition.

### Diagramme des Composants & Flux de Données

```mermaid
graph TD
    App[app.vue - Routeur Central] --> Home[HomePage.vue - Accueil]
    App --> Reception[ReceptionPage.vue - Connexion/Salles]
    App --> Room[RoomPage.vue - Chat/Vibration/Géo]
    App --> Gallery[GalleryPage.vue - Galerie Photos]
    
    Reception --> User[(LocalStorage: User)]
    Reception --> Rooms[(LocalStorage: Rooms)]
    
    Room --> Socket{{Socket.io-client: Real-time}}
    Room --> API{{Fetch API: History}}
    Room --> Battery[BatteryIndicator.vue]
    Room --> Camera[CameraCapture.vue]
    Room --> Msgs[(LocalStorage: Messages)]
    
    Gallery --> GalCache[(LocalStorage: Gallery)]
```

## Organisation des Dossiers

| Dossier | Description |
| :--- | :--- |
| `app/` | Contient le cœur de l'application. |
| `app/components/` | Composants principaux (ReceptionPage, RoomPage, etc.). |
| `app/assets/css/` | Styles Vanilla CSS organisés par composant. |
| `public/` | Assets statiques (icônes, manifestations). |
| `tests/` | Tests automatisés (Vitest). |

---

*Ce document fait partie de la documentation technique du projet.*
