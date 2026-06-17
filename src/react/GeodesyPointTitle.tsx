import { useState } from 'react';

import type { GeodesyPointTitlePicto } from '../report/geodesyPointDisplay';

import styles from './GeodesyPointTitle.module.css';

export interface GeodesyPointTitleProps {
  title: string;
  picto?: GeodesyPointTitlePicto;
  className?: string;
}

/** Titre repère avec symbole `picto` IGN optionnel (fiche / ActionSheet). */
export function GeodesyPointTitle({ title, picto, className }: GeodesyPointTitleProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = picto?.displayImageUrl ?? picto?.imageUrl;
  const showPicto = picto && imageSrc && !imageFailed;

  return (
    <span className={[styles.titleRow, className].filter(Boolean).join(' ')}>
      {showPicto ? (
        <img
          src={imageSrc}
          alt=""
          className={styles.titlePicto}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <span className={styles.titleText}>{title}</span>
    </span>
  );
}
