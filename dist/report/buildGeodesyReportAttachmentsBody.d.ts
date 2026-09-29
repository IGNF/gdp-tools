import { type GeodesyPointReportPhotoRole } from './geodesyPointReportConstants';
export interface GeodesyReportAttachmentPhoto {
    role: GeodesyPointReportPhotoRole;
    blob: Blob;
}
/** Construit le corps `report.addAttachments` selon {@link GEODESY_POINT_REPORT_PHOTO_SLOTS}. */
export declare function buildGeodesyReportAttachmentsBody(photos: readonly GeodesyReportAttachmentPhoto[]): Record<string, Blob>;
//# sourceMappingURL=buildGeodesyReportAttachmentsBody.d.ts.map