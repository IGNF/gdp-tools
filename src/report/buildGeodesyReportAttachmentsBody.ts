import {
  GEODESY_POINT_REPORT_PHOTO_SLOTS,
  type GeodesyPointReportPhotoRole,
} from './geodesyPointReportConstants';

export interface GeodesyReportAttachmentPhoto {
  role: GeodesyPointReportPhotoRole;
  blob: Blob;
}

/** Construit le corps `report.addAttachments` selon {@link GEODESY_POINT_REPORT_PHOTO_SLOTS}. */
export function buildGeodesyReportAttachmentsBody(
  photos: readonly GeodesyReportAttachmentPhoto[],
): Record<string, Blob> {
  const body: Record<string, Blob> = {};

  for (const slot of GEODESY_POINT_REPORT_PHOTO_SLOTS) {
    const photo = photos.find((entry) => entry.role === slot.role);
    if (photo) {
      body[slot.attachmentKey] = photo.blob;
    }
  }

  return body;
}
