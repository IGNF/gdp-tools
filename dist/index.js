import { $ as e, $n as t, $t as n, A as r, An as i, At as a, B as o, Bn as s, Bt as c, C as l, Cn as u, Ct as d, D as ee, Dn as te, Dt as ne, E as re, En as ie, Et as ae, F as oe, Fn as se, Ft as ce, G as le, Gn as f, Gt as ue, H as de, Hn as fe, Ht as pe, I as me, In as he, It as ge, J as _e, Jn as ve, Jt as ye, K as be, Kn as p, Kt as m, L as h, Ln as xe, Lt as Se, M as Ce, Mn as we, Mt as Te, N as Ee, Nn as De, Nt as g, O as Oe, On as ke, P as Ae, Pn as je, Pt as Me, Q as Ne, Qn as Pe, Qt as Fe, R as Ie, Rn as Le, Rt as Re, S as ze, Sn as Be, St as Ve, T as He, Tn as Ue, Tt as We, U as Ge, Un as Ke, Ut as qe, V as Je, Vn as Ye, Vt as Xe, W as Ze, Wn as Qe, Wt as $e, X as et, Xn as tt, Xt as nt, Y as rt, Yn as it, Yt as _, Z as at, Zn as ot, Zt as st, _ as ct, _n as lt, _t as ut, a as dt, an as ft, ar as pt, at as mt, b as ht, bn as gt, bt as _t, c as vt, cn as yt, cr as bt, ct as xt, d as St, dn as Ct, dt as wt, en as Tt, er as Et, et as v, f as Dt, fn as Ot, ft as kt, g as At, gn as y, gt as jt, h as Mt, hn as Nt, ht as Pt, i as Ft, in as It, ir as Lt, it as Rt, j as zt, jn as Bt, jt as Vt, k as b, kn as Ht, kt as x, l as Ut, ln as Wt, lt as Gt, m as Kt, mn as qt, mt as S, n as Jt, nn as Yt, nr as Xt, nt as Zt, o as Qt, on as $t, or as en, ot as tn, p as nn, pn as rn, pt as an, q as on, qn as sn, qt as cn, r as ln, rn as un, rr as dn, rt as fn, sn as pn, sr as mn, st as hn, t as gn, tn as _n, tr as vn, tt as yn, u as bn, un as xn, ut as Sn, v as Cn, vn as wn, vt as Tn, w as En, wn as Dn, wt as On, x as kn, xn as An, xt as jn, y as Mn, yn as C, yt as Nn, z as Pn, zn as Fn, zt as In } from "./geodesyPointReportContext-QJxt1m06.js";
import Ln from "ol/layer/Vector";
//#region src/presets/geodesyPublicAttributeKeys.ts
var w = [
	"id",
	"groupe_type",
	"picto",
	"nom",
	"no",
	"commune",
	"etat",
	"localisation",
	"type",
	"img1_url",
	"img2_url",
	"url_pdf",
	"vis_date",
	"maj_date",
	"remarque"
], T = [
	"RBF",
	"RDF",
	"RN"
], Rn = ["RBF"];
function zn(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.enableWfsLayers ? e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"] : [];
}
function Bn(e = {}) {
	let t = zn(e), n = [...T, "TOUT"];
	return _({
		...e,
		layerIds: e.layerIds ?? n,
		uiLayerIds: e.uiLayerIds ?? T,
		dataLayerId: e.dataLayerId ?? "TOUT",
		attributeKeys: e.attributeKeys ?? w,
		wfsLayerIds: t,
		wfsUiLayerIds: e.wfsUiLayerIds ?? t,
		wfsApiKey: e.wfsApiKey?.trim() || void 0,
		wfsCluster: e.wfsCluster ?? { enabled: !1 },
		annexLayerIds: e.annexLayerIds ?? [],
		annexUiLayerIds: e.annexUiLayerIds ?? []
	});
}
//#endregion
//#region src/presets/geodesyExpertCatalog.ts
var Vn = "DATA_GEOD", Hn = "GDP";
function E(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"];
}
function D(e) {
	return e.wfsDomainLayers === void 0 ? Xe : e.wfsDomainLayers;
}
function Un(e) {
	return e.wfsAttributeFilters === void 0 ? a : e.wfsAttributeFilters;
}
function O(e = {}) {
	let t = D(e);
	if (t.length > 0) return t.map((e) => e.id);
	let n = E(e), r = n.includes("DATA_GEOD") ? Vn : n[0];
	return r ? [r] : [];
}
function k(e = {}) {
	let t = E(e), n = D(e), r = Un(e);
	return _({
		...e,
		layerIds: e.layerIds ?? ["TOUT"],
		uiLayerIds: e.uiLayerIds ?? [],
		networkLayerIds: e.networkLayerIds ?? [],
		dataLayerId: e.dataLayerId ?? "TOUT",
		attributeKeys: e.attributeKeys ?? y,
		wfsLayerIds: t,
		wfsUiLayerIds: e.wfsUiLayerIds ?? t,
		wfsDomainLayers: n,
		wfsDomainSourceLayerId: e.wfsDomainSourceLayerId ?? (t.includes("DATA_GEOD") ? "DATA_GEOD" : void 0),
		wfsAttributeFilters: r,
		wfsApiKey: e.wfsApiKey?.trim() || void 0,
		annexLayerIds: e.annexLayerIds ?? ["GDP_RGP2"],
		annexUiLayerIds: e.annexUiLayerIds ?? ["GDP_RGP2"]
	});
}
//#endregion
//#region src/presets/geodesyProfileCatalog.ts
function Wn(e) {
	return e === "public" || e === "expert";
}
function Gn(e, t = {}) {
	return e === "expert" ? k(t) : Bn(t);
}
function Kn(e, t = {}) {
	return e === "expert" ? O(t) : Rn;
}
function qn(e, t = {}) {
	if (e !== "expert") return {};
	let n = t.wfsAttributeFilters ?? a;
	return g(n);
}
//#endregion
//#region src/annex/isGeodesyLayerReportingEnabled.ts
function Jn(e, t) {
	if (!t) return !0;
	let n = e.annexLayers.find((e) => e.id === t);
	return n ? n.reportingEnabled ?? !1 : !0;
}
//#endregion
//#region src/annex/reloadGeodesyAnnexLayerOnMap.ts
function Yn(e, t) {
	let n = b(e);
	if (!n) return null;
	for (let e of n.getLayers().getArray()) if (e instanceof Ln && e.get("geodesyLayerKind") === "annex" && e.get("geodesyLayerId") === t) return e;
	return null;
}
async function Xn(e, t) {
	let n = x(e), r = n.annexLayers.find((e) => e.id === t);
	if (!r) throw Error(`[gdp-tools] Annex layer "${t}" is not registered on the map.`);
	let i = Yn(e, t);
	if (!i) throw Error(`[gdp-tools] Annex vector layer "${t}" was not found on the map.`);
	let a = i.getSource();
	if (!a) throw Error(`[gdp-tools] Annex vector layer "${t}" has no source.`);
	Ne(r, n), a.clear();
	let o = await v({
		definition: r,
		catalog: n
	});
	a.addFeatures(o);
}
//#endregion
//#region src/constants/geodesyGdpProprio.ts
var Zn = "1255", Qn = 15e3, A = 40, j = new ie(512);
function M(e) {
	return `${m(e.domaine) ?? ""}:${e.id.trim()}`;
}
function N(e) {
	return /^\d+$/.test(e) ? e : `'${e.replace(/'/g, "''")}'`;
}
function $n(e) {
	return e.map((e) => `(id=${N(e.id.trim())} AND domaine=${N(m(e.domaine) ?? "")})`).join(" OR ");
}
function P(e, t) {
	return `${e}|${M(t)}`;
}
async function er(e) {
	let { catalog: t, refs: n, layerId: r = "DATA_GEOD", propertyNames: i, timeoutMs: a = Qn } = e, o = /* @__PURE__ */ new Map(), c = t.wfsLayers.find((e) => e.id === r) ?? s.find((e) => e.id === r);
	if (!c || !f(c, t.wfsApiKey)) return o;
	let l = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (!e.id.trim() || !m(e.domaine)) continue;
		let t = M(e), n = j.get(P(r, e));
		n ? o.set(t, n) : n === void 0 && l.set(t, e);
	}
	let u = [...l.values()];
	for (let e = 0; e < u.length; e += A) {
		let n = u.slice(e, e + A), s = h({
			wfsUrl: p(c, t.wfsUrl),
			typeName: c.typeName,
			apiKey: c.requiresApiKey ? t.wfsApiKey : void 0,
			cqlFilter: $n(n),
			propertyNames: i,
			version: c.version,
			outputFormat: "application/json",
			useCacheBuster: !1
		}), l = await fetch(s, {
			signal: AbortSignal.timeout(a),
			credentials: "omit",
			mode: "cors"
		});
		if (!l.ok) throw Error(`[gdp-tools] WFS GetFeature by ref failed (${l.status})`);
		let d = await l.json();
		for (let e of d.features ?? []) {
			let t = e.properties;
			if (!t || t.id == null || t.domaine == null) continue;
			let n = {
				id: String(t.id),
				domaine: String(t.domaine)
			};
			o.set(M(n), t), j.set(P(r, n), t);
		}
		for (let e of n) o.has(M(e)) || j.set(P(r, e), null);
	}
	return o;
}
//#endregion
//#region src/cache/geodesyCacheStats.ts
function tr() {
	let e = Pt(), t = An();
	return {
		featureInfoEntryCount: e.entryCount,
		featureInfoSizeBytes: e.sizeBytes,
		imageEntryCount: t.entryCount,
		imageSizeBytes: t.sizeBytes
	};
}
function nr() {
	S(), C();
}
//#endregion
//#region src/report/geodesyPointReportConstants.ts
var rr = "gdp-tools", F = [{
	role: "photo1",
	attachmentKey: "photo0",
	label: "Photo du repère",
	mandatory: !0
}, {
	role: "photo2",
	attachmentKey: "photo1",
	label: "Photo complémentaire",
	mandatory: !1
}], I = [
	"id",
	"domaine",
	"nom",
	"no",
	"type",
	"etat",
	"commune"
], L = [
	"id",
	"domaine",
	"etat",
	"gps",
	"move"
], R = ["id", "domaine"], z = [
	"nivf",
	"nivo",
	"nive"
], B = ["rsge", "nive"];
function V(e) {
	return m(e.properties.domaine ?? e.properties.DOMAINE);
}
function ir(e) {
	let t = V(e);
	return t ? new Set(z.map((e) => e.toLowerCase())).has(t) : !1;
}
function ar(e) {
	let t = V(e);
	return !t || !new Set(B.map((e) => e.toLowerCase())).has(t);
}
function or(e, t) {
	return {
		...e,
		longitude: t.longitude,
		latitude: t.latitude
	};
}
//#endregion
//#region src/report/geodesyPointReportPrefill.ts
function sr(e) {
	for (let t of ["id", "ID"]) {
		let n = e[t];
		if (n == null) continue;
		let r = String(n).trim();
		if (r) return r;
	}
}
var cr = {
	id: [
		"id",
		"identifiant",
		"geodesyid",
		"geodesy_id",
		"id_repere",
		"idrepere"
	],
	domaine: [
		"domaine",
		"domain",
		"code_domaine"
	],
	nom: [
		"nom",
		"name",
		"libelle",
		"libelle_repere"
	],
	no: [
		"no",
		"numero",
		"numero_repere",
		"num_repere"
	],
	type: [
		"type",
		"groupe_type",
		"groupetype"
	],
	etat: [
		"etat",
		"state",
		"etat du point",
		"etat_du_point",
		"etatdupoint"
	],
	gps: [
		"gps",
		"expl_gps",
		"expl_gpscode",
		"exploitation gps",
		"exploitation_gps"
	],
	move: [
		"move",
		"deplace",
		"deplacement",
		"moved",
		"position_modifiee"
	],
	commune: ["commune", "nom_commune"]
};
function H(e) {
	return e.trim().toLowerCase();
}
function U(e, t, n) {
	if (n == null) return;
	let r = String(n).trim();
	if (!r) return;
	let i = H(t);
	e[i] || (e[i] = r);
}
function W(e) {
	let t = {};
	for (let [n, r] of Object.entries(e.properties)) U(t, n, r);
	return U(t, "id", e.geodesyId ?? sr(e.properties)), U(t, "domaine", e.properties.domaine ?? e.properties.DOMAINE), U(t, "gps", e.properties.expl_gps ?? e.properties.expl_gpscode ?? e.properties.gps), t;
}
function G(e) {
	let t = H(e), n = /* @__PURE__ */ new Set([t]);
	for (let [e, r] of Object.entries(cr)) {
		let i = H(e), a = r.map((e) => H(e));
		if (t === i || a.includes(t)) {
			n.add(i);
			for (let e of a) n.add(e);
		}
	}
	return [...n];
}
function K(e, t) {
	let n = new Set(G(e));
	return t.find((e) => n.has(H(e)));
}
function q(e) {
	let t = H(e);
	return R.some((e) => e.toLowerCase() === t);
}
function lr(e) {
	return J(e, "id") !== void 0;
}
function J(e, t, n = W(e)) {
	for (let e of G(t)) {
		let t = n[e];
		if (t) return t;
	}
}
function ur(e, t, n = W(e)) {
	return !q(t) || J(e, t, n) !== void 0;
}
//#endregion
//#region src/report/geodesyPointReportListValues.ts
var Y = [
	"NON RENSEIGNE",
	"EXPLOITABLE DIRECTEMENT PAR GPS",
	"INEXPLOITABLE PAR GPS",
	"AUCUNE INFORMATION",
	"EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE"
], dr = {
	E: "EXPLOITABLE DIRECTEMENT PAR GPS",
	R: "EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE",
	I: "INEXPLOITABLE PAR GPS",
	N: "NON RENSEIGNE"
}, fr = {
	D: "DETRUIT",
	E: "BON ETAT",
	I: "IMPRENABLE",
	M: "MAUVAIS ETAT",
	N: "NON RETROUVE",
	P: "PRESUME DEPLACE",
	Y: "DETRUIT APRES OBSERVATION"
};
function X(e) {
	return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}
