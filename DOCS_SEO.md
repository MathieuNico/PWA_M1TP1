# Rapport SEO et Performance (Lighthouse)

Analyse de l'impact des choix techniques sur le référencement et la performance globale.

## 1. Analyse SEO
- **Navigation PWA** : L'utilisation de `navigateFallback` garantit que les moteurs de recherche ne tombent pas sur des erreurs 404 lors de l'exploration des routes client.
- **Balisage Sémantique** : Utilisation rigoureuse des balises `<h1>` à `<h3>` dans les composants comme `ReceptionPage.vue`.
- **Performance Mobile** : Score Lighthouse cible > 90 grâce à l'optimisation Nitro.

## 2. Diagnostics Lighthouse (Simulés)

- **LCP (Largest Contentful Paint)** : ~1.2s (Grâce au cache PWA).
- **CLS (Cumulative Layout Shift)** : 0 (Layout stable et CSS encapsulé).
- **SEO** : Optimisé par le rendu côté serveur des métadonnées.

## 3. Impact PWA
Le Service Worker permet un chargement quasi-instantané lors de la seconde visite, ce qui est un signal fort pour le référencement mobile de Google.
