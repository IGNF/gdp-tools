import { PDFDocument, type PDFPage } from 'pdf-lib';

import type { GeodesyPdfFetchFn } from './geodesyPdfFetch';
import { fetchGeodesyPdfBytes } from './geodesyPdfFetch';

export interface MergeGeodesyPdfSkippedUrl {
  url: string;
  reason: string;
}

export interface MergeGeodesyPdfUrlsProgress {
  phase: 'fetch' | 'merge';
  completed: number;
  total: number;
}

export interface MergeGeodesyPdfUrlsOptions {
  /** URLs de fiches PDF (doublons ignorés, ordre conservé). */
  urls: readonly string[];
  fetchPdf?: GeodesyPdfFetchFn;
  signal?: AbortSignal;
  onProgress?: (progress: MergeGeodesyPdfUrlsProgress) => void;
}

export interface MergeGeodesyPdfUrlsResult {
  pdfBytes: Uint8Array;
  mergedCount: number;
  skipped: readonly MergeGeodesyPdfSkippedUrl[];
}

export class MergeGeodesyPdfUrlsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MergeGeodesyPdfUrlsError';
  }
}

function dedupeUrls(urls: readonly string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const raw of urls) {
    const trimmed = raw.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    ordered.push(trimmed);
  }

  return ordered;
}

function padTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

export function buildMergedGeodesyPdfFilename(date: Date = new Date()): string {
  const day = [
    date.getFullYear(),
    padTwoDigits(date.getMonth() + 1),
    padTwoDigits(date.getDate()),
  ].join('-');
  const time = [
    padTwoDigits(date.getHours()),
    padTwoDigits(date.getMinutes()),
    padTwoDigits(date.getSeconds()),
  ].join('');

  return `geodesie-fiches-${day}-${time}.pdf`;
}

export async function mergeGeodesyPdfUrls(
  options: MergeGeodesyPdfUrlsOptions,
): Promise<MergeGeodesyPdfUrlsResult> {
  const uniqueUrls = dedupeUrls(options.urls);

  if (uniqueUrls.length === 0) {
    throw new MergeGeodesyPdfUrlsError('Aucune URL PDF à fusionner.');
  }

  const fetchPdf: GeodesyPdfFetchFn =
    options.fetchPdf ??
    ((url, signal) => fetchGeodesyPdfBytes(url, { signal }));

  const skipped: MergeGeodesyPdfSkippedUrl[] = [];
  const fetchedParts: { url: string; bytes: Uint8Array }[] = [];
  const total = uniqueUrls.length;

  for (let index = 0; index < uniqueUrls.length; index += 1) {
    const url = uniqueUrls[index]!;
    options.onProgress?.({ phase: 'fetch', completed: index, total });

    try {
      fetchedParts.push({ url, bytes: await fetchPdf(url, options.signal) });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Téléchargement impossible';
      skipped.push({ url, reason });
    }
  }

  if (fetchedParts.length === 0) {
    throw new MergeGeodesyPdfUrlsError(
      'Aucune fiche PDF n’a pu être téléchargée (réseau ou accès).',
    );
  }

  options.onProgress?.({ phase: 'merge', completed: 0, total: fetchedParts.length });

  const merged = await PDFDocument.create();

  let mergedCount = 0;

  for (let index = 0; index < fetchedParts.length; index += 1) {
    const { url, bytes } = fetchedParts[index]!;

    try {
      const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copiedPages = await merged.copyPages(document, document.getPageIndices());
      copiedPages.forEach((page: PDFPage) => merged.addPage(page));
      mergedCount += 1;
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'Fichier PDF illisible ou corrompu';
      skipped.push({ url, reason });
    }

    options.onProgress?.({ phase: 'merge', completed: index + 1, total: fetchedParts.length });
  }

  if (mergedCount === 0) {
    throw new MergeGeodesyPdfUrlsError(
      'Aucune fiche PDF n’a pu être fusionnée (fichiers invalides ou inaccessibles).',
    );
  }

  const pdfBytes = await merged.save();

  return {
    pdfBytes,
    mergedCount,
    skipped,
  };
}