function Z(e, t) {
	let n = e.trim();
	if (!n || t.length === 0) return;
	let r = t.find((e) => e === n);
	if (r) return r;
	let i = X(n);
	return t.find((e) => X(e) === i);
}
function pr(e) {
	return dr[e.trim().toUpperCase()] ?? e;
}
function mr(e) {
	return fr[e.trim().toUpperCase()] ?? e;
}
function hr(e) {
	return K(e, ["gps"]) !== void 0;
}
function gr(e) {
	return K(e, ["etat"]) !== void 0;
}
function _r(e) {
	return K(e, ["move"]) !== void 0;
}
function vr(e) {
	let t = X(e);
	return [
		"true",
		"1",
		"oui",
		"yes"
	].includes(t) ? "true" : [
		"false",
		"0",
		"non",
		"no"
	].includes(t) ? "false" : e;
}
function yr(e, t, n = []) {
	let r = t.trim(), i = hr(e), a = gr(e), o = _r(e), s = n.length > 0 ? n : i ? Y : [], c = [
		r,
		i ? pr(r) : void 0,
		a ? mr(r) : void 0,
		o ? vr(r) : void 0
	].filter((e) => !!e?.trim());
	if (s.length === 0) return c[0];
	for (let e of c) {
		let t = Z(e, s);
		if (t) return t;
	}
	if (i) return Z("NON RENSEIGNE", s) ?? Z("AUCUNE INFORMATION", s) ?? s[0];
	if (o) return Z("false", s) ?? s[0];
}
//#endregion
//#region src/report/buildGeodesyPointReportThemeAttributes.ts
function br(e) {
	let t = W(e), n = {};
	for (let r of R) {
		let i = J(e, r, t);
		i && (n[r] = i);
	}
	return n;
}
function xr(e, t) {
	let n = t[e]?.trim();
	if (n) return n;
	for (let [n, r] of Object.entries(t)) {
		let t = r.trim();
		if (t && K(n, [e])) return t;
	}
}
function Sr(e, t) {
	return t.find((t) => t.name === e || K(t.name, [e]) !== void 0 || K(e, [t.name]) !== void 0);
}
function Cr(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) {
		let e = Sr(r, t), a = yr(r, i, e?.values ?? []);
		a ? n[r] = a : e?.values?.length || (n[r] = i);
	}
	return n;
}
function Q(e, t = {}) {
	let n = W(e), r = t.formAttributes ?? {}, i = (t.themeAttributeNames ?? []).filter((e) => e.trim()), a = i.length > 0 ? i : t.keys ?? I, o = {};
	for (let t of a) {
		let i = xr(t, r);
		if (i) {
			o[t] = i;
			continue;
		}
		let a = J(e, t, n);
		a && (o[t] = a);
	}
	for (let r of t.autofilledAttributes ?? []) {
		if (o[r.name] !== void 0) continue;
		let t = J(e, r.name, n);
		t ? o[r.name] = t : r.default && (o[r.name] = r.default);
	}
	for (let [e, t] of Object.entries(r)) {
		let n = t.trim();
		if (!n) continue;
		let r = K(e, a);
		r && (o[r] = n);
	}
	for (let e of a) _r(e) && o[e] === void 0 && (o[e] = "false");
	return Cr($(e, o), t.themeAttributeDefs ?? t.autofilledAttributes ?? []);
}
function wr(e, t) {
	return Q(e, t);
}
function Tr(e, t) {
	let n = [...(t?.themeAttributeNames ?? []).filter((e) => e.trim())];
	for (let e of L) K(e, n) || n.push(e);
	return Q(e, {
		...t,
		themeAttributeNames: n,
		keys: L
	});
}
function $(e, t) {
	return {
		...t,
		...br(e)
	};
}
//#endregion
//#region src/report/mapGeodesyPointReportToApiBody.ts
function Er(e, t) {
	let n = $(e, t.themeAttributes ?? wr(e, t.attributeKeys ? { keys: t.attributeKeys } : void 0)), r = {
		community: t.communityId,
		theme: t.theme ?? "gdp-tools",
		attributes: n
	};
	return {
		geometry: `POINT(${e.longitude} ${e.latitude})`,
		community: t.communityId,
		comment: t.comment,
		status: t.status ?? "submit",
		attributes: JSON.stringify(r)
	};
}
//#endregion
//#region src/report/buildGeodesyReportAttachmentsBody.ts
function Dr(e) {
	let t = {};
	for (let n of F) {
		let r = e.find((e) => e.role === n.role);
		r && (t[n.attachmentKey] = r.blob);
	}
	return t;
}
//#endregion
export { n as DEFAULT_GEODESY_ATTRIBUTE_CATALOG, cn as DEFAULT_GEODESY_CATALOG, a as DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS, ct as DEFAULT_GEODESY_EXTERNAL_URL_SOURCE, Tt as DEFAULT_GEODESY_TITLE_KEYS, te as DEFAULT_GEODESY_WFS_CLUSTER, Xe as DEFAULT_GEODESY_WFS_DOMAIN_LAYERS, Ht as DEFAULT_GEODESY_WFS_PICTO_URL_MAPS, De as DEFAULT_GEODESY_WFS_POINT_STYLE, $t as EXCLUDED_GEODESY_ATTRIBUTE_KEYS, L as GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS, Ze as GDP_RGP2_AVAILABILITY_COLORS, le as GDP_RGP2_AVAILABILITY_LABELS, Y as GDP_THEME_GPS_VALUES, y as GEODESIE_DATA_ATTRIBUTE_KEYS, sn as GEODESY_ANNEX_LAYERS, ve as GEODESY_ANNEX_LAYER_IDS, lt as GEODESY_ATTRIBUTE_LABELS, ye as GEODESY_CATALOG_PROPERTY, ot as GEODESY_DATA_LAYER_ID, Pe as GEODESY_ENRICHMENT_LAYER_IDS, Hn as GEODESY_EXPERT_WFS_FALLBACK_LAYER, Vn as GEODESY_EXPERT_WFS_PRIMARY_LAYER, i as GEODESY_GDP_PICTO_URLS, Zn as GEODESY_GDP_PROPRIETAIRE_IGN_ID, it as GEODESY_GDP_RGP2_ATTRIBUTE_KEYS, nn as GEODESY_GDP_RGP2_FICHE_LINK_LABEL, Kt as GEODESY_GDP_RGP2_FICHE_LINK_TEXT, Mt as GEODESY_GDP_RGP2_FICHE_URL, tt as GEODESY_GDP_RGP2_URL, t as GEODESY_LAYER_GROUP_NAME, Et as GEODESY_LAYER_ID_PROPERTY, Fn as GEODESY_LAYER_KIND_PROPERTY, Re as GEODESY_NETWORK_FILTER_CATEGORIES, vn as GEODESY_NETWORK_LAYER_IDS, je as GEODESY_PICTO_SYMBOL_BASE_URL, B as GEODESY_POINT_REPORT_BLOCKED_DOMAINES, R as GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS, F as GEODESY_POINT_REPORT_PHOTO_SLOTS, z as GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES, rr as GEODESY_POINT_REPORT_THEME, I as GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS, w as GEODESY_PUBLIC_ATTRIBUTE_KEYS, Rn as GEODESY_PUBLIC_DEFAULT_ACTIVE, T as GEODESY_PUBLIC_WMS_UI_LAYER_IDS, Xt as GEODESY_UI_LAYERS, Vt as GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY, pe as GEODESY_WFS_DATA_LAYER_PROPERTY, qe as GEODESY_WFS_DOMAINE_PROPERTY, $e as GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY, s as GEODESY_WFS_LAYERS, Ye as GEODESY_WFS_LAYER_IDS, fe as GEODESY_WFS_PRIVATE_URL, Ke as GEODESY_WFS_PUBLIC_URL, Qe as GEODESY_WFS_URL, dn as GEODESY_WMS_GP_OL_EXT, Lt as GEODESY_WMS_LAYER, pt as GEODESY_WMS_LAYERS, en as GEODESY_WMS_LAYER_IDS, mn as GEODESY_WMS_STYLE, bt as GEODESY_WMS_URL, Cn as appendGeodesySourceParam, Tr as buildGdpPointReportThemeAttributes, At as buildGdpRgp2StationFicheUrl, Jt as buildGeodesyPointDisplay, gn as buildGeodesyPointReportContext, br as buildGeodesyPointReportMandatoryThemeAttributes, W as buildGeodesyPointReportPrefillMap, wr as buildGeodesyPointReportThemeAttributes, ln as buildGeodesyPointTitleDisplay, jt as buildGeodesyPopupTemplate, Dr as buildGeodesyReportAttachmentsBody, h as buildGeodesyWfsGetFeatureUrl, Rt as buildGeodesyWfsHitFromExplodedClusterFeature, ut as buildPartnerLogoUrl, nr as clearAllGeodesyCaches, Ne as clearGeodesyAnnexFeaturesCache, S as clearGeodesyFeatureInfoCache, C as clearGeodesyImageCache, kn as clearGeodesyWfsAttributeFilterValues, We as clearGeodesyWfsClusterExplosion, yr as coerceGeodesyPointReportListValue, gt as collectGeodesyImageUrlsFromHits, vt as collectGeodesyPointPhotos, Ut as collectGeodesyWfsVectorSources, Tn as collectPartnerIdFromProperties, Nn as collectPartnerIdsFromHits, Te as countActiveGeodesyWfsAttributeFilters, g as createDefaultGeodesyWfsAttributeFilterValues, de as createGeodesyAnnexLayer, _n as createGeodesyAttributeCatalog, _ as createGeodesyCatalog, Gn as createGeodesyCatalogForProfile, k as createGeodesyExpertCatalog, Mn as createGeodesyExternalUrlTransform, Ge as createGeodesyGdpRgp2StyleFunction, zt as createGeodesyLayerGroup, Bn as createGeodesyPublicCatalog, Me as createGeodesyWfsAttributeFilterValuesHolder, o as createGeodesyWfsClusterStyleFunction, Pn as createGeodesyWfsDisplayFilterStyleFunction, Ee as createGeodesyWfsLayer, se as createGeodesyWfsPictoStyleFunction, Ce as createGeodesyWmsLayer, Kn as defaultGeodesyActiveLayerIdsForProfile, O as defaultGeodesyExpertActiveLayerIds, En as defaultGeodesyLayerVisibility, qn as defaultGeodesyWfsAttributeFilterValuesForProfile, Ft as extractGeodesyCoordinates, V as extractGeodesyPointReportDomaine, Sn as featureMatchesVisibleNetworkLayers, er as fetchGeodesyWfsPointsByRef, be as formatGdpRgp2DispoForDisplay, pn as formatGeodesyAttributeImageUrlHtml, yt as formatGeodesyAttributeLabel, Wt as formatGeodesyAttributeUrlHtml, dt as formatGeodesyHitAsComment, Ie as formatGeodesyWfsBbox, Qt as formatMapCoordinateSubtitle, M as geodesyPointRefKey, ce as geodesyWfsFeatureMatchesAttributeFilters, ue as geodesyWfsFeatureMatchesDomaines, e as getGeodesyAnnexFeaturesLastLoadedAt, wn as getGeodesyAttributeLabel, Yt as getGeodesyAttributeLabelFromCatalog, tr as getGeodesyCacheStats, x as getGeodesyCatalogFromMap, nt as getGeodesyCatalogLayerIds, b as getGeodesyLayerGroup, He as getGeodesyLayersVisibility, xn as getGeodesyScalarPropertyEntries, ze as getGeodesyWfsAttributeFilterValues, ae as getGeodesyWfsClusterSelectInteraction, bn as getGeodesyWfsLoadingState, ge as getGeodesyWfsMultiChoiceSelectedValues, st as getLayerDefinition, Fe as getLayerStackIndex, on as hasGdpRgp2DispoData, mt as hasGeodesyWfsMultiClusterAtPixel, re as isAnyGeodesyLayerVisible, Ct as isEmptyGeodesyAttributeValue, Ot as isExcludedGeodesyAttributeKey, un as isExcludedGeodesyAttributeKeyForCatalog, _e as isGdpRgp2StationAvailable, rn as isGeodesyAttributeImageUrl, qt as isGeodesyAttributePicto, Nt as isGeodesyAttributeUrl, Jn as isGeodesyLayerReportingEnabled, ar as isGeodesyPointReportAllowed, lr as isGeodesyPointReportExistingRepere, q as isGeodesyPointReportMandatoryAttributeName, ir as isGeodesyPointReportPositionEditable, Wn as isGeodesyProfile, In as isGeodesyTripletPoint, f as isGeodesyWfsLayerActive, v as loadGeodesyAnnexFeatures, Ae as loadGeodesyWfsFeatures, Er as mapGeodesyPointReportToApiBody, Z as matchGeodesyPointReportListValue, K as matchGeodesyPointReportThemeAttributeName, wt as mergeGeodesyFeatureHits, kt as mergeGeodesyFeatureProperties, Bt as mergeGeodesyPictoUrlMaps, $ as mergeGeodesyPointReportMandatoryThemeAttributes, he as normalizeGeodesyPictoCode, H as normalizeGeodesyPointReportAttributeName, X as normalizeGeodesyPointReportComparableValue, m as normalizeGeodesyWfsDomaine, rt as parseGdpRgp2DispoStates, yn as parseGeodesyGdpRgp2, me as parseGeodesyWfsCsv, oe as parseGeodesyWfsGeoJson, Be as prefetchGeodesyImage, u as prefetchGeodesyImages, Dn as prefetchGeodesyImagesFromHits, _t as prefetchPartnerLogo, jn as prefetchPartnerLogoById, Ve as prefetchPartnerLogos, d as prefetchPartnerLogosFromHits, xt as queryGeodesyAnnexAtPixel, fn as queryGeodesyAtClick, Gt as queryGeodesyAtCoordinate, tn as queryGeodesyWfsAtPixel, r as registerGeodesyOnMap, Zt as registerGeodesyPopup, ne as registerGeodesyWfsClusterSelect, Xn as reloadGeodesyAnnexLayerOnMap, et as resolveGdpRgp2AvailabilityLevel, ht as resolveGeodesyExternalUrlSource, Dt as resolveGeodesyHitAttributeCatalog, Ue as resolveGeodesyImageDisplayUrl, an as resolveGeodesyLayerTitle, c as resolveGeodesyNetworkFilterCategories, we as resolveGeodesyPictoImageUrl, xe as resolveGeodesyPictoUrl, J as resolveGeodesyPointReportPrefillValue, It as resolveGeodesyPopupTitle, Se as resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds, ke as resolveGeodesyWfsClusterConfig, hn as resolveGeodesyWfsHitFeature, Le as resolveGeodesyWfsLayerStyle, p as resolveGeodesyWfsLayerUrl, On as resolvePartnerLogoDisplayUrl, ft as selectGeodesyDisplayEntries, Q as selectGeodesyPointReportThemeAttributes, ee as setGeodesyLayerVisible, Oe as setGeodesyLayersVisibility, l as setGeodesyWfsAttributeFilterValues, ur as shouldShowGeodesyPointReportThemeAttribute, St as subscribeGeodesyWfsLoading, at as translateGdpRgp2DispoDigit, or as withGeodesyPointReportPosition, Je as wrapGeodesyWfsStyleForCluster };
