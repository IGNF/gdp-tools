import { $ as e, $n as t, $t as n, A as r, An as i, At as a, B as o, Bn as s, Bt as c, C as l, Cn as u, Ct as d, D as ee, Dn as te, E as ne, En as re, Et as ie, F as ae, Fn as oe, Ft as se, G as ce, Gn as f, Gt as p, H as le, Hn as ue, Ht as de, I as fe, In as pe, It as me, J as he, Jn as ge, Jt as m, K as _e, Kn as ve, Kt as ye, L as be, Ln as xe, Lt as Se, M as Ce, Mn as we, Mt as h, N as Te, Nn as Ee, Nt as De, O as g, On as Oe, Ot as _, P as ke, Pn as Ae, Pt as je, Q as Me, Qn as Ne, Qt as Pe, R as Fe, Rn as Ie, Rt as Le, S as Re, Sn as ze, St as Be, T as Ve, Tn as He, Tt as Ue, U as We, Un as Ge, Ut as Ke, V as qe, Vn as Je, Vt as Ye, W as Xe, Wn as v, Wt as Ze, X as Qe, Xn as $e, Xt as et, Y as tt, Yn as nt, Yt as rt, Z as y, Zn as it, Zt as at, _ as ot, _n as st, _t as ct, a as lt, an as ut, ar as dt, at as ft, b as pt, bn as mt, bt as ht, c as gt, cn as _t, ct as vt, d as yt, dn as bt, dt as xt, en as St, er as Ct, et as wt, f as Tt, fn as Et, ft as Dt, g as Ot, gn as kt, gt as At, h as jt, hn as b, ht as Mt, i as Nt, in as Pt, ir as Ft, it as It, j as Lt, jn as Rt, jt as zt, k as Bt, kn as Vt, kt as x, l as Ht, ln as Ut, lt as Wt, m as Gt, mn as Kt, mt as qt, n as Jt, nn as Yt, nr as Xt, nt as Zt, o as Qt, on as $t, or as en, ot as tn, p as nn, pn as rn, pt as S, q as an, qn as on, qt as sn, r as cn, rn as ln, rr as un, rt as dn, s as fn, sn as pn, sr as mn, st as hn, t as gn, tn as _n, tr as vn, tt as yn, u as bn, un as xn, ut as Sn, v as Cn, vn as C, vt as wn, w as Tn, wn as En, wt as Dn, x as On, xn as kn, xt as An, y as jn, yn as Mn, yt as Nn, z as Pn, zn as w, zt as Fn } from "./geodesyPointReportContext-B03jrT89.js";
import In from "ol/layer/Vector";
//#region src/presets/geodesyPublicAttributeKeys.ts
var T = [
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
], E = [
	"RBF",
	"RDF",
	"RN"
], Ln = ["RBF"];
function Rn(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.enableWfsLayers ? e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"] : [];
}
function zn(e = {}) {
	let t = Rn(e), n = [...E, "TOUT"];
	return m({
		...e,
		layerIds: e.layerIds ?? n,
		uiLayerIds: e.uiLayerIds ?? E,
		dataLayerId: e.dataLayerId ?? "TOUT",
		attributeKeys: e.attributeKeys ?? T,
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
var Bn = "DATA_GEOD", Vn = "GDP";
function Hn(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"];
}
function D(e) {
	return e.wfsDomainLayers === void 0 ? c : e.wfsDomainLayers;
}
function Un(e) {
	return e.wfsAttributeFilters === void 0 ? x : e.wfsAttributeFilters;
}
function O(e = {}) {
	let t = D(e);
	if (t.length > 0) return t.map((e) => e.id);
	let n = Hn(e), r = n.includes("DATA_GEOD") ? Bn : n[0];
	return r ? [r] : [];
}
function k(e = {}) {
	let t = Hn(e), n = D(e), r = Un(e);
	return m({
		...e,
		layerIds: e.layerIds ?? ["TOUT"],
		uiLayerIds: e.uiLayerIds ?? [],
		networkLayerIds: e.networkLayerIds ?? [],
		dataLayerId: e.dataLayerId ?? "TOUT",
		attributeKeys: e.attributeKeys ?? b,
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
	return e === "expert" ? k(t) : zn(t);
}
function Kn(e, t = {}) {
	return e === "expert" ? O(t) : Ln;
}
function qn(e, t = {}) {
	if (e !== "expert") return {};
	let n = t.wfsAttributeFilters ?? x;
	return h(n);
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
	let n = g(e);
	if (!n) return null;
	for (let e of n.getLayers().getArray()) if (e instanceof In && e.get("geodesyLayerKind") === "annex" && e.get("geodesyLayerId") === t) return e;
	return null;
}
async function Xn(t, n) {
	let r = _(t), i = r.annexLayers.find((e) => e.id === n);
	if (!i) throw Error(`[gdp-tools] Annex layer "${n}" is not registered on the map.`);
	let a = Yn(t, n);
	if (!a) throw Error(`[gdp-tools] Annex vector layer "${n}" was not found on the map.`);
	let o = a.getSource();
	if (!o) throw Error(`[gdp-tools] Annex vector layer "${n}" has no source.`);
	y(i, r), o.clear();
	let s = await e({
		definition: i,
		catalog: r
	});
	o.addFeatures(s);
}
//#endregion
//#region src/constants/geodesyGdpProprio.ts
var Zn = "1255", Qn = 15e3, A = 40, j = new He(512);
function M(e) {
	return `${p(e.domaine) ?? ""}:${e.id.trim()}`;
}
function N(e) {
	return /^\d+$/.test(e) ? e : `'${e.replace(/'/g, "''")}'`;
}
function $n(e) {
	return e.map((e) => `(id=${N(e.id.trim())} AND domaine=${N(p(e.domaine) ?? "")})`).join(" OR ");
}
function P(e, t) {
	return `${e}|${M(t)}`;
}
async function er(e) {
	let { catalog: t, refs: n, layerId: r = "DATA_GEOD", propertyNames: i, timeoutMs: a = Qn } = e, o = /* @__PURE__ */ new Map(), s = t.wfsLayers.find((e) => e.id === r) ?? w.find((e) => e.id === r);
	if (!s || !v(s, t.wfsApiKey)) return o;
	let c = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (!e.id.trim() || !p(e.domaine)) continue;
		let t = M(e), n = j.get(P(r, e));
		n ? o.set(t, n) : n === void 0 && c.set(t, e);
	}
	let l = [...c.values()];
	for (let e = 0; e < l.length; e += A) {
		let n = l.slice(e, e + A), c = fe({
			wfsUrl: f(s, t.wfsUrl),
			typeName: s.typeName,
			apiKey: s.requiresApiKey ? t.wfsApiKey : void 0,
			cqlFilter: $n(n),
			propertyNames: i,
			version: s.version,
			outputFormat: "application/json",
			useCacheBuster: !1
		}), u = await fetch(c, {
			signal: AbortSignal.timeout(a),
			credentials: "omit",
			mode: "cors"
		});
		if (!u.ok) throw Error(`[gdp-tools] WFS GetFeature by ref failed (${u.status})`);
		let d = await u.json();
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
	let e = qt(), t = mt();
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
	return p(e.properties.domaine ?? e.properties.DOMAINE);
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
export { Pe as DEFAULT_GEODESY_ATTRIBUTE_CATALOG, ye as DEFAULT_GEODESY_CATALOG, x as DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS, Ot as DEFAULT_GEODESY_EXTERNAL_URL_SOURCE, n as DEFAULT_GEODESY_TITLE_KEYS, re as DEFAULT_GEODESY_WFS_CLUSTER, c as DEFAULT_GEODESY_WFS_DOMAIN_LAYERS, Oe as DEFAULT_GEODESY_WFS_PICTO_URL_MAPS, we as DEFAULT_GEODESY_WFS_POINT_STYLE, ut as EXCLUDED_GEODESY_ATTRIBUTE_KEYS, L as GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS, We as GDP_RGP2_AVAILABILITY_COLORS, Xe as GDP_RGP2_AVAILABILITY_LABELS, Y as GDP_THEME_GPS_VALUES, b as GEODESIE_DATA_ATTRIBUTE_KEYS, ve as GEODESY_ANNEX_LAYERS, on as GEODESY_ANNEX_LAYER_IDS, kt as GEODESY_ATTRIBUTE_LABELS, sn as GEODESY_CATALOG_PROPERTY, $e as GEODESY_DATA_LAYER_ID, it as GEODESY_ENRICHMENT_LAYER_IDS, Vn as GEODESY_EXPERT_WFS_FALLBACK_LAYER, Bn as GEODESY_EXPERT_WFS_PRIMARY_LAYER, Vt as GEODESY_GDP_PICTO_URLS, Zn as GEODESY_GDP_PROPRIETAIRE_IGN_ID, ge as GEODESY_GDP_RGP2_ATTRIBUTE_KEYS, Tt as GEODESY_GDP_RGP2_FICHE_LINK_LABEL, nn as GEODESY_GDP_RGP2_FICHE_LINK_TEXT, Gt as GEODESY_GDP_RGP2_FICHE_URL, nt as GEODESY_GDP_RGP2_URL, Ne as GEODESY_LAYER_GROUP_NAME, t as GEODESY_LAYER_ID_PROPERTY, Ie as GEODESY_LAYER_KIND_PROPERTY, Se as GEODESY_NETWORK_FILTER_CATEGORIES, Ct as GEODESY_NETWORK_LAYER_IDS, Ee as GEODESY_PICTO_SYMBOL_BASE_URL, B as GEODESY_POINT_REPORT_BLOCKED_DOMAINES, R as GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS, F as GEODESY_POINT_REPORT_PHOTO_SLOTS, z as GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES, rr as GEODESY_POINT_REPORT_THEME, I as GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS, T as GEODESY_PUBLIC_ATTRIBUTE_KEYS, Ln as GEODESY_PUBLIC_DEFAULT_ACTIVE, E as GEODESY_PUBLIC_WMS_UI_LAYER_IDS, vn as GEODESY_UI_LAYERS, a as GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY, Ye as GEODESY_WFS_DATA_LAYER_PROPERTY, de as GEODESY_WFS_DOMAINE_PROPERTY, Ke as GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY, w as GEODESY_WFS_LAYERS, s as GEODESY_WFS_LAYER_IDS, Je as GEODESY_WFS_PRIVATE_URL, ue as GEODESY_WFS_PUBLIC_URL, Ge as GEODESY_WFS_URL, Xt as GEODESY_WMS_GP_OL_EXT, un as GEODESY_WMS_LAYER, Ft as GEODESY_WMS_LAYERS, dt as GEODESY_WMS_LAYER_IDS, en as GEODESY_WMS_STYLE, mn as GEODESY_WMS_URL, ot as appendGeodesySourceParam, Tr as buildGdpPointReportThemeAttributes, jt as buildGdpRgp2StationFicheUrl, Jt as buildGeodesyPointDisplay, gn as buildGeodesyPointReportContext, br as buildGeodesyPointReportMandatoryThemeAttributes, W as buildGeodesyPointReportPrefillMap, wr as buildGeodesyPointReportThemeAttributes, cn as buildGeodesyPointTitleDisplay, Mt as buildGeodesyPopupTemplate, Dr as buildGeodesyReportAttachmentsBody, fe as buildGeodesyWfsGetFeatureUrl, dn as buildGeodesyWfsHitFromExplodedClusterFeature, At as buildPartnerLogoUrl, nr as clearAllGeodesyCaches, y as clearGeodesyAnnexFeaturesCache, S as clearGeodesyFeatureInfoCache, C as clearGeodesyImageCache, pt as clearGeodesyWfsAttributeFilterValues, Dn as clearGeodesyWfsClusterExplosion, yr as coerceGeodesyPointReportListValue, Mn as collectGeodesyImageUrlsFromHits, fn as collectGeodesyPointPhotos, gt as collectGeodesyWfsVectorSources, ct as collectPartnerIdFromProperties, wn as collectPartnerIdsFromHits, zt as countActiveGeodesyWfsAttributeFilters, h as createDefaultGeodesyWfsAttributeFilterValues, qe as createGeodesyAnnexLayer, St as createGeodesyAttributeCatalog, m as createGeodesyCatalog, Gn as createGeodesyCatalogForProfile, k as createGeodesyExpertCatalog, Cn as createGeodesyExternalUrlTransform, le as createGeodesyGdpRgp2StyleFunction, r as createGeodesyLayerGroup, zn as createGeodesyPublicCatalog, De as createGeodesyWfsAttributeFilterValuesHolder, Pn as createGeodesyWfsClusterStyleFunction, Fe as createGeodesyWfsDisplayFilterStyleFunction, Ce as createGeodesyWfsLayer, Ae as createGeodesyWfsPictoStyleFunction, Lt as createGeodesyWmsLayer, Kn as defaultGeodesyActiveLayerIdsForProfile, O as defaultGeodesyExpertActiveLayerIds, l as defaultGeodesyLayerVisibility, qn as defaultGeodesyWfsAttributeFilterValuesForProfile, Nt as extractGeodesyCoordinates, V as extractGeodesyPointReportDomaine, Wt as featureMatchesVisibleNetworkLayers, er as fetchGeodesyWfsPointsByRef, ce as formatGdpRgp2DispoForDisplay, $t as formatGeodesyAttributeImageUrlHtml, pn as formatGeodesyAttributeLabel, _t as formatGeodesyAttributeUrlHtml, lt as formatGeodesyHitAsComment, be as formatGeodesyWfsBbox, Qt as formatMapCoordinateSubtitle, M as geodesyPointRefKey, je as geodesyWfsFeatureMatchesAttributeFilters, Ze as geodesyWfsFeatureMatchesDomaines, Me as getGeodesyAnnexFeaturesLastLoadedAt, st as getGeodesyAttributeLabel, _n as getGeodesyAttributeLabelFromCatalog, tr as getGeodesyCacheStats, _ as getGeodesyCatalogFromMap, rt as getGeodesyCatalogLayerIds, g as getGeodesyLayerGroup, Tn as getGeodesyLayersVisibility, Ut as getGeodesyScalarPropertyEntries, On as getGeodesyWfsAttributeFilterValues, Ue as getGeodesyWfsClusterSelectInteraction, Ht as getGeodesyWfsLoadingState, se as getGeodesyWfsMultiChoiceSelectedValues, et as getLayerDefinition, at as getLayerStackIndex, _e as hasGdpRgp2DispoData, It as hasGeodesyWfsMultiClusterAtPixel, Ve as isAnyGeodesyLayerVisible, xn as isEmptyGeodesyAttributeValue, bt as isExcludedGeodesyAttributeKey, Yt as isExcludedGeodesyAttributeKeyForCatalog, an as isGdpRgp2StationAvailable, Et as isGeodesyAttributeImageUrl, rn as isGeodesyAttributePicto, Kt as isGeodesyAttributeUrl, Jn as isGeodesyLayerReportingEnabled, ar as isGeodesyPointReportAllowed, lr as isGeodesyPointReportExistingRepere, q as isGeodesyPointReportMandatoryAttributeName, ir as isGeodesyPointReportPositionEditable, Wn as isGeodesyProfile, Le as isGeodesyTripletPoint, v as isGeodesyWfsLayerActive, e as loadGeodesyAnnexFeatures, Te as loadGeodesyWfsFeatures, Er as mapGeodesyPointReportToApiBody, Z as matchGeodesyPointReportListValue, K as matchGeodesyPointReportThemeAttributeName, Sn as mergeGeodesyFeatureHits, xt as mergeGeodesyFeatureProperties, i as mergeGeodesyPictoUrlMaps, $ as mergeGeodesyPointReportMandatoryThemeAttributes, oe as normalizeGeodesyPictoCode, H as normalizeGeodesyPointReportAttributeName, X as normalizeGeodesyPointReportComparableValue, p as normalizeGeodesyWfsDomaine, he as parseGdpRgp2DispoStates, wt as parseGeodesyGdpRgp2, ae as parseGeodesyWfsCsv, ke as parseGeodesyWfsGeoJson, kn as prefetchGeodesyImage, ze as prefetchGeodesyImages, u as prefetchGeodesyImagesFromHits, Nn as prefetchPartnerLogo, ht as prefetchPartnerLogoById, An as prefetchPartnerLogos, Be as prefetchPartnerLogosFromHits, hn as queryGeodesyAnnexAtPixel, Zt as queryGeodesyAtClick, vt as queryGeodesyAtCoordinate, ft as queryGeodesyWfsAtPixel, Bt as registerGeodesyOnMap, yn as registerGeodesyPopup, ie as registerGeodesyWfsClusterSelect, Xn as reloadGeodesyAnnexLayerOnMap, tt as resolveGdpRgp2AvailabilityLevel, jn as resolveGeodesyExternalUrlSource, yt as resolveGeodesyHitAttributeCatalog, En as resolveGeodesyImageDisplayUrl, Dt as resolveGeodesyLayerTitle, Fn as resolveGeodesyNetworkFilterCategories, Rt as resolveGeodesyPictoImageUrl, pe as resolveGeodesyPictoUrl, J as resolveGeodesyPointReportPrefillValue, ln as resolveGeodesyPopupTitle, me as resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds, te as resolveGeodesyWfsClusterConfig, tn as resolveGeodesyWfsHitFeature, xe as resolveGeodesyWfsLayerStyle, f as resolveGeodesyWfsLayerUrl, d as resolvePartnerLogoDisplayUrl, Pt as selectGeodesyDisplayEntries, Q as selectGeodesyPointReportThemeAttributes, ne as setGeodesyLayerVisible, ee as setGeodesyLayersVisibility, Re as setGeodesyWfsAttributeFilterValues, ur as shouldShowGeodesyPointReportThemeAttribute, bn as subscribeGeodesyWfsLoading, Qe as translateGdpRgp2DispoDigit, or as withGeodesyPointReportPosition, o as wrapGeodesyWfsStyleForCluster };
