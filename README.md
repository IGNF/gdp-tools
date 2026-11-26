# @ign/gdp-tools

Extension d’affichage des **données de géodésie** (monumentation IGN) pour applications mobiles OpenLayers.

Conçu pour être **réutilisable** par les applications IGN (pattern proche des packages `@ign/mobile-core` / `@ign/mobile-device`).

## Principes

| Concept | Rôle |
| -------- | ---- |
| **Flux WMS** | Tuiles raster + **GetFeatureInfo** sur la couche `TOUT` (GEODESIE_DATA) — données hébergées sur la [Géoplateforme](https://www.geoportail.gouv.fr/) |
| **Flux WFS** | Entités vectorielles GeoJSON (repères cliquables, cluster, filtres) — données hébergées sur la Géoplateforme (`data.geopf.fr`) |
| **Profil public** | WMS seul par défaut — carte monumentation grand public |
| **Profil expert** | WFS + filtres domaine / attributs + annexes — usage type géodésie de poche |
| **Catalogue** | Chaque app choisit couches, attributs et options via `createGeodesyCatalog` ou les presets |

Le package fournit les **catalogues IGN complets** (couches WMS, WFS, annexes, attributs GEODESIE_DATA). L’application hôte décide du profil, des couches actives et de la fiche repère.

---

## Authentification et prérequis

| Besoin | Identification requise |
| ------ | ---------------------- |
| **Tuiles WMS** (RBF, RDF, RN, TOUT…) | Non — service public Géoplateforme |
| **WFS public** `DATA_GEOD` (`GEODESIE:data_geod`) | Non |
| **WFS privé** `GDP` (`GEODESIE_GDP:gdp_point`) | Oui — **clé API** Géoplateforme (`wfsApiKey`) |
| **Annexe GDP RGP2** (profil expert) | Accès réseau au flux IGN ; pas de clé dédiée dans le package |
| **Signalements EspaceCo** (repère, monumentation…) | Oui — **utilisateur connecté** OAuth dans l’app hôte ; thèmes chargés depuis `GET /communities/{id}` (identifiant communauté configuré par l’app) |

- La clé WFS privée est passée au catalogue (`wfsApiKey`). Sans clé, seul `DATA_GEOD` est disponible côté WFS ; `GDP` reste inactif.
- Les signalements (`mapGeodesyPointReportToApiBody`, pièces jointes…) préparent le corps API collaboratif ; l’**envoi** et la **résolution des thèmes** EspaceCo relèvent de l’application hôte (souvent via `@ign/mobile-core`).

---

## Profils public et expert

Point d’entrée unifié : `createGeodesyCatalogForProfile(profile, options)`.

| | **Public** (`'public'`) | **Expert** (`'expert'`) |
| --- | --- | --- |
| **Affichage carte** | Tuiles WMS RBF / RDF / RN | Vecteur WFS (cluster), couches **domaine** dans le switcher |
| **Interrogation clic** | GetFeatureInfo WMS (`TOUT`) en priorité si pas de WFS | WFS sous le pixel, puis annexes, puis WMS en secours |
| **Attributs fiche** | `GEODESY_PUBLIC_ATTRIBUTE_KEYS` (liste courte) | `GEODESIE_DATA_ATTRIBUTE_KEYS` (complet) |
| **WFS** | Désactivé par défaut ; option `enableWfsLayers` (déprécié → passer en expert) | `DATA_GEOD` + `GDP` si clé API |
| **Filtres WFS** | — | Filtres **domaine** + filtres **attributs** (`GeodesyWfsAttributeFiltersPanel`) |
| **Annexes** | — | `GDP_RGP2` par défaut |
| **Couches actives par défaut** | `GEODESY_PUBLIC_DEFAULT_ACTIVE` → `['RBF']` | Couches domaine ou `DATA_GEOD` |

```ts
import {
  createGeodesyCatalogForProfile,
  defaultGeodesyActiveLayerIdsForProfile,
  defaultGeodesyWfsAttributeFilterValuesForProfile,
  isGeodesyProfile,
  type GeodesyProfile,
} from '@ign/gdp-tools';

const API_KEY = process.env.VITE_GEODESY_WFS_API_KEY?.trim();

const publicCatalog = createGeodesyCatalogForProfile('public', {
  wfsApiKey: API_KEY,
  attributeKeys: MY_SHORT_KEYS,
});

const expertCatalog = createGeodesyCatalogForProfile('expert', {
  wfsApiKey: API_KEY,
});

const activePublic = defaultGeodesyActiveLayerIdsForProfile('public');
const activeExpert = defaultGeodesyActiveLayerIdsForProfile('expert', { wfsApiKey: API_KEY });
const expertFilters = defaultGeodesyWfsAttributeFilterValuesForProfile('expert');
```

Raccourcis dédiés (équivalents) : `createGeodesyPublicCatalog`, `createGeodesyExpertCatalog`.

---

## Installation

```json
"@ign/gdp-tools": "github:IGNF/gdp-tools#v0.2.0"
```

Voir [Publier une version (tag)](#publier-une-version-tag).

Le `dist/` est versionné : l'app consommatrice n'a pas à builder le package.

### Peer dependencies

- `ol` ^10
- `ol-ext` ^4
- `proj4` ^2
- `react` ^18 || ^19

### Points d’entrée

| Import | Contenu |
| ------ | ------- |
| `@ign/gdp-tools` | API carte / WMS / WFS / catalogues / attributs / signalement |
| `@ign/gdp-tools/react` | Composants et hooks React |

---

## Deux flux cartographiques

Les données cartographiques géodésiques exposées en **WMS** et **WFS** sont **hébergées sur la Géoplateforme** (services `data.geopf.fr`). Le package ne stocke pas ces données : il configure les requêtes OpenLayers vers ces flux.

### WMS — tuiles et GetFeatureInfo

Service : `GEODESY_WMS_URL` — endpoint WMS Géoplateforme.

| ID | Rôle |
| --- | --- |
| `RBF` | Réseau de base français |
| `RDF` | Réseau de détail français |
| `RN` | Nivellement |
| `GRAVI` | Gravimétrie |
| `TOUT` | Couche **GEODESIE_DATA** — attributs complets via **GetFeatureInfo** (souvent masquée à l’écran, toujours interrogable) |

**Profil public** : c’est le flux principal. Au clic, `queryGeodesyAtCoordinate` interroge `dataLayerId` (défaut `TOUT`), avec filtrage optionnel par `groupe_type` vs couches réseau visibles.

### WFS — vecteur GeoJSON

Même plateforme : les flux WFS sont servis par la Géoplateforme (endpoints public et privé).

| Service | URL | Auth |
| ------- | --- | ---- |
| Public | `GEODESY_WFS_PUBLIC_URL` (`https://data.geopf.fr/wfs`) | Aucune |
| Privé | `GEODESY_WFS_PRIVATE_URL` (`https://data.geopf.fr/private/wfs`) | `wfsApiKey` |

| ID | TYPENAME | Service |
| --- | -------- | ------- |
| `DATA_GEOD` | `GEODESIE:data_geod` | Public |
| `GDP` | `GEODESIE_GDP:gdp_point` | Privé (clé) |

Chargement **par emprise visible** (bbox OpenLayers). **Profil expert** : cluster animé (`ol-ext` AnimatedCluster), éclatement au clic pour choisir un repère dans un amas.

**Couches domaine** (expert) : une couche switcher par famille de codes `domaine` (`rsgf`/`rsgo`/`rsge` → « Géodésie », `nivf`/`nivo`/`nive` → « Nivellement »), alimentées depuis la couche WFS source `DATA_GEOD`.

### Interrogation au clic (ordre)

`queryGeodesyAtClick` — par défaut `preferWfs: true` :

1. **WFS** — entité sous le pixel (`queryGeodesyWfsAtPixel`), y compris repère issu d’un cluster éclaté
2. **Annexes** — ex. `GDP_RGP2` (expert) Sations RGP
3. **WMS** — GetFeatureInfo sur `TOUT` / `dataLayerId`
4. Si `preferWfs: false`, WMS d’abord puis repli WFS / annexes

```ts
import { queryGeodesyAtClick } from '@ign/gdp-tools';

const hits = await queryGeodesyAtClick(map, coordinate, pixel);
// hits[0].feature → propriétés GEODESIE_DATA ou GDP
```

Hook React : `useGeodesyMapClick` — résultat `kind: 'geodesy'` (repère + `reportContext`) ou `kind: 'coordinate'` (point vide).

---

## Catalogues configurables

Un `GeodesyCatalog` regroupe :

| Partie | Rôle |
| ------ | ---- |
| **Couches WMS** | `catalog.layers`, `uiLayers`, `dataLayerId` |
| **Couches WFS** | `catalog.wfsLayers`, cluster, clé API |
| **Couches domaine** | Filtres `domaine` sur le flux WFS (expert) |
| **Annexes** | Flux complémentaires (ex. `GDP_RGP2`) |
| **Attributs** | `catalog.attributes` — popup / fiche repère |

### Catalogue custom

```ts
import { createGeodesyCatalog } from '@ign/gdp-tools';

export const APP_GEODESY_CATALOG = createGeodesyCatalog({
  layerIds: ['RBF', 'RDF', 'RN', 'TOUT'],
  attributeKeys: ['id', 'nom', 'commune', 'etat', 'img1_url'],
  wfsLayerIds: ['DATA_GEOD', 'GDP'],
  wfsApiKey: process.env.VITE_GEODESY_WFS_API_KEY,
});
```

Constantes globales : `DEFAULT_GEODESY_CATALOG`, `DEFAULT_GEODESY_ATTRIBUTE_CATALOG`.

Le catalogue est **enregistré sur le LayerGroup** à l’init (`registerGeodesyOnMap` / `useGeodesyOnMap`) ; popup et requêtes le relisent via `getGeodesyCatalogFromMap(map)`.

### Usage React

```tsx
import { useGeodesyOnMap } from '@ign/gdp-tools/react';

const geodesy = useGeodesyOnMap(map, {
  catalog: expertCatalog,
  initialActive: [...activeExpert],
  popup: false,
});

// geodesy.uiLayers, geodesy.visibility, geodesy.toggleLayer(id)
// geodesy.catalog, geodesy.activeLabels
```

Composants optionnels : `GeodesyLayerSwitcher`, `GeodesyWfsAttributeFiltersPanel` (filtres expert), `GeodesyPointDetails` / `GeodesyPointTitle`.

### Indicateur de chargement géodésie (WMS + WFS)

```tsx
import { useGeodesyOnMap, useGeodesyWfsLoading } from '@ign/gdp-tools/react';

const geodesy = useGeodesyOnMap(map, { catalog, popup: false });
const wfsLoading = useGeodesyWfsLoading(map, {
  catalog: geodesy.catalog,
  visibility: geodesy.visibility,
  showIndicator: true, // désactivable par l’app hôte
  showAfterMs: 5000, // optionnel : pastille seulement après 5 s de chargement
});

// wfsLoading.isLoading, wfsLoading.elapsedMs
```

Suit les tuiles WMS géodésie (compteur du chargeur `geodesyWmsTileLoadFunction`) et les requêtes WFS **bbox** (`featuresloadstart` / `featuresloadend`) pour la zone visible.

---

## Options principales (`createGeodesyCatalog`)

### WMS

| Option | Défaut | Description |
| ------ | ------ | ----------- |
| `layerIds` | toutes | Sous-ensemble WMS |
| `uiLayerIds` | sauf `dataLayerId` | Couches du switcher |
| `dataLayerId` | `'TOUT'` | Couche GetFeatureInfo |
| `networkLayerIds` | réseaux WMS | Filtre `groupe_type` au clic |

### WFS

| Option | Défaut | Description |
| ------ | ------ | ----------- |
| `wfsLayerIds` | — | `DATA_GEOD`, `GDP`… |
| `wfsApiKey` | — | Requis pour `GDP` |
| `wfsCluster` | expert : activé ; public : `{ enabled: false }` | Regroupement animé (`AnimatedCluster`), éclatement au clic |
| | | `maxResolution` (déf. **80**) : seuil zoom affichage **et** chargement WFS — **indépendant** de `enabled` |
| `wfsDomainLayers` | profils expert | Couches filtrées par `domaine` |
| `wfsAttributeFilters` | profils expert | Filtres booléen / date / texte / liste |

### Attributs

| Option | Défaut | Description |
| ------ | ------ | ----------- |
| `attributeKeys` | GEODESIE_DATA complet | Champs fiche, **dans l’ordre** |
| `labels` | `GEODESY_ATTRIBUTE_LABELS` | Surcharge libellés FR |
| `titleKeys` | `nom`, `id`… | Titre affiché |

Exports utiles : `selectGeodesyDisplayEntries`, `resolveGeodesyPopupTitle`, `buildGeodesyPopupTemplate`, `getGeodesyScalarPropertyEntries`.

---

## Signalements sur repère

Le package prépare le **contexte** et le **corps API** ; l’app hôte gère l’auth EspaceCo et le chargement des thèmes communauté.

| Cas d’usage (app hôte) | Contexte package |
| ---------------------- | ---------------- |
| Signalement sur repère existant | `GeodesyPointReportContext` — propriétés repère, photos, attributs thème |
| Signalement sur coordonnée seule | position + commentaire ; l’app peut réutiliser un repère cliqué pour préremplir `id` / `domaine` |

Constantes : `GEODESY_POINT_REPORT_THEME` (nom de thème par défaut : `gdp-tools`), `GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS` (`id`, `domaine` toujours envoyés si connus). Le **nom de thème EspaceCo** effectif est choisi par l’application.

Le corps `report.add` **ne contient pas de sketch**. Les attributs envoyés sont une whitelist : champs du thème communauté, ou à défaut `GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS` (repli historique). Le contrat GDP (`id`, `domaine`, `etat`, `gps`) est `GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS` via `buildGdpPointReportThemeAttributes` — sans changer le repli pof-mobile.

```ts
import {
  buildGeodesyPointReportContext,
  mapGeodesyPointReportToApiBody,
  buildGeodesyReportAttachmentsBody,
  buildGeodesyPointReportPrefillMap,
  shouldShowGeodesyPointReportThemeAttribute,
  GEODESY_POINT_REPORT_PHOTO_SLOTS,
} from '@ign/gdp-tools';
import { useGeodesyMapClick, GeodesyPointDetails } from '@ign/gdp-tools/react';

const { pendingClick } = useGeodesyMapClick(map, { isMapReady: true });
// pendingClick.kind === 'geodesy' → display + reportContext (properties, id, domaine…)
```

Préremplissage formulaire : `buildGeodesyPointReportPrefillMap`, alias attributs thème ↔ propriétés repère, masquage conditionnel des champs `id` / `domaine` si déjà connus.

---

## Cache et performances

| Export | Rôle |
| ------ | ---- |
| `getGeodesyCacheStats()` | Tailles caches mémoire |
| `clearAllGeodesyCaches()` | GetFeatureInfo + images |
| `clearGeodesyFeatureInfoCache()` | Cache WMS GetFeatureInfo |
| `clearGeodesyImageCache()` | Photos repère (LRU) |

### Fusion PDF (web)

| API | Rôle |
| --- | ---- |
| `mergeGeodesyPdfUrls()` | Télécharge des `url_pdf`, fusionne avec **pdf-lib**, retourne les octets |
| `createGeodesyPdfProxyFetch()` | `fetch` same-origin via `GET /__gdp-pdf?url=…` (contourne CORS) |
| `triggerBrowserPdfDownload()` | Déclenche le téléchargement dans le navigateur |
| `isAllowedGeodesyPdfFetchUrl()` | Liste blanche hôtes IGN pour le relais serveur |

### Affichage fiche repère

Les URLs longues (`url_pdf`, liens externes) sont tronquées par **ellipsis CSS** dans `GeodesyPointDetails` et la popup ol-ext (`geodesyPopup.css`) ; le `href` reste complet.
| `prefetchGeodesyImagesFromHits()` | Précharge avant affichage fiche |

---

## Exemple — BOF Mobile

```ts
// bof-mobile/src/shared/constants/geodesy.ts
import { createGeodesyCatalogForProfile } from '@ign/gdp-tools';

export type BofGeodesyMode = 'public' | 'expert';

export const BOF_GEODESY_PUBLIC_CATALOG = createGeodesyCatalogForProfile('public', {
  wfsApiKey: import.meta.env.VITE_GEODESY_WFS_API_KEY,
  attributeKeys: BOF_GEODESY_ATTRIBUTE_KEYS,
});

export const BOF_GEODESY_EXPERT_CATALOG = createGeodesyCatalogForProfile('expert', {
  wfsApiKey: import.meta.env.VITE_GEODESY_WFS_API_KEY,
  attributeKeys: BOF_GEODESY_ATTRIBUTE_KEYS,
  wfsCluster: { enabled: false, maxResolution: 80 },
  // BOF_GEODESY_SHOW_WFS_LOADING_INDICATOR dans shared/constants/geodesy.ts
});
```

```tsx
// MapPage — mode public par défaut, bascule expert dans le panneau couches
const geodesy = useGeodesyOnMap(map, {
  catalog: BOF_GEODESY_PUBLIC_CATALOG,
  initialActive: getBofGeodesyDefaultActive('public'),
  popup: false,
});
```

Signalements : fiche ActionSheet → `/report/geodesy/new` (thème `gdp-tools`) ou « Déclarer comme borne frontière » (thème `bof`). Thèmes résolus depuis `GET /communities/96` dans l’app, pas depuis `/users/me`.

---

## Exemple — configuration complète (tous les paramètres)

Les presets `createGeodesyCatalogForProfile` / `createGeodesyPublicCatalog` / `createGeodesyExpertCatalog` ne font qu’appliquer des **valeurs par défaut** puis déléguer à `createGeodesyCatalog`. Pour tout contrôler, appelez directement `createGeodesyCatalog` (ou passez les mêmes options à `createGeodesyCatalogForProfile('expert', { … })`).

Référence des options : section [Options principales](#options-principales-creategeodesycatalog) ci-dessus.

```ts
import {
  createGeodesyCatalog,
  createGeodesyAttributeCatalog,
  defaultGeodesyActiveLayerIdsForProfile,
  defaultGeodesyWfsAttributeFilterValuesForProfile,
  GEODESY_WMS_LAYERS,
  GEODESY_WMS_URL,
  GEODESY_WMS_GP_OL_EXT,
  GEODESY_WFS_LAYERS,
  GEODESY_WFS_PRIVATE_URL,
  GEODESY_ANNEX_LAYERS,
  DEFAULT_GEODESY_WFS_DOMAIN_LAYERS,
  DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS,
  DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
  GEODESIE_DATA_ATTRIBUTE_KEYS,
} from '@ign/gdp-tools';

const WFS_API_KEY = import.meta.env.VITE_GEODESY_WFS_API_KEY?.trim();

/** Catalogue expert « à la main » — chaque option documentée du package. */
export const FULL_GEODESY_CATALOG = createGeodesyCatalog({
  // ——— WMS ———
  /** Catalogue WMS complet (prioritaire sur layerIds). */
  // layers: GEODESY_WMS_LAYERS,
  /** Sous-ensemble des couches WMS IGN. */
  layerIds: ['RBF', 'RDF', 'RN', 'GRAVI', 'TOUT'],
  /** Couches proposées dans le switcher (hors couche attributs). */
  uiLayerIds: ['RBF', 'RDF', 'RN'],
  /** Couche GetFeatureInfo (attributs GEODESIE_DATA). */
  dataLayerId: 'TOUT',
  /** Couches réseau pour le filtrage groupe_type au clic. */
  networkLayerIds: ['RBF', 'RDF', 'RN', 'GRAVI'],
  wmsUrl: GEODESY_WMS_URL,
  wmsGpOlExt: GEODESY_WMS_GP_OL_EXT,

  // ——— Attributs fiche / popup ———
  /** Catalogue attributs explicite (prioritaire sur attributeKeys…). */
  // attributes: createGeodesyAttributeCatalog({ … }),
  attributeKeys: GEODESIE_DATA_ATTRIBUTE_KEYS,
  excludedKeys: ['_layer', '_caption'],
  titleKeys: ['nom', 'id', 'commune'],
  labels: { etat: 'État du repère', vis_date: 'Dernière visite' },

  // ——— WFS ———
  /** Catalogue WFS complet (prioritaire sur wfsLayerIds). */
  // wfsLayers: GEODESY_WFS_LAYERS,
  wfsLayerIds: ['DATA_GEOD', 'GDP'],
  /** Couches WFS dans le switcher (ignoré si wfsDomainLayers non vide). */
  wfsUiLayerIds: ['DATA_GEOD', 'GDP'],
  wfsUrl: GEODESY_WFS_PRIVATE_URL,
  wfsApiKey: WFS_API_KEY,
  wfsDataProjection: 'EPSG:4326',
  wfsBboxPaddingRatio: 0.05,
  wfsUseCacheBuster: true,
  wfsPictoUrlMaps: {
    ...DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
    GDP: { ...DEFAULT_GEODESY_WFS_PICTO_URL_MAPS.GDP, '99': 'https://example.invalid/picto.png' },
  },
  wfsCluster: {
    enabled: true,
    distance: 40,
    minDistance: 0,
    maxResolution: 80,
    animationDuration: 700,
    animateExplosion: true,
    explosionAnimationDuration: 500,
    pointRadius: 12,
  },

  // ——— Filtres expert ———
  /** Couches switcher filtrées par champ `domaine` (remplace wfsUiLayerIds dans l’UI). */
  wfsDomainLayers: DEFAULT_GEODESY_WFS_DOMAIN_LAYERS,
  /** Flux WFS source des filtres domaine (défaut : DATA_GEOD si actif). */
  wfsDomainSourceLayerId: 'DATA_GEOD',
  /** Filtres attributs (booléen, date, texte, choix) — panneau GeodesyWfsAttributeFiltersPanel. */
  wfsAttributeFilters: DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS,

  // ——— Annexes ———
  /** Catalogue annexes complet (prioritaire sur annexLayerIds). */
  // annexLayers: GEODESY_ANNEX_LAYERS,
  annexLayerIds: ['GDP_RGP2'],
  annexUiLayerIds: ['GDP_RGP2'],
});

const profile = 'expert' as const;
const initialActive = defaultGeodesyActiveLayerIdsForProfile(profile, {
  wfsApiKey: WFS_API_KEY,
});
const initialWfsAttributeFilterValues = defaultGeodesyWfsAttributeFilterValuesForProfile(profile);
```

Branchement carte — toutes les options de `useGeodesyOnMap` :

```tsx
import { useGeodesyOnMap } from '@ign/gdp-tools/react';

// Option A — catalogue pré-construit (recommandé)
const geodesy = useGeodesyOnMap(map, {
  catalog: FULL_GEODESY_CATALOG,
  initialActive: [...initialActive],
  initialWfsAttributeFilterValues,
  popup: false, // true | { containerClassName: '…' } pour la popup ol-ext intégrée
});

// Option B — sans catalogue : les mêmes champs que createGeodesyCatalog sont acceptés inline
// const geodesy = useGeodesyOnMap(map, {
//   layerIds: ['RBF', 'RDF', 'RN', 'TOUT'],
//   wfsLayerIds: ['DATA_GEOD', 'GDP'],
//   wfsApiKey: WFS_API_KEY,
//   wfsDomainLayers: DEFAULT_GEODESY_WFS_DOMAIN_LAYERS,
//   annexLayerIds: ['GDP_RGP2'],
//   initialActive: ['DOMAIN_GEODESIE'],
//   popup: false,
// });

// geodesy.catalog, geodesy.uiLayers, geodesy.uiWfsLayers, geodesy.uiAnnexLayers
// geodesy.visibility, geodesy.toggleLayer, geodesy.setVisibility
// geodesy.wfsAttributeFilterValues, geodesy.setWfsAttributeFilterValues, geodesy.clearWfsAttributeFilterValues
// geodesy.activeLabels
```

`createGeodesyCatalogForProfile` accepte les **mêmes options** que `createGeodesyCatalog`, plus `enableWfsLayers` (déprécié sur le profil public — préférer le profil `expert`).

---

## Structure du package

```
src/
├── presets/                     # public / expert / createGeodesyCatalogForProfile
├── catalog/                     # createGeodesyCatalog, attributs, résolution par hit
├── constants/
│   ├── wms.ts                   # couches WMS, URLs, identifiants groupe OL
│   ├── wfs.ts                   # GEODESY_WFS_LAYERS
│   ├── wfsDomainLayers.ts       # filtres domaine (expert)
│   ├── wfsAttributeFilters.ts   # filtres attributs (expert)
│   ├── annex.ts                 # GDP_RGP2…
│   └── geodesyAttributeLabels.ts
├── layers/                      # WMS, WFS, domaine, cluster, annexes
├── wfs/                         # GetFeature, bbox, clic, cluster
├── wms/                         # GetFeatureInfo, merge hits
├── annex/                       # GDP RGP2, parse, style
├── interaction/                 # popup, queryGeodesyAtClick, cluster select
├── report/                      # display, context, prefill, API body
├── cache/
├── style/
└── react/                       # useGeodesyOnMap, useGeodesyMapClick, composants UI
```

---

## Développement

Prérequis : Node 26, comme `gdp-mobile`.

Depuis `gdp-tools/` :

```bash
npm install --ignore-scripts
npm run build       # vite build (dist/*.js, *.css) + tsc (dist/*.d.ts)
npm run dev         # vite build --watch (sans les .d.ts)
npm run typecheck   # tsc --noEmit
```

### `dist/` versionné

Le `dist/` est commité : les apps consommatrices installent le package via Git sans le builder (pas de script `prepare`). Toute modification de `src/` doit donc être suivie d’un `npm run build` et du commit du `dist/` régénéré, sinon les apps ne voient pas le changement.

### Publier une version (tag)

Versionnage sémantique : `patch` pour un correctif, `minor` pour un ajout compatible, `major` pour une rupture d’API (en `0.x`, un `minor` peut être cassant).

```bash
git checkout main && git pull
npm run build
git add dist && git commit -m "build: dist"   # si le dist a changé
npm version patch                              # met à jour package.json, commite et crée le tag vX.Y.Z
git push --follow-tags
```

Lister les tags : `git tag --sort=-v:refname`.

### Mettre à jour l’app consommatrice

Dans `gdp-mobile/`, pointer sur le tag publié (version exacte, reproductible) :

```bash
npm install github:IGNF/gdp-tools#v0.2.0
```

Le `package.json` et le lockfile sont mis à jour ; les committer. Tant que ce tag n’est pas changé, `npm install` / `npm ci` récupèrent toujours le même code.

### Tester sans publier

`"@ign/gdp-tools": "file:../gdp-tools"` dans `gdp-mobile/package.json` (ou `npm link`), puis `npm run build` ou `npm run dev` dans `gdp-tools/`. À ne pas committer.

### CSS

Popup ol-ext intégrée :

```ts
import '@ign/gdp-tools/dist/gdp-tools.css';
```

Alternative : composants React `GeodesyPointDetails` / fiche custom plutôt que la popup ol-ext.
