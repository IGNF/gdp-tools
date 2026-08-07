import { useState } from 'react';

import type { GeodesyPointAttribute } from '../report/geodesyPointDisplay';

import styles from './GeodesyPointDetails.module.css';

export interface GeodesyPointDetailsProps {
  layerTitle: string;
  longitude: number;
  latitude: number;
  attributes: GeodesyPointAttribute[];
  /** Affiche la ligne réseau / coordonnées (défaut : true). */
  showMeta?: boolean;
}

function GeodesyDispoStates({ states }: { states: NonNullable<GeodesyPointAttribute['dispoStates']> }) {
  return (
    <span className={styles.dispoStates} role="img" aria-label="Disponibilité">
      {states.map((state, index) => (
        <span
          key={`${state}-${index}`}
          className={
            state === 'available' ? styles.dispoDotAvailable : styles.dispoDotUnavailable
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function GeodesyAttributeValue({ attribute }: { attribute: GeodesyPointAttribute }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = attribute.displayImageUrl ?? attribute.imageUrl;

  if (attribute.dispoStates?.length) {
    return <GeodesyDispoStates states={attribute.dispoStates} />;
  }

  if (imageSrc && !imageFailed) {
    return (
      <div className={styles.imageBlock}>
        <a
          href={attribute.href ?? imageSrc}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.imageLink}
          title={`Ouvrir ${attribute.label}`}
        >
          <img
            src={imageSrc}
            alt={attribute.label}
            className={styles.imageThumb}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </a>
        {attribute.isPicto ? (
          <span className={styles.pictoCode}>{attribute.value}</span>
        ) : null}
        {attribute.href && !attribute.isPicto ? (
          <a
            href={attribute.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.imageOpenLink}
          >
            Ouvrir l&apos;image
          </a>
        ) : null}
      </div>
    );
  }

  if (attribute.href) {
    return (
      <a href={attribute.href} target="_blank" rel="noopener noreferrer">
        {attribute.value}
      </a>
    );
  }

  return attribute.value;
}

/** Fiche point géodésique (attributs + photos IGN). */
export function GeodesyPointDetails({
  layerTitle,
  longitude,
  latitude,
  attributes,
  showMeta = true,
}: GeodesyPointDetailsProps) {
  return (
    <div className={styles.details}>
      {showMeta ? (
        <p className={styles.meta}>
          {layerTitle}
          {' · '}
          {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
        </p>
      ) : null}

      {attributes.length > 0 ? (
        <dl className={styles.attributeList}>
          {attributes.map((attribute, index) => (
            <div
              key={`${attribute.label}-${attribute.value}-${index}`}
              className={styles.attributeRow}
            >
              <dt>{attribute.label}</dt>
              <dd>
                <GeodesyAttributeValue attribute={attribute} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.empty}>Aucun attribut disponible pour ce point.</p>
      )}
    </div>
  );
}
