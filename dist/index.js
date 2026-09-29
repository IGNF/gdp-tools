import { $ as e, $n as t, $t as n, A as r, An as i, At as a, B as o, Bn as s, Bt as c, C as l, Cn as u, D as d, Dn as ee, Dt as te, E as ne, En as re, Et as ie, F as ae, Fn as f, Ft as oe, G as se, Gn as ce, Gt as le, H as ue, Hn as de, Ht as fe, I as p, In as pe, It as m, J as me, Jn as he, Jt as ge, K as _e, Kn as ve, Kt as ye, L as be, Ln as xe, Lt as Se, M as Ce, Mn as we, Mt as Te, N as Ee, Nn as De, Nt as Oe, O as h, On as ke, Ot as g, P as Ae, Pn as je, Pt as Me, Q as Ne, Qn as Pe, Qt as Fe, R as Ie, Rn as Le, Rt as Re, S as ze, Sn as Be, St as Ve, T as He, Tn as Ue, Tt as _, U as We, Un as Ge, Ut as Ke, V as qe, Vn as Je, Vt as v, W as Ye, Wn as Xe, Wt as y, X as Ze, Xn as Qe, Xt as $e, Y as et, Yn as tt, Yt as nt, Z as rt, Zn as it, Zt as at, _ as ot, _n as st, _t as ct, a as lt, an as ut, at as dt, b as ft, bn as pt, bt as mt, c as ht, cn as gt, ct as _t, d as vt, dn as b, dt as yt, en as bt, er as xt, et as St, f as Ct, fn as wt, ft as Tt, g as Et, gn as Dt, gt as Ot, h as kt, hn as At, ht as jt, i as Mt, in as Nt, it as Pt, j as Ft, jn as It, jt as Lt, k as Rt, kn as zt, kt as Bt, l as Vt, ln as Ht, lt as x, m as Ut, mn as S, mt as Wt, n as Gt, nn as Kt, nr as qt, nt as Jt, o as Yt, on as Xt, ot as Zt, p as Qt, pn as $t, pt as en, q as C, qn as tn, qt as nn, r as rn, rn as an, rr as on, rt as sn, s as cn, sn as ln, st as un, t as dn, tn as fn, tr as pn, tt as mn, u as hn, un as gn, ut as _n, v as vn, vn as yn, vt as bn, w as xn, wn as Sn, wt as w, x as Cn, xn as wn, xt as Tn, y as En, yn as Dn, yt as On, z as kn, zn as An, zt as jn } from "./geodesyPointReportContext-CmEyb00K.js";
import Mn from "ol/layer/Vector";
//#region src/presets/geodesyPublicAttributeKeys.ts
var Nn = [
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
], Pn = ["RBF"];
function Fn(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.enableWfsLayers ? e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"] : [];
}
function In(e = {}) {
	let t = Fn(e), n = [...T, "TOUT"];
	return y({
		...e,
		layerIds: e.layerIds ?? n,
		uiLayerIds: e.uiLayerIds ?? T,
		dataLayerId: e.dataLayerId ?? "TOUT",
		attributeKeys: e.attributeKeys ?? Nn,
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
var Ln = "DATA_GEOD", Rn = "GDP";
function E(e) {
	return e.wfsLayerIds?.length ? e.wfsLayerIds : e.wfsLayers?.length ? e.wfsLayers.map((e) => e.id) : e.wfsApiKey?.trim() ? ["DATA_GEOD", "GDP"] : ["DATA_GEOD"];
}
function D(e) {
	return e.wfsDomainLayers === void 0 ? m : e.wfsDomainLayers;
}
function zn(e) {
	return e.wfsAttributeFilters === void 0 ? _ : e.wfsAttributeFilters;
}
function O(e = {}) {
	let t = D(e);
	if (t.length > 0) return t.map((e) => e.id);
	let n = E(e), r = n.includes("DATA_GEOD") ? Ln : n[0];
	return r ? [r] : [];
}
function k(e = {}) {
	let t = E(e), n = D(e), r = zn(e);
	return y({
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
function Bn(e) {
	return e === "public" || e === "expert";
}
function Vn(e, t = {}) {
	return e === "expert" ? k(t) : In(t);
}
function Hn(e, t = {}) {
	return e === "expert" ? O(t) : Pn;
}
function Un(e, t = {}) {
	if (e !== "expert") return {};
	let n = t.wfsAttributeFilters ?? _;
	return g(n);
}
//#endregion
//#region src/annex/isGeodesyLayerReportingEnabled.ts
function Wn(e, t) {
	if (!t) return !0;
	let n = e.annexLayers.find((e) => e.id === t);
	return n ? n.reportingEnabled ?? !1 : !0;
}
//#endregion
//#region src/annex/reloadGeodesyAnnexLayerOnMap.ts
function Gn(e, t) {
	let n = h(e);
	if (!n) return null;
	for (let e of n.getLayers().getArray()) if (e instanceof Mn && e.get("geodesyLayerKind") === "annex" && e.get("geodesyLayerId") === t) return e;
	return null;
}
async function Kn(e, t) {
	let n = w(e), r = n.annexLayers.find((e) => e.id === t);
	if (!r) throw Error(`[gdp-tools] Annex layer "${t}" is not registered on the map.`);
	let i = Gn(e, t);
	if (!i) throw Error(`[gdp-tools] Annex vector layer "${t}" was not found on the map.`);
	let a = i.getSource();
	if (!a) throw Error(`[gdp-tools] Annex vector layer "${t}" has no source.`);
	C(r, n), a.clear();
	let o = await et({
		definition: r,
		catalog: n
	});
	a.addFeatures(o);
}
//#endregion
//#region src/constants/geodesyGdpProprio.ts
var qn = "1255", Jn = 15e3, A = 40, j = new wn(512);
function M(e) {
	return `${v(e.domaine) ?? ""}:${e.id.trim()}`;
}
function N(e) {
	return /^\d+$/.test(e) ? e : `'${e.replace(/'/g, "''")}'`;
}
function Yn(e) {
	return e.map((e) => `(id=${N(e.id.trim())} AND domaine=${N(v(e.domaine) ?? "")})`).join(" OR ");
}
function P(e, t) {
	return `${e}|${M(t)}`;
}
async function Xn(e) {
	let { catalog: t, refs: n, layerId: r = "DATA_GEOD", propertyNames: i, timeoutMs: a = Jn } = e, o = /* @__PURE__ */ new Map(), c = t.wfsLayers.find((e) => e.id === r) ?? f.find((e) => e.id === r);
	if (!c || !s(c, t.wfsApiKey)) return o;
	let l = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (!e.id.trim() || !v(e.domaine)) continue;
		let t = M(e), n = j.get(P(r, e));
		n ? o.set(t, n) : n === void 0 && l.set(t, e);
	}
	let u = [...l.values()];
	for (let e = 0; e < u.length; e += A) {
		let n = u.slice(e, e + A), s = p({
			wfsUrl: Je(c, t.wfsUrl),
			typeName: c.typeName,
			apiKey: c.requiresApiKey ? t.wfsApiKey : void 0,
			cqlFilter: Yn(n),
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
function Zn() {
	let e = _n(), t = Dt();
	return {
		featureInfoEntryCount: e.entryCount,
		featureInfoSizeBytes: e.sizeBytes,
		imageEntryCount: t.entryCount,
		imageSizeBytes: t.sizeBytes
	};
}
function Qn() {
	x(), S();
}
//#endregion
//#region src/report/geodesyPointReportConstants.ts
var $n = "gdp-tools", F = [{
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
	return v(e.properties.domaine ?? e.properties.DOMAINE);
}
function er(e) {
	let t = V(e);
	return t ? new Set(z.map((e) => e.toLowerCase())).has(t) : !1;
}
function tr(e) {
	let t = V(e);
	return !t || !new Set(B.map((e) => e.toLowerCase())).has(t);
}
function nr(e, t) {
	return {
		...e,
		longitude: t.longitude,
		latitude: t.latitude
	};
}
//#endregion
//#region src/report/geodesyPointReportPrefill.ts
function rr(e) {
	for (let t of ["id", "ID"]) {
		let n = e[t];
		if (n == null) continue;
		let r = String(n).trim();
		if (r) return r;
	}
}
var ir = {
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
	return U(t, "id", e.geodesyId ?? rr(e.properties)), U(t, "domaine", e.properties.domaine ?? e.properties.DOMAINE), U(t, "gps", e.properties.expl_gps ?? e.properties.expl_gpscode ?? e.properties.gps), t;
}
function G(e) {
	let t = H(e), n = /* @__PURE__ */ new Set([t]);
	for (let [e, r] of Object.entries(ir)) {
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
function ar(e) {
	return J(e, "id") !== void 0;
}
function J(e, t, n = W(e)) {
	for (let e of G(t)) {
		let t = n[e];
		if (t) return t;
	}
}
function or(e, t, n = W(e)) {
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
], sr = {
	E: "EXPLOITABLE DIRECTEMENT PAR GPS",
	R: "EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE",
	I: "INEXPLOITABLE PAR GPS",
	N: "NON RENSEIGNE"
}, cr = {
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
function lr(e) {
	return sr[e.trim().toUpperCase()] ?? e;
}
function ur(e) {
	return cr[e.trim().toUpperCase()] ?? e;
}
function dr(e) {
	return K(e, ["gps"]) !== void 0;
}
function fr(e) {
	return K(e, ["etat"]) !== void 0;
}
function pr(e) {
	return K(e, ["move"]) !== void 0;
}
function mr(e) {
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
function hr(e, t, n = []) {
	let r = t.trim(), i = dr(e), a = fr(e), o = pr(e), s = n.length > 0 ? n : i ? Y : [], c = [
		r,
		i ? lr(r) : void 0,
		a ? ur(r) : void 0,
		o ? mr(r) : void 0
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
function gr(e) {
	let t = W(e), n = {};
	for (let r of R) {
		let i = J(e, r, t);
		i && (n[r] = i);
	}
	return n;
}
function _r(e, t) {
	let n = t[e]?.trim();
	if (n) return n;
	for (let [n, r] of Object.entries(t)) {
		let t = r.trim();
		if (t && K(n, [e])) return t;
	}
}
function vr(e, t) {
	return t.find((t) => t.name === e || K(t.name, [e]) !== void 0 || K(e, [t.name]) !== void 0);
}
function yr(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) {
		let e = vr(r, t), a = hr(r, i, e?.values ?? []);
		a ? n[r] = a : e?.values?.length || (n[r] = i);
	}
	return n;
}
function Q(e, t = {}) {
	let n = W(e), r = t.formAttributes ?? {}, i = (t.themeAttributeNames ?? []).filter((e) => e.trim()), a = i.length > 0 ? i : t.keys ?? I, o = {};
	for (let t of a) {
		let i = _r(t, r);
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
		if (t) {
			o[r.name] = t;
			continue;
		}
		r.default && (o[r.name] = r.default);
	}
	for (let [e, t] of Object.entries(r)) {
		let n = t.trim();
		if (!n) continue;
		let r = K(e, a);
		r && (o[r] = n);
	}
	for (let e of a) pr(e) && o[e] === void 0 && (o[e] = "false");
	return yr($(e, o), t.themeAttributeDefs ?? t.autofilledAttributes ?? []);
}
function br(e, t) {
	return Q(e, t);
}
function xr(e, t) {
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
		...gr(e)
	};
}
//#endregion
//#region src/report/mapGeodesyPointReportToApiBody.ts
function Sr(e, t) {
	let n = $(e, t.themeAttributes ?? br(e, t.attributeKeys ? { keys: t.attributeKeys } : void 0)), r = {
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
function Cr(e) {
	let t = {};
	for (let n of F) {
		let r = e.find((e) => e.role === n.role);
		r && (t[n.attachmentKey] = r.blob);
	}
	return t;
}
//#endregion
export { ge as DEFAULT_GEODESY_ATTRIBUTE_CATALOG, fe as DEFAULT_GEODESY_CATALOG, _ as DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS, Et as DEFAULT_GEODESY_EXTERNAL_URL_SOURCE, nt as DEFAULT_GEODESY_TITLE_KEYS, Be as DEFAULT_GEODESY_WFS_CLUSTER, m as DEFAULT_GEODESY_WFS_DOMAIN_LAYERS, Sn as DEFAULT_GEODESY_WFS_PICTO_URL_MAPS, ke as DEFAULT_GEODESY_WFS_POINT_STYLE, fn as EXCLUDED_GEODESY_ATTRIBUTE_KEYS, L as GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS, Y as GDP_THEME_GPS_VALUES, b as GEODESIE_DATA_ATTRIBUTE_KEYS, de as GEODESY_ANNEX_LAYERS, Ge as GEODESY_ANNEX_LAYER_IDS, wt as GEODESY_ATTRIBUTE_LABELS, Ke as GEODESY_CATALOG_PROPERTY, ve as GEODESY_DATA_LAYER_ID, tn as GEODESY_ENRICHMENT_LAYER_IDS, Rn as GEODESY_EXPERT_WFS_FALLBACK_LAYER, Ln as GEODESY_EXPERT_WFS_PRIMARY_LAYER, Ue as GEODESY_GDP_PICTO_URLS, qn as GEODESY_GDP_PROPRIETAIRE_IGN_ID, Xe as GEODESY_GDP_RGP2_ATTRIBUTE_KEYS, Ct as GEODESY_GDP_RGP2_FICHE_LINK_LABEL, Qt as GEODESY_GDP_RGP2_FICHE_LINK_TEXT, Ut as GEODESY_GDP_RGP2_FICHE_URL, ce as GEODESY_GDP_RGP2_URL, he as GEODESY_LAYER_GROUP_NAME, tt as GEODESY_LAYER_ID_PROPERTY, je as GEODESY_LAYER_KIND_PROPERTY, Oe as GEODESY_NETWORK_FILTER_CATEGORIES, Qe as GEODESY_NETWORK_LAYER_IDS, zt as GEODESY_PICTO_SYMBOL_BASE_URL, B as GEODESY_POINT_REPORT_BLOCKED_DOMAINES, R as GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS, F as GEODESY_POINT_REPORT_PHOTO_SLOTS, z as GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES, $n as GEODESY_POINT_REPORT_THEME, I as GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS, Nn as GEODESY_PUBLIC_ATTRIBUTE_KEYS, Pn as GEODESY_PUBLIC_DEFAULT_ACTIVE, T as GEODESY_PUBLIC_WMS_UI_LAYER_IDS, it as GEODESY_UI_LAYERS, ie as GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY, Se as GEODESY_WFS_DATA_LAYER_PROPERTY, Re as GEODESY_WFS_DOMAINE_PROPERTY, jn as GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY, f as GEODESY_WFS_LAYERS, pe as GEODESY_WFS_LAYER_IDS, xe as GEODESY_WFS_PRIVATE_URL, Le as GEODESY_WFS_PUBLIC_URL, An as GEODESY_WFS_URL, Pe as GEODESY_WMS_GP_OL_EXT, t as GEODESY_WMS_LAYER, xt as GEODESY_WMS_LAYERS, pn as GEODESY_WMS_LAYER_IDS, qt as GEODESY_WMS_STYLE, on as GEODESY_WMS_URL, ot as appendGeodesySourceParam, xr as buildGdpPointReportThemeAttributes, kt as buildGdpRgp2StationFicheUrl, Gt as buildGeodesyPointDisplay, dn as buildGeodesyPointReportContext, gr as buildGeodesyPointReportMandatoryThemeAttributes, W as buildGeodesyPointReportPrefillMap, br as buildGeodesyPointReportThemeAttributes, rn as buildGeodesyPointTitleDisplay, yt as buildGeodesyPopupTemplate, Cr as buildGeodesyReportAttachmentsBody, p as buildGeodesyWfsGetFeatureUrl, e as buildGeodesyWfsHitFromExplodedClusterFeature, Tt as buildPartnerLogoUrl, Qn as clearAllGeodesyCaches, C as clearGeodesyAnnexFeaturesCache, x as clearGeodesyFeatureInfoCache, S as clearGeodesyImageCache, ft as clearGeodesyWfsAttributeFilterValues, mt as clearGeodesyWfsClusterExplosion, hr as coerceGeodesyPointReportListValue, At as collectGeodesyImageUrlsFromHits, cn as collectGeodesyPointPhotos, ht as collectGeodesyWfsVectorSources, en as collectPartnerIdFromProperties, Wt as collectPartnerIdsFromHits, te as countActiveGeodesyWfsAttributeFilters, g as createDefaultGeodesyWfsAttributeFilterValues, qe as createGeodesyAnnexLayer, $e as createGeodesyAttributeCatalog, y as createGeodesyCatalog, Vn as createGeodesyCatalogForProfile, k as createGeodesyExpertCatalog, vn as createGeodesyExternalUrlTransform, ue as createGeodesyGdpRgp2StyleFunction, r as createGeodesyLayerGroup, In as createGeodesyPublicCatalog, Bt as createGeodesyWfsAttributeFilterValuesHolder, kn as createGeodesyWfsClusterStyleFunction, Ie as createGeodesyWfsDisplayFilterStyleFunction, Ce as createGeodesyWfsLayer, i as createGeodesyWfsPictoStyleFunction, Ft as createGeodesyWmsLayer, Hn as defaultGeodesyActiveLayerIdsForProfile, O as defaultGeodesyExpertActiveLayerIds, l as defaultGeodesyLayerVisibility, Un as defaultGeodesyWfsAttributeFilterValuesForProfile, Mt as extractGeodesyCoordinates, V as extractGeodesyPointReportDomaine, dt as featureMatchesVisibleNetworkLayers, Xn as fetchGeodesyWfsPointsByRef, We as formatGdpRgp2DispoForDisplay, Kt as formatGeodesyAttributeImageUrlHtml, an as formatGeodesyAttributeLabel, Nt as formatGeodesyAttributeUrlHtml, lt as formatGeodesyHitAsComment, be as formatGeodesyWfsBbox, Yt as formatMapCoordinateSubtitle, M as geodesyPointRefKey, a as geodesyWfsFeatureMatchesAttributeFilters, c as geodesyWfsFeatureMatchesDomaines, me as getGeodesyAnnexFeaturesLastLoadedAt, $t as getGeodesyAttributeLabel, at as getGeodesyAttributeLabelFromCatalog, Zn as getGeodesyCacheStats, w as getGeodesyCatalogFromMap, le as getGeodesyCatalogLayerIds, h as getGeodesyLayerGroup, xn as getGeodesyLayersVisibility, ut as getGeodesyScalarPropertyEntries, Cn as getGeodesyWfsAttributeFilterValues, Tn as getGeodesyWfsClusterSelectInteraction, Vt as getGeodesyWfsLoadingState, Lt as getGeodesyWfsMultiChoiceSelectedValues, ye as getLayerDefinition, nn as getLayerStackIndex, St as hasGeodesyWfsMultiClusterAtPixel, He as isAnyGeodesyLayerVisible, Xt as isEmptyGeodesyAttributeValue, ln as isExcludedGeodesyAttributeKey, Fe as isExcludedGeodesyAttributeKeyForCatalog, Ye as isGdpRgp2StationAvailable, gt as isGeodesyAttributeImageUrl, Ht as isGeodesyAttributePicto, gn as isGeodesyAttributeUrl, Wn as isGeodesyLayerReportingEnabled, tr as isGeodesyPointReportAllowed, ar as isGeodesyPointReportExistingRepere, q as isGeodesyPointReportMandatoryAttributeName, er as isGeodesyPointReportPositionEditable, Bn as isGeodesyProfile, Me as isGeodesyTripletPoint, s as isGeodesyWfsLayerActive, et as loadGeodesyAnnexFeatures, Ee as loadGeodesyWfsFeatures, Sr as mapGeodesyPointReportToApiBody, Z as matchGeodesyPointReportListValue, K as matchGeodesyPointReportThemeAttributeName, Zt as mergeGeodesyFeatureHits, un as mergeGeodesyFeatureProperties, re as mergeGeodesyPictoUrlMaps, $ as mergeGeodesyPointReportMandatoryThemeAttributes, It as normalizeGeodesyPictoCode, H as normalizeGeodesyPointReportAttributeName, X as normalizeGeodesyPointReportComparableValue, v as normalizeGeodesyWfsDomaine, se as parseGdpRgp2DispoStates, Ze as parseGeodesyGdpRgp2, ae as parseGeodesyWfsCsv, Ae as parseGeodesyWfsGeoJson, st as prefetchGeodesyImage, yn as prefetchGeodesyImages, Dn as prefetchGeodesyImagesFromHits, jt as prefetchPartnerLogo, Ot as prefetchPartnerLogoById, ct as prefetchPartnerLogos, bn as prefetchPartnerLogosFromHits, sn as queryGeodesyAnnexAtPixel, Ne as queryGeodesyAtClick, Pt as queryGeodesyAtCoordinate, mn as queryGeodesyWfsAtPixel, Rt as registerGeodesyOnMap, rt as registerGeodesyPopup, Ve as registerGeodesyWfsClusterSelect, Kn as reloadGeodesyAnnexLayerOnMap, En as resolveGeodesyExternalUrlSource, vt as resolveGeodesyHitAttributeCatalog, pt as resolveGeodesyImageDisplayUrl, _t as resolveGeodesyLayerTitle, oe as resolveGeodesyNetworkFilterCategories, ee as resolveGeodesyPictoImageUrl, we as resolveGeodesyPictoUrl, J as resolveGeodesyPointReportPrefillValue, n as resolveGeodesyPopupTitle, Te as resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds, u as resolveGeodesyWfsClusterConfig, Jt as resolveGeodesyWfsHitFeature, De as resolveGeodesyWfsLayerStyle, Je as resolveGeodesyWfsLayerUrl, On as resolvePartnerLogoDisplayUrl, bt as selectGeodesyDisplayEntries, Q as selectGeodesyPointReportThemeAttributes, ne as setGeodesyLayerVisible, d as setGeodesyLayersVisibility, ze as setGeodesyWfsAttributeFilterValues, or as shouldShowGeodesyPointReportThemeAttribute, hn as subscribeGeodesyWfsLoading, _e as translateGdpRgp2DispoDigit, nr as withGeodesyPointReportPosition, o as wrapGeodesyWfsStyleForCluster };
