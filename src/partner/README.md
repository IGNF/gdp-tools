# Logos des partenaires

Ce module gère le chargement et la mise en cache des logos des partenaires géodésiques.

## Fonctionnalités

- **Construction d'URL** : génère automatiquement l'URL du logo à partir de l'ID du partenaire
- **Mise en cache** : utilise le cache LRU en mémoire partagé avec les autres images géodésiques
- **Préchargement** : permet de précharger les logos de manière proactive pour améliorer les performances
- **Déduplication** : évite les requêtes multiples pour le même logo

## Architecture

Les logos des partenaires utilisent le même système de cache que les autres images géodésiques (`geodesyImageCache`). Cela signifie :

1. **Cache en mémoire** : jusqu'à 64 images (logos + photos de points) sont stockées en mémoire
2. **LRU (Least Recently Used)** : les images les moins utilisées sont automatiquement évincées
3. **Blob URLs** : les images sont converties en `blob://` URLs pour un affichage rapide
4. **Gestion automatique** : les Object URLs sont révoquées quand les entrées sont évincées

## Utilisation

### Depuis TypeScript/JavaScript

```typescript
import {
  buildPartnerLogoUrl,
  prefetchPartnerLogoById,
  prefetchPartnerLogosFromHits,
} from '@ign/gdp-tools';

// Construire l'URL d'un logo
const logoUrl = buildPartnerLogoUrl('123'); // https://data.geopf.fr/annexes/geodesie/gdp/logos/logo_123.jpg

// Précharger un logo
await prefetchPartnerLogoById('123');

// Précharger tous les logos d'un ensemble de hits
await prefetchPartnerLogosFromHits(hits);
```

### Depuis React

```tsx
import { usePartnerLogo } from '@/features/map/hooks/usePartnerLogo';

function PartnerCard({ partnerId }: { partnerId: string }) {
  const { logoUrl, isLoading } = usePartnerLogo(partnerId);

  return (
    <div>
      {logoUrl ? (
        <img src={logoUrl} alt="" />
      ) : (
        <span>Logo</span>
      )}
    </div>
  );
}
```

## Préchargement automatique

Les logos sont automatiquement préchargés dans les situations suivantes :

1. **Clic sur la carte (OpenLayers popup)** : quand un point est cliqué, son logo est préchargé
2. **Affichage dans React** : le hook `usePartnerLogo` précharge automatiquement le logo au montage

## Statistiques du cache

Les logos des partenaires sont inclus dans les statistiques globales du cache :

```typescript
import { getGeodesyCacheStats } from '@ign/gdp-tools';

const stats = getGeodesyCacheStats();
console.log(`Images en cache : ${stats.imageEntryCount}`);
console.log(`Taille totale : ${stats.imageSizeBytes} bytes`);
```

## Nettoyage du cache

Le cache des logos est automatiquement nettoyé avec les autres images :

```typescript
import { clearAllGeodesyCaches } from '@ign/gdp-tools';

clearAllGeodesyCaches(); // Nettoie tous les caches (images + FeatureInfo)
```

## Performance

### Avant la mise en cache

- Chaque point affichait l'URL distante du logo
- Chaque affichage = nouvelle requête HTTP
- Impact réseau élevé pour les points avec le même partenaire

### Après la mise en cache

- Premier affichage : téléchargement + mise en cache
- Affichages suivants : blob URL locale (instantané)
- Préchargement proactif lors du clic
- Déduplication automatique des requêtes en cours

### Exemple

Pour 100 points avec 5 partenaires différents :
- **Avant** : 100 requêtes HTTP
- **Après** : 5 requêtes HTTP (une par partenaire unique)
