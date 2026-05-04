# 💼 Wuut Liggey — Plateforme d'Emploi au Sénégal

> *"Wuut Liggey"* signifie **"Cherche du travail"** en Wolof.

Plateforme moderne d'offres d'emploi au Sénégal et en Afrique francophone, avec mise à jour automatique quotidienne.

---

## 🚀 Fonctionnalités

- ✅ Agrégation automatique d'offres via RSS (Sénégal)
- ✅ Reformulation IA avec Groq (llama3)
- ✅ Génération de pages HTML statiques SEO-optimisées
- ✅ Sitemap XML automatique
- ✅ Recherche et filtres (secteur, localisation, type de contrat)
- ✅ Pagination
- ✅ Intégration WhatsApp pour publication d'offres
- ✅ Espaces Google AdSense intégrés
- ✅ GitHub Actions pour automatisation complète

---

## 📁 Structure du projet

```
wuut-liggey/
├── src/                    # Application React (frontend)
│   ├── App.tsx
│   ├── components/         # Composants réutilisables
│   ├── pages/              # Pages (Home, JobDetail, About, Contact)
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── data/               # Données statiques (catégories)
├── public/
│   ├── data/jobs.json      # Base de données des offres
│   ├── jobs/               # Pages HTML générées (statiques)
│   ├── styles/             # CSS pour pages statiques
│   ├── sitemap.xml
│   └── robots.txt
├── scripts/
│   ├── fetch-rss.js        # Agrégation RSS
│   ├── generate-ai.js      # Reformulation IA (Groq)
│   ├── generate-pages.js   # Génération pages + sitemap
│   └── run-all.js          # Script maître
└── .github/workflows/
    └── auto-update.yml     # GitHub Actions (cron quotidien)
```

---

## ⚙️ Installation & Lancement

### Prérequis
- Node.js 20+
- Compte GitHub + GitHub Pages activé
- (Optionnel) Clé API Groq pour reformulation IA

### Installation
```bash
git clone https://github.com/VOTRE-USERNAME/wuut-liggey.git
cd wuut-liggey
npm install
```

### Développement local
```bash
npm run dev
```

### Build de production
```bash
npm run build
```

### Scripts d'automatisation
```bash
# Tout en une commande :
node scripts/run-all.js

# Séparément :
node scripts/fetch-rss.js      # Récupère les RSS
node scripts/generate-ai.js    # Reformule avec IA
node scripts/generate-pages.js # Génère les pages HTML
```

---

## 🔐 Configuration des secrets GitHub

Dans `Settings > Secrets > Actions`, ajouter :

| Secret | Description |
|--------|-------------|
| `GROQ_API_KEY` | Clé API Groq pour la reformulation IA |

---

## 🤖 Automatisation GitHub Actions

Le workflow `.github/workflows/auto-update.yml` s'exécute :
- **Automatiquement** : chaque jour à 8h UTC (9h Dakar)
- **Manuellement** : depuis l'onglet Actions > Run workflow

### Limites
- Maximum **5 nouvelles offres** par jour
- Déduplication automatique par lien source
- Tri par date de publication

---

## 💰 Monétisation

### Google AdSense
Les emplacements publicitaires sont déjà intégrés dans :
- Page d'accueil (banner horizontal)
- Entre les offres (après la 4ème carte)
- Pages détail (banner + sidebar)

Pour activer, remplacer les commentaires dans `src/components/AdBanner.tsx` et `public/styles/job-page.css`.

### Publication d'offres payantes
Bouton WhatsApp intégré partout :
- Header
- Sidebar filtres
- Footer
- Bouton flottant

---

## 🌐 Déploiement GitHub Pages

1. Activer GitHub Pages dans `Settings > Pages`
2. Source : `gh-pages` branch (déployée automatiquement par Actions)
3. (Optionnel) Configurer un domaine personnalisé

---

## 📊 SEO

- Meta tags dynamiques par page
- Schema.org `JobPosting` structuré
- Sitemap XML auto-généré
- URLs propres : `/jobs/titre-du-poste.html`
- robots.txt configuré

---

## 📞 Contact

- 🌐 Site : [wuut-liggey.github.io](https://wuut-liggey.github.io)
- 📧 Email : contact@wuut-liggey.sn
- 💬 WhatsApp : +221 70 000 00 00

---

*Made with ❤️ for the Sénégalese job seekers*
