/** Chemin same-origin du proxy de téléchargement PDF (Vite dev / Apache qualif). */
export const DEFAULT_GEODESY_PDF_FETCH_PROXY_PATH = '/__gdp-pdf';

export type GeodesyPdfFetchFn = (url: string, signal?: AbortSignal) => Promise<Uint8Array>;

export class GeodesyPdfFetchError extends Error {
  url: string;
  status?: number;

  constructor(message: string, url: string, status?: number) {
    super(message);
    this.name = 'GeodesyPdfFetchError';
    this.url = url;
    this.status = status;
  }
}

function isAllowedGeodesyPdfFetchHost(host: string): boolean {
  const normalized = host.toLowerCase();
  if (normalized === 'ign.fr' || normalized.endsWith('.ign.fr')) {
    return true;
  }
  if (normalized === 'geopf.fr' || normalized.endsWith('.geopf.fr')) {
    return true;
  }
  return false;
}

/** Hôtes autorisés pour le relais serveur (évite l’open proxy). */
export function isAllowedGeodesyPdfFetchUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return false;
    }

    return isAllowedGeodesyPdfFetchHost(url.hostname);
  } catch {
    return false;
  }
}

export function isGeodesyPdfBytes(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

function assertGeodesyPdfBytes(bytes: Uint8Array, url: string): void {
  if (isGeodesyPdfBytes(bytes)) {
    return;
  }

  throw new GeodesyPdfFetchError(
    'La réponse reçue n’est pas un fichier PDF (page HTML ou erreur serveur).',
    url,
  );
}

export async function fetchGeodesyPdfBytes(
  url: string,
  options: { signal?: AbortSignal; fetchImpl?: typeof fetch } = {},
): Promise<Uint8Array> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(url, {
    signal: options.signal,
    credentials: 'omit',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new GeodesyPdfFetchError(
      `Échec du téléchargement (${response.status})`,
      url,
      response.status,
    );
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  assertGeodesyPdfBytes(bytes, url);
  return bytes;
}

/** Relais same-origin : `GET {proxyMount}?url=…` (contourne CORS côté navigateur). */
export function createGeodesyPdfProxyFetch(proxyMountPath: string): GeodesyPdfFetchFn {
  const mount = proxyMountPath.replace(/\/+$/, '');

  return async (url, signal) => {
    const proxyUrl = `${mount}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { signal, credentials: 'same-origin' });

    if (!response.ok) {
      throw new GeodesyPdfFetchError(
        `Échec du téléchargement via proxy (${response.status})`,
        url,
        response.status,
      );
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    assertGeodesyPdfBytes(bytes, url);
    return bytes;
  };
}

/**
 * Panier web : tente d’abord le téléchargement CORS direct (ex. annexes `data.geopf.fr`),
 * puis le proxy same-origin si le direct échoue (CORS absent, qualif sans Apache `__gdp-pdf`).
 */
export function createGeodesyPdfFetchWithProxyFallback(
  proxyMountPath: string,
): GeodesyPdfFetchFn {
  const proxyFetch = createGeodesyPdfProxyFetch(proxyMountPath);

  return async (url, signal) => {
    if (isAllowedGeodesyPdfFetchUrl(url)) {
      try {
        return await fetchGeodesyPdfBytes(url, { signal });
      } catch {
        return proxyFetch(url, signal);
      }
    }

    return proxyFetch(url, signal);
  };
}
