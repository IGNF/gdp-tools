import e from "ol/Feature";
import t from "ol/style/Circle";
import n from "ol/style/Fill";
import r from "ol/style/Icon";
import i from "ol/style/Stroke";
import a from "ol/style/Style";
import o from "ol/geom/Point";
import s from "ol/layer/Group";
import { easeOut as c } from "ol/easing";
import { listen as l, unlistenByKey as u } from "ol/events";
import d from "ol-ext/interaction/SelectCluster";
import f from "ol-ext/util/getVectorContext.js";
import ee from "ol-ext/util/getVectorContextStyle.js";
import p from "ol/layer/Vector";
import { getUid as m } from "ol/util";
import te from "ol-ext/overlay/Popup.js";
import h from "ol-ext/overlay/PopupFeature.js";
import g from "ol/format/GeoJSON";
import _ from "ol/layer/Tile";
import "ol-ext/overlay/Popup.css";
import v from "ol/source/Vector";
import { toLonLat as y, transform as ne, transformExtent as re } from "ol/proj";
import ie from "ol/style/Text";
import { bbox as ae } from "ol/loadingstrategy";
import oe from "ol/source/Cluster";
import se from "ol-ext/layer/AnimatedCluster";
import ce from "ol/format/WKT";
import le from "ol/source/TileWMS";
import ue from "ol/TileState";
import { unByKey as de } from "ol/Observable";
//#region src/constants/wms.ts
var fe = "geodesyGroup", b = "geodesyLayerId", pe = "https://data.geopf.fr/wms-v/ows", me = "1.0.0-beta.11", x = [
	{
		id: "RBF",
		wmsLayer: "IGNF_GEODESIE-RBF",
		style: "default-style-IGNF_GEODESIE-RBF",
		title: "Réseau de base (RBF)",
		shortLabel: "RBF"
	},
	{
		id: "RDF",
		wmsLayer: "IGNF_GEODESIE-RDF",
		style: "default-style-IGNF_GEODESIE-RDF",
		title: "Réseau de détail (RDF)",
		shortLabel: "RDF"
	},
	{
		id: "RN",
		wmsLayer: "IGNF_GEODESIE-RN",
		style: "default-style-IGNF_GEODESIE-RN",
		title: "Nivellement",
		shortLabel: "RN"
	},
	{
		id: "GRAVI",
		wmsLayer: "IGNF_GEODESIE-GRAV",
		style: "default-style-IGNF_GEODESIE-GRAV",
		title: "Gravimétrie",
		shortLabel: "GRAVI"
	},
	{
		id: "TOUT",
		wmsLayer: "GEODESIE_DATA",
		style: "default-style-GEODESIE_DATA",
		title: "Toutes les données géodésiques",
		shortLabel: "Toutes"
	}
], S = "TOUT", he = x.filter((e) => e.id !== S).map((e) => e.id), ge = x.filter((e) => e.id !== S), _e = [S], ve = x.map((e) => e.id), ye = x[0].wmsLayer, be = x[0].style, xe = "https://data.geopf.fr/annexes/geodesie/gdp/GDP_RGP2.txt", Se = [
	"nom",
	"cadence",
	"commune",
	"reseaux",
	"longitude",
	"latitude",
	"hauteur",
	"info",
	"dispo"
], Ce = [{
	id: "GDP_RGP2",
	title: "Stations GNSS permanentes (RGP)",
	shortLabel: "RGP",
	url: xe,
	format: "gdp-rgp2",
	attributeKeys: Se,
	titleKeys: ["nom", "commune"]
}], we = Ce.map((e) => e.id), Te = "https://data.geopf.fr/private/wfs", Ee = "https://data.geopf.fr/wfs", De = Te, Oe = [{
	id: "DATA_GEOD",
	typeName: "GEODESIE:data_geod",
	title: "Données géodésiques (WFS)",
	shortLabel: "Data géod",
	wfsUrl: Ee,
	requiresApiKey: !1,
	outputFormat: "application/json",
	responseFormat: "geojson",
	version: "2.0.0",
	bboxOrder: "latLon",
	bboxCrs: "urn:ogc:def:crs:EPSG::4326"
}, {
	id: "GDP",
	typeName: "GEODESIE_GDP:gdp_point",
	title: "Points GDP",
	shortLabel: "GDP",
	wfsUrl: Te,
	requiresApiKey: !0,
	outputFormat: "application/json",
	responseFormat: "geojson",
	version: "2.0.0",
	bboxOrder: "latLon"
}], ke = Oe.map((e) => e.id), C = "geodesyLayerKind";
function Ae(e, t) {
	return !e.requiresApiKey || !!t?.trim();
}
function je(e, t) {
	return e.wfsUrl || t;
}
//#endregion
//#region src/style/geodesyWfsPictoStyle.ts
var Me = "https://data.geopf.fr/annexes/geodesie/symbol";
function Ne(e) {
	if (e == null) return;
	let t = String(e).trim();
	return t ? t.toUpperCase() : void 0;
}
function Pe(e, t) {
	let n = e[t];
	if (n) return n;
	let r = t.toLowerCase();
	for (let [t, n] of Object.entries(e)) if (t.toLowerCase() === r) return n;
}
var Fe = new a({ image: new t({
	radius: 5,
	fill: new n({ color: "rgba(38, 165, 129, 0.85)" }),
	stroke: new i({
		color: "#ffffff",
		width: 1.5
	})
}) });
function Ie(e) {
	return Ne(e);
}
function Le(e, t) {
	return Pe(e, t);
}
function Re(t, n = {}) {
	let i = n.fallbackStyle ?? Fe, o = n.pictoProperty ?? "picto", s = n.iconScale ?? 1, c = /* @__PURE__ */ new Map();
	return (n) => {
		if (!(n instanceof e)) return i;
		let l = Ie(n.get(o));
		if (!l) return i;
		let u = Le(t, l);
		if (!u) return i;
		let d = c.get(l);
		if (d) return d;
		let f = new a({ image: new r({
			src: u,
			scale: s,
			crossOrigin: "anonymous"
		}) });
		return c.set(l, f), f;
	};
}
function ze(e, t) {
	return t === void 0 ? e && Object.keys(e).length > 0 ? Re(e) : Fe : t;
}
function Be(e) {
	return typeof e == "function" ? e : () => e;
}
function Ve(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.wfsLayerIds) {
		let r = e.wfsPictoUrlMaps[n];
		t.set(n, Be(ze(r)));
	}
	return (e, n) => {
		let r = e.get(b), i = r ? t.get(r) : void 0;
		return i ? i(e, n) : Fe;
	};
}
function He(e) {
	let t = Ve(e);
	return (e, n) => {
		if (e.get("selectclusterlink")) return [];
		let r = e.get("features")?.[0] ?? e;
		return t(r, n);
	};
}
//#endregion
//#region src/constants/geodesyPictoUrls.ts
var w = (e) => `${Me}/${e}`;
function Ue(e) {
	let t = {};
	for (let n of Object.values(e)) n && Object.assign(t, n);
	return t;
}
function We(e, t = {}) {
	let n = Ne(e);
	if (!n) return;
	let r = t.pictoUrlMaps ?? T;
	if (t.layerId) {
		let e = r[t.layerId];
		if (e) {
			let t = Pe(e, n);
			if (t) return t;
		}
	}
	return Pe(Ue(r), n);
}
var Ge = {
	PT_RN_GOOD: w("rn_bon_15.gif"),
	PT_RN_BAD: w("rn_bad_15.gif"),
	PT_RN_DEL: w("rn_del_15.gif"),
	PT_RN_TRIPLET_GOOD: w("rn_triplet_15.gif"),
	PT_RN_TRIPLET_BAD: w("rn_triplet_15.gif"),
	PT_RN_TRIPLET_DEL: w("rn_triplet_15.gif"),
	PT_RDF_GOOD: w("rdf_bon_15.gif"),
	PT_RDF_BAD: w("rdf_bad_15.gif"),
	PT_RDF_DEL: w("rdf_del_15.gif"),
	PT_RBF_GOOD: w("rbf_bon_15.gif"),
	PT_RBF_BAD: w("rbf_bad_15.gif"),
	PT_RBF_DEL: w("rbf_del_15.gif"),
	PT_RN_CANEX_GOOD: w("rn_canex_bon_15.gif"),
	PT_RN_CANEX_BAD: w("rn_canex_bad_15.gif"),
	PT_RN_CANEX_DEL: w("rn_canex_del_15.gif"),
	PT_RDF_CANEX_GOOD: w("rdf_canex_bon_15.gif"),
	PT_RDF_CANEX_BAD: w("rdf_canex_bad_15.gif"),
	PT_RDF_CANEX_DEL: w("rdf_canex_del_15.gif"),
	PT_RN_CANEX_TRIPLET_GOOD: w("rn_canex_bon_15.gif"),
	PT_RN_CANEX_TRIPLET_BAD: w("rn_canex_bad_15.gif"),
	PT_RN_CANEX_TRIPLET_DEL: w("rn_canex_del_15.gif")
}, T = {
	DATA_GEOD: Ge,
	GDP: Ge
}, E = {
	enabled: !0,
	distance: 40,
	minDistance: 0,
	animationDuration: 700,
	animateExplosion: !0,
	explosionAnimationDuration: 500,
	pointRadius: 12,
	maxResolution: 80
};
function Ke(e) {
	let t = e?.animationDuration ?? E.animationDuration, n = e?.explosionAnimationDuration ?? E.explosionAnimationDuration;
	return {
		enabled: e?.enabled ?? E.enabled,
		distance: e?.distance ?? E.distance,
		minDistance: e?.minDistance ?? E.minDistance,
		animationDuration: t,
		animateExplosion: e?.animateExplosion ?? E.animateExplosion,
		explosionAnimationDuration: n,
		pointRadius: e?.pointRadius ?? E.pointRadius,
		maxResolution: e?.maxResolution ?? E.maxResolution
	};
}
//#endregion
//#region src/cache/lruMemoryCache.ts
var qe = class {
	maxEntries;
	onEvict;
	store = /* @__PURE__ */ new Map();
	constructor(e = 256, t) {
		this.maxEntries = e, this.onEvict = t;
	}
	get(e) {
		let t = this.store.get(e);
		if (t !== void 0) return this.store.delete(e), this.store.set(e, t), t;
	}
	has(e) {
		return this.store.has(e);
	}
	set(e, t) {
		if (this.store.has(e)) this.store.delete(e);
		else if (this.store.size >= this.maxEntries) {
			let e = this.store.keys().next().value;
			if (e !== void 0) {
				let t = this.store.get(e);
				this.store.delete(e), t !== void 0 && this.onEvict?.(t, e);
			}
		}
		this.store.set(e, t);
	}
	delete(e) {
		this.store.delete(e);
	}
	forEach(e) {
		for (let [t, n] of this.store.entries()) e(n, t);
	}
	get entryCount() {
		return this.store.size;
	}
	clear() {
		this.store.clear();
	}
};
//#endregion
//#region src/cache/geodesyImageCache.ts
function D(e) {
	return e.trim();
}
function Je(e) {
	URL.revokeObjectURL(e.objectUrl);
}
var O = new qe(64, (e) => {
	Je(e);
}), k = /* @__PURE__ */ new Map();
function A(e) {
	let t = D(e);
	return O.get(t)?.objectUrl ?? t;
}
function Ye(e) {
	return I(e).filter(([e, t]) => P(e, t)).map(([, e]) => D(e));
}
function Xe(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of Ye(n.feature.getProperties())) t.add(e);
	return Array.from(t);
}
async function Ze(e) {
	let t = D(e), n = O.get(t);
	if (n) return n.objectUrl;
	let r = await fetch(t);
	if (!r.ok) return t;
	let i = await r.blob(), a = URL.createObjectURL(i);
	return O.set(t, {
		objectUrl: a,
		sizeBytes: i.size
	}), a;
}
async function Qe(e) {
	let t = D(e), n = O.get(t);
	if (n) return n.objectUrl;
	let r = k.get(t);
	if (r) return r;
	let i = Ze(t).finally(() => {
		k.delete(t);
	});
	return k.set(t, i), i;
}
async function $e(e) {
	await Promise.all(e.map((e) => Qe(e)));
}
async function et(e) {
	await $e(Xe(e));
}
async function tt(e) {
	let t = new DOMParser().parseFromString(e, "text/html"), n = t.querySelectorAll("img[src]");
	return n.length === 0 ? e : (await $e(Array.from(n).map((e) => e.getAttribute("src")).filter((e) => !!e?.trim())), n.forEach((e) => {
		let t = e.getAttribute("src");
		t && e.setAttribute("src", A(t));
	}), t.querySelector("table.featureInfo")?.outerHTML ?? t.body.innerHTML);
}
function nt() {
	O.forEach((e) => {
		Je(e);
	}), O.clear(), k.clear();
}
function rt() {
	let e = 0;
	return O.forEach((t) => {
		e += t.sizeBytes;
	}), {
		entryCount: O.entryCount,
		sizeBytes: e
	};
}
//#endregion
//#region src/constants/geodesyAttributeLabels.ts
var j = {
	id: "Identifiant",
	domaine: "Domaine",
	picto: "Pictogramme",
	nom: "Nom",
	no: "Numéro",
	type: "Type de repère",
	type_info: "Complément de type",
	remarque: "Remarque",
	diffusion: "Diffusion",
	maj_date: "Date de mise à jour",
	commune: "Commune",
	cadence: "Cadence",
	reseaux: "Réseaux",
	hauteur: "Hauteur (m)",
	info: "Info",
	dispo: "Disponibilité",
	insee: "Code INSEE",
	entite: "Entité administrative",
	entite_no: "N° entité",
	entite_nature: "Nature entité",
	localisation: "Localisation",
	carte: "Carte",
	carte_no: "N° carte",
	voie_suivie: "Voie suivie",
	voie_de: "Voie — de",
	voie_vers: "Voie — vers",
	voie_cote: "Voie — côté",
	voie_pk: "Voie — PK",
	etat: "État",
	action: "Action",
	action_date: "Date action",
	vis_date: "Date visite",
	obs_date: "Date observation",
	obs_org: "Organisme observation",
	expl_gps: "Exploitation GPS",
	cg1_coord1: "Longitude (décimale)",
	cg1_coord2: "Latitude (décimale)",
	cg1_coord3: "Hauteur ellipsoïdale (m)",
	cg1_coord1_dms: "Longitude (DMS)",
	cg1_coord2_dms: "Latitude (DMS)",
	cg1_srt: "Système de référence géographique",
	cg1_prec: "Précision planimétrique",
	cg1_date: "Date coordonnées géographiques",
	cp1_coord1: "X",
	cp1_coord2: "Y",
	cp1_coord3: "Altitude (m)",
	cp1_srt: "Système de projection",
	cp1_prec: "Précision planimétrique (projection)",
	cp1_srv: "Système altimétrique",
	cp1_precv: "Précision altimétrique",
	cp1_altitude_type: "Type d’altitude",
	cp1_date: "Date coordonnées projetées",
	cg2_coord1: "Longitude 2 (décimale)",
	cg2_coord2: "Latitude 2 (décimale)",
	cg2_coord3: "Hauteur ellipsoïdale 2 (m)",
	cg2_coord1_dms: "Longitude 2 (DMS)",
	cg2_coord2_dms: "Latitude 2 (DMS)",
	cg2_srt: "Système de référence géographique 2",
	cg2_prec: "Précision planimétrique 2",
	cg2_date: "Date coordonnées géographiques 2",
	cp2_coord1: "X",
	cp2_coord2: "Y",
	cp2_coord3: "Altitude 2",
	cp2_srt: "Système de projection 2",
	cp2_prec: "Précision planimétrique 2",
	cp2_srv: "Système altimétrique 2",
	cp2_precv: "Précision altimétrique 2",
	cp2_altitude_type: "Type d’altitude 2",
	cp2_date: "Date coordonnées projetées 2",
	g: "Valeur de g",
	gravi_no: "N° gravimétrique",
	gravi_srg: "Réseau gravimétrique",
	gravi_traitprecision: "Précision traitement gravimétrique",
	gravi_calcul_date: "Date calcul gravimétrique",
	gravi_abs_date: "Date mesure absolue",
	gravi_rel_date: "Date mesure relative",
	gravi_gradient: "Gradient gravimétrique",
	gravi_gradient_ecart_type: "Écart-type gradient",
	gravi_grad_date: "Date gradient",
	freres_info: "Repères frères",
	groupe_info: "Groupe",
	voisin: "Repère voisin",
	voisin_distance: "Distance voisin",
	voisin_domaine: "Domaine voisin",
	jumeau: "Repère jumeau",
	jumeau_no: "N° jumeau",
	jumeau_info: "Info jumeau",
	jumeau_dom: "Domaine jumeau",
	autre_canevas_info: "Autre canevas",
	support: "Support",
	support_part: "Partie de support",
	rep_hori: "Repère horizontal",
	rep_vert: "Repère vertical",
	proprio: "Propriétaire",
	proprio_artic: "Propriétaire (article)",
	proprio_sigle: "Sigle propriétaire",
	proprio_adr: "Adresse propriétaire",
	url_pdf: "Fiche PDF",
	img1: "Photo 1 ( fichier )",
	img1_date: "Date photo 1",
	img1_azim: "Azimut photo 1",
	img1_url: "Photo 1",
	img2: "Photo 2 ( fichier )",
	img2_date: "Date photo 2",
	img2_azim: "Azimut photo 2",
	img2_url: "Photo 2",
	groupe_img1: "Photo groupe 1 ( fichier )",
	groupe_img1_date: "Date photo groupe 1",
	groupe_img1_azim: "Azimut photo groupe 1",
	groupe_img1_url: "Photo groupe 1",
	groupe_img2: "Photo groupe 2 ( fichier )",
	groupe_img2_date: "Date photo groupe 2",
	groupe_img2_azim: "Azimut photo groupe 2",
	groupe_img2_url: "Photo groupe 2",
	groupe_croquis1: "Croquis groupe 1 ( fichier )",
	groupe_croquis1_date: "Date croquis groupe 1",
	groupe_croquis1_azim: "Azimut croquis groupe 1",
	groupe_croquis1_url: "Croquis groupe 1",
	groupe_croquis2: "Croquis groupe 2 ( fichier )",
	groupe_croquis2_date: "Date croquis groupe 2",
	groupe_croquis2_azim: "Azimut croquis groupe 2",
	groupe_croquis2_url: "Croquis groupe 2",
	groupe_type: "Type de réseau",
	groupe_typecode: "Code réseau",
	groupe_typeinfo: "Info type réseau",
	groupe_lieudit: "Lieu-dit du groupe"
}, it = Object.keys(j);
function at(e) {
	return j[e.toLowerCase()] || e.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
}
//#endregion
//#region src/interaction/geodesyFeatureAttributes.ts
var ot = [
	"geometry",
	"boundedBy",
	"coordinate"
], st = new Set(ot.map((e) => e.toLowerCase()));
function ct(e) {
	return e.startsWith("_") || st.has(e.toLowerCase());
}
function lt(e) {
	return at(e);
}
function ut(e) {
	let t = e.toLowerCase();
	return t.includes("url") || t === "lien" || t === "link";
}
function dt(e) {
	return /^https?:\/\//i.test(e.trim());
}
function M(e) {
	return e == null || typeof e == "object" || String(e).trim() === "";
}
function N(e, t) {
	if (M(t)) return !1;
	let n = String(t).trim();
	return ut(e) || dt(n);
}
function ft(e) {
	return e.toLowerCase() === "picto";
}
function P(e, t) {
	if (!N(e, t)) return !1;
	let n = e.toLowerCase();
	return n === "url_pdf" ? !1 : /^img\d*_url$/.test(n) || /^groupe_img\d*_url$/.test(n) || /^groupe_croquis\d*_url$/.test(n);
}
function F(e) {
	return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function pt(e) {
	let t = F(String(e).trim());
	return `<a href="${t}" target="_blank" rel="noopener noreferrer">${t}</a>`;
}
function mt(e, t = "Image") {
	let n = String(e).trim(), r = A(n), i = F(n), a = F(r), o = F(t);
	return `<div class="geodesy-attribute-image">
  <a class="geodesy-attribute-image__link" href="${i}" target="_blank" rel="noopener noreferrer" title="Ouvrir ${o}">
    <img class="geodesy-attribute-image__thumb" src="${a}" alt="${o}" loading="lazy" />
    <span class="geodesy-attribute-image__caption">Ouvrir</span>
  </a>
</div>`;
}
function I(e, t = R) {
	return Object.keys(e).flatMap((n) => {
		if (_t(n, t)) return [];
		let r = e[n];
		return M(r) ? [] : [[n, String(r).trim()]];
	});
}
//#endregion
//#region src/catalog/geodesyAttributeCatalog.ts
var ht = [
	"nom",
	"NOM",
	"libelle",
	"LIBELLE",
	"name",
	"NAME",
	"id",
	"ID",
	"code",
	"CODE",
	"_caption"
];
function gt(e) {
	let t = /* @__PURE__ */ new Set();
	return e.filter((e) => {
		let n = e.toLowerCase();
		return !t.has(n) && (t.add(n), !0);
	});
}
function L(e = {}) {
	return {
		attributeKeys: gt(e.attributeKeys ?? it),
		excludedKeys: gt([...ot, ...e.excludedKeys ?? []]),
		titleKeys: gt(e.titleKeys ?? ht),
		labels: {
			...j,
			...e.labels ?? {}
		}
	};
}
var R = L();
function z(e, t = R) {
	let n = e.toLowerCase();
	return t.labels[n] || at(e);
}
function _t(e, t = R) {
	if (ct(e)) return !0;
	let n = e.toLowerCase();
	return t.excludedKeys.some((e) => e.toLowerCase() === n);
}
function B(e, t = R, n = "Point géodésique") {
	for (let n of t.titleKeys) {
		let t = e[n];
		if (t != null && String(t).trim() !== "") return String(t);
	}
	return n;
}
function V(e, t = R) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let [e, r] = t;
		r.trim() && n.set(e.toLowerCase(), t);
	}
	return t.attributeKeys.flatMap((e) => {
		let t = n.get(e.toLowerCase());
		return t ? [t] : [];
	});
}
//#endregion
//#region src/catalog/geodesyCatalog.ts
var vt = "geodesyCatalog";
function yt(e) {
	return Array.from(new Set(e));
}
function bt(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function xt(e) {
	if (e.layers?.length) return e.layers;
	let t = x;
	return e.layerIds?.length ? bt(t, yt(e.layerIds)) : t;
}
function St(e) {
	return Array.from(new Set(e));
}
function Ct(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function wt(e, t) {
	if (e && t.includes(e)) return e;
	if (t.includes("DATA_GEOD")) return "DATA_GEOD";
	if (t.includes("GDP")) return "GDP";
	let n = t[0];
	if (!n) throw Error("[gdp-tools] wfsDomainLayers require at least one active WFS layer in the catalog.");
	return n;
}
function Tt(e) {
	return Array.from(new Set(e));
}
function Et(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function Dt(e) {
	return e.annexLayers?.length ? e.annexLayers : e.annexLayerIds?.length ? Et(Ce, Tt(e.annexLayerIds)) : [];
}
function Ot(e) {
	let t = [];
	if (e.wfsLayers?.length) t = [...e.wfsLayers];
	else if (e.wfsLayerIds?.length) t = Ct(Oe, St(e.wfsLayerIds));
	else return [];
	return t.filter((t) => Ae(t, e.wfsApiKey));
}
function kt(e = {}) {
	let t = xt(e), n = t.map((e) => e.id), r = e.dataLayerId ?? "TOUT";
	if (!n.includes(r)) throw Error(`[gdp-tools] dataLayerId "${r}" must be included in the catalog layers.`);
	let i = n.filter((e) => e !== r), a = yt(e.networkLayerIds ?? i).filter((e) => n.includes(e)), o = n.filter((e) => e !== r), s = yt(e.uiLayerIds ?? o).filter((e) => n.includes(e)), c = bt(t, s), l = e.attributes ?? L({
		attributeKeys: e.attributeKeys,
		excludedKeys: e.excludedKeys,
		titleKeys: e.titleKeys,
		labels: e.labels
	}), u = Ot(e), d = u.map((e) => e.id), f = St(e.wfsUiLayerIds ?? d).filter((e) => d.includes(e)), ee = Ct(u, f), p = e.wfsDomainLayers ?? [], m = p.map((e) => e.id), te = e.wfsAttributeFilters ?? [], h = p.length > 0 ? wt(e.wfsDomainSourceLayerId, d) : void 0, g = p.length > 0 ? [...m] : [...f], _ = Dt(e), v = _.map((e) => e.id), y = Tt(e.annexUiLayerIds ?? v).filter((e) => v.includes(e)), ne = Et(_, y);
	return {
		layers: t,
		layerIds: n,
		uiLayers: c,
		uiLayerIds: s,
		dataLayerId: r,
		networkLayerIds: a,
		wmsUrl: e.wmsUrl ?? "https://data.geopf.fr/wms-v/ows",
		wmsGpOlExt: e.wmsGpOlExt ?? "1.0.0-beta.11",
		attributes: l,
		wfsLayers: u,
		wfsLayerIds: d,
		wfsUiLayers: ee,
		wfsUiLayerIds: g,
		wfsDomainLayers: p,
		wfsDomainLayerIds: m,
		wfsDomainSourceLayerId: h,
		wfsAttributeFilters: te,
		wfsUrl: e.wfsUrl ?? "https://data.geopf.fr/private/wfs",
		wfsApiKey: e.wfsApiKey,
		wfsDataProjection: e.wfsDataProjection ?? "EPSG:4326",
		wfsBboxPaddingRatio: e.wfsBboxPaddingRatio ?? .05,
		wfsUseCacheBuster: e.wfsUseCacheBuster ?? !0,
		wfsPictoUrlMaps: {
			...T,
			...e.wfsPictoUrlMaps ?? {}
		},
		wfsCluster: Ke(e.wfsCluster),
		annexLayers: _,
		annexLayerIds: v,
		annexUiLayers: ne,
		annexUiLayerIds: y
	};
}
var H = kt();
function At(e, t) {
	return e.layers.find((e) => e.id === t);
}
function jt(e, t) {
	let n = e.layerIds.indexOf(t);
	return n >= 0 ? n : e.layerIds.length;
}
function Mt(e) {
	if (e.wfsDomainLayerIds.length > 0) {
		let t = e.wfsDomainSourceLayerId ? [e.wfsDomainSourceLayerId] : [];
		return [
			...e.layerIds,
			...t,
			...e.wfsDomainLayerIds,
			...e.annexLayerIds
		];
	}
	return [
		...e.layerIds,
		...e.wfsLayerIds,
		...e.annexLayerIds
	];
}
//#endregion
//#region src/constants/wfsDomainLayers.ts
var Nt = "domaine", Pt = "geodesyWfsDomainSourceLayerId", U = "geodesyWfsDataLayer", Ft = [{
	id: "DOMAIN_GEODESIE",
	title: "Géodésie",
	shortLabel: "Géod",
	domaines: [
		"rsgf",
		"rsgo",
		"rsge"
	]
}, {
	id: "DOMAIN_NIVELLEMENT",
	title: "Nivellement",
	shortLabel: "Niv",
	domaines: [
		"nivf",
		"nivo",
		"nive"
	]
}];
function It(e) {
	if (e != null) return String(e).trim().toLowerCase() || void 0;
}
function Lt(e) {
	return It(e.get("domaine") ?? e.get("DOMAINE"));
}
function W(e, t) {
	if (!t.length) return !0;
	let n = new Set(t.map((e) => e.toLowerCase())), r = e.get("features");
	if (r?.length) return r.some((e) => {
		let t = Lt(e);
		return t !== void 0 && n.has(t);
	});
	let i = Lt(e);
	return i !== void 0 && n.has(i);
}
//#endregion
//#region src/constants/geodesyNetworkFilterCategories.ts
var Rt = [
	"RBF",
	"RDF",
	"TRIPLET",
	"NON_TRIPLET"
], zt = ["PT_RN_TRIPLET", "PT_RN_CANEX_TRIPLET"];
function Bt(e, t) {
	if (t in e) return e[t];
	let n = t.toLowerCase(), r = Object.keys(e).find((e) => e.toLowerCase() === n);
	return r ? e[r] : void 0;
}
function Vt(e) {
	return Ne(Bt(e, "picto") ?? Bt(e, "PICTO"));
}
function Ht(e) {
	return zt.some((t) => e.startsWith(t));
}
function Ut(e) {
	let t = Vt(e);
	return t !== void 0 && Ht(t);
}
function Wt(e) {
	let t = Vt(e);
	if (!t) return [];
	let n = [];
	return t.startsWith("PT_RBF") && n.push("RBF"), t.startsWith("PT_RDF") && n.push("RDF"), Ht(t) ? n.push("TRIPLET") : t.startsWith("PT_RN") && n.push("NON_TRIPLET"), n;
}
//#endregion
//#region src/wfs/geodesyWfsFeatureId.ts
var Gt = [
	"id",
	"ID",
	"no",
	"NO"
];
function Kt(e) {
	for (let t of Gt) {
		let n = e[t];
		if (n == null) continue;
		let r = String(n).trim();
		if (r) return r;
	}
}
function qt(e, t) {
	return `${e}:${t}`;
}
function Jt(e, t) {
	let n = e.getGeometry();
	if (!(n instanceof o)) return;
	let [r, i] = n.getCoordinates();
	return qt(t, `${r.toFixed(3)}:${i.toFixed(3)}`);
}
function Yt(e, t) {
	let n = `${t}:`, r = e.getId();
	if (r !== void 0 && String(r).startsWith(n)) return;
	let i = Kt(e.getProperties()) ?? (r === void 0 ? void 0 : String(r).trim()) ?? Jt(e, t);
	i && e.setId(i.startsWith(n) ? i : qt(t, i));
}
//#endregion
//#region src/constants/wfsAttributeFilters.ts
var G = "geodesyWfsAttributeFilterValues";
function Xt(e = {}) {
	return { values: { ...e } };
}
var Zt = [
	{
		id: "HAS_PHOTO",
		type: "boolean",
		title: "Photo",
		property: "img1_url",
		trueLabel: "Oui",
		falseLabel: "Non"
	},
	{
		id: "DATE_PHOTO",
		type: "date",
		title: "Date Photo",
		property: "img1_date",
		operator: "before"
	},
	{
		id: "VIS_DATE_BEFORE",
		type: "date",
		title: "Date de visite avant",
		property: "vis_date",
		operator: "before"
	},
	{
		id: "PROPRIO",
		type: "choice",
		title: "Propriétaire",
		property: "proprio_sigle",
		options: [{
			value: "IGN",
			label: "IGN"
		}, {
			value: "__other__",
			label: "Autre",
			matchOthers: !0
		}]
	},
	{
		id: "GPS",
		type: "choice",
		title: "Exploitation GPS",
		property: "expl_gps",
		options: [
			{
				value: "EXPLOITABLE DIRECTEMENT PAR GNSS",
				label: "DIRECTEMENT"
			},
			{
				value: "EXPLOITABLE PAR GNSS DEPUIS UNE STATION EXCENTREE",
				label: "STATION EXCENTREE",
				matchOthers: !0
			},
			{
				value: "INEXPLOITABLE PAR GNSS",
				label: "NON EXPLOITABLE"
			},
			{
				value: "__other__",
				label: "Autre",
				matchOthers: !0
			}
		]
	},
	{
		id: "LOCALISATION_CONTAINS",
		type: "text",
		title: "Localisation contient",
		property: "localisation",
		operator: "contains",
		placeholder: "ex. Borne frontiere"
	},
	{
		id: "G",
		type: "boolean",
		title: "G",
		property: "g",
		trueLabel: "Oui",
		falseLabel: "Non"
	}
];
function Qt(e, t) {
	return e.get(t) ?? e.get(t.toUpperCase());
}
function $t(e, t) {
	return e[t] ?? e[t.toUpperCase()];
}
function en(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) r.wfsLayerId && (t && r.wfsLayerId === t || n.add(r.wfsLayerId));
	return [...n];
}
function K(e, t, n = {}) {
	let { domainSourceLayerId: r, auxiliaryPropertiesByLayerId: i } = n;
	if (t.wfsLayerId && r && t.wfsLayerId !== r) {
		let n = Kt(e.getProperties());
		if (!n) return;
		let r = i?.get(t.wfsLayerId)?.get(n);
		return r ? $t(r, t.property) : void 0;
	}
	return Qt(e, t.property);
}
function tn(e) {
	return e == null ? "" : String(e).trim();
}
function nn(e) {
	let t = tn(e);
	if (!t) return null;
	let n = Date.parse(t);
	if (!Number.isNaN(n)) return n;
	let r = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
	if (r) {
		let [, e, t, n] = r, i = Date.parse(`${n}-${t.padStart(2, "0")}-${e.padStart(2, "0")}`);
		return Number.isNaN(i) ? null : i;
	}
	return null;
}
function rn(e, t, n, r) {
	let i = !M(K(e, t, r));
	return n ? i : !i;
}
function an(e, t, n, r) {
	let i = nn(K(e, t, r)), a = nn(n);
	return i === null || a === null ? !1 : t.operator === "before" ? i < a : i > a;
}
function on(e, t, n, r) {
	let i = tn(K(e, t, r)).toLowerCase(), a = n.trim().toLowerCase();
	if (!a) return !0;
	switch (t.operator ?? "equals") {
		case "contains": return i.includes(a);
		case "notEquals": return i !== a;
		default: return i === a;
	}
}
function sn(e, t, n, r) {
	let i = tn(K(e, t, r)).toLowerCase(), a = t.options.find((e) => e.value === n);
	return a ? a.matchOthers ? !t.options.filter((e) => !e.matchOthers).map((e) => e.value.toLowerCase()).includes(i) : i === a.value.toLowerCase() : !0;
}
function cn(e) {
	return new Set(e.split(",").map((e) => e.trim()).filter(Boolean));
}
function ln(e, t) {
	return t == null ? new Set(e.options.map((e) => e.value)) : typeof t == "string" && t.trim() === "" ? /* @__PURE__ */ new Set() : typeof t == "string" ? cn(t) : new Set(e.options.map((e) => e.value));
}
function un(e, t, n, r) {
	let i = cn(n);
	return i.size === 0 ? !1 : i.size >= t.options.length || Wt(e.getProperties()).some((e) => i.has(e));
}
function dn(e, t) {
	return t == null ? !1 : e.type === "multiChoice" ? typeof t == "string" && cn(t).size < e.options.length : typeof t == "boolean" || t.trim() !== "";
}
function fn(e, t, n, r) {
	switch (t.type) {
		case "boolean": return rn(e, t, n, r);
		case "date": return an(e, t, String(n), r);
		case "text": return on(e, t, String(n), r);
		case "choice": return sn(e, t, String(n), r);
		case "multiChoice": return un(e, t, String(n), r);
		default: return !0;
	}
}
function pn(e, t, n, r) {
	for (let i of t) {
		let t = n[i.id];
		if (dn(i, t) && !fn(e, i, t, r)) return !1;
	}
	return !0;
}
function mn(e, t, n, r = {}) {
	if (!t.length || !t.some((e) => dn(e, n[e.id]))) return !0;
	let i = e.get("features");
	return i?.length ? i.some((e) => pn(e, t, n, r)) : pn(e, t, n, r);
}
function hn(e, t) {
	if (t == null) return 0;
	let n = ln(e, t);
	return Math.max(0, e.options.length - n.size);
}
function gn(e, t) {
	return e.reduce((e, n) => {
		let r = t[n.id];
		return n.type === "multiChoice" ? e + hn(n, r) : e + +!!dn(n, r);
	}, 0);
}
function _n(e = []) {
	return Object.fromEntries(e.map((e) => [e.id, null]));
}
//#endregion
//#region src/catalog/getGeodesyCatalogFromMap.ts
function q(e) {
	let t = e.getLayers().getArray().find((e) => e instanceof s && e.get("name") === "geodesyGroup");
	return t instanceof s ? t.get("geodesyCatalog") ?? H : H;
}
//#endregion
//#region src/interaction/geodesySelectCluster.ts
function vn(e, t, n) {
	let r = e(t, n);
	return r ? Array.isArray(r) ? r : typeof r == "function" ? [] : [r] : [];
}
var yn = class extends d {
	explosionDurationMs;
	constructor(e = {}) {
		let t = e.explosionAnimationDuration ?? e.animationDuration ?? 500;
		super({
			...e,
			animationDuration: t
		}), this.explosionDurationMs = t;
	}
	animateCluster_(n, r) {
		let i = this;
		if (i.listenerKey_ && u(i.listenerKey_), !r.length) return;
		let s = i.overlayLayer_.getStyle(), d = typeof s == "function" ? s : () => s, p = Math.max(0, this.explosionDurationMs), m = this.getMap();
		if (!m) return;
		if (p === 0) {
			i.overlayLayer_.getSource()?.addFeatures(r), i.overlayLayer_.changed();
			return;
		}
		let te = m.getView().getResolution() ?? 1, h = null;
		i.listenerKey_ = l(i.overlayLayer_, "postrender", (t) => {
			h === null && (h = t.frameState.time);
			let a = t.vectorContext ?? f(t), s = c((t.frameState.time - h) / p);
			for (let i of r) {
				if (!i.get("features")) continue;
				let r = i.getGeometry();
				if (!(r instanceof o)) continue;
				let c = r.getCoordinates(), l = new e(new o([n[0] + s * (c[0] - n[0]), n[1] + s * (c[1] - n[1])])), u = vn(d, i, te);
				for (let e of u) a.drawFeature(l, ee(t, e));
			}
			if (s >= 1) {
				i.listenerKey_ && u(i.listenerKey_), i.overlayLayer_.getSource()?.addFeatures(r), i.overlayLayer_.changed();
				return;
			}
			t.frameState.animate = !0;
		});
		let g = new e(new o(m.getView().getCenter() ?? n));
		g.setStyle(new a({ image: new t({ radius: .1 }) })), i.overlayLayer_.getSource()?.addFeature(g);
	}
};
//#endregion
//#region src/wfs/geodesyWfsLayerUtils.ts
function J(e, t) {
	if (!(e instanceof p) || e.get("geodesyWfsDataLayer") === !0 || !e.getVisible() || e.get("geodesyLayerKind") !== "wfs") return !1;
	let n = e.get(b);
	return n !== void 0 && t.has(n);
}
function bn(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.getId() === void 0 ? m(r) : String(r.getId());
		t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function xn(e) {
	let t = e.get("features");
	return t?.length ? bn(t) : [e];
}
function Sn(e) {
	let t = e.get("features");
	return t?.length ? bn(t).length : 1;
}
function Cn(e) {
	return Sn(e) > 1;
}
function wn(e) {
	return e.get("selectclusterfeature") === !0;
}
//#endregion
//#region src/interaction/geodesyWfsClusterSelect.ts
var Tn = /* @__PURE__ */ new WeakMap();
function En(e) {
	return Tn.get(e) ?? null;
}
function Dn(e) {
	En(e)?.clear();
}
function On(e, t) {
	if (!t.wfsCluster.enabled) return () => {};
	let n = new Set(t.wfsUiLayerIds), r = new yn({
		layers: (e) => J(e, n),
		featureStyle: He(t),
		animate: t.wfsCluster.animateExplosion,
		explosionAnimationDuration: t.wfsCluster.explosionAnimationDuration,
		pointRadius: t.wfsCluster.pointRadius,
		autoClose: !0,
		selectCluster: !1
	});
	return e.addInteraction(r), Tn.set(e, r), () => {
		r.clear(), e.removeInteraction(r), Tn.delete(e);
	};
}
//#endregion
//#region src/partner/partnerLogo.ts
var kn = "https://data.geopf.fr/annexes/geodesie/gdp/logos";
function An(e) {
	return !e || e.trim() === "" ? null : `${kn}/logo_${e.trim()}.jpg`;
}
function jn(e) {
	return A(e);
}
async function Mn(e) {
	return Qe(e);
}
async function Nn(e) {
	await Promise.all(e.map((e) => Mn(e)));
}
async function Pn(e) {
	let t = An(e);
	return t ? Mn(t) : null;
}
function Fn(e) {
	let t = e.proprio_id;
	return typeof t == "string" && t.trim() !== "" ? t.trim() : null;
}
function In(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = Fn(n.feature.getProperties());
		e && t.add(e);
	}
	return Array.from(t);
}
async function Ln(e) {
	await Nn(In(e).map((e) => An(e)).filter((e) => e !== null));
}
//#endregion
//#region src/interaction/geodesyPopupTemplate.ts
function Rn(e, t = R, n = {}) {
	let r = e.getProperties(), i = B(r, t), a = n.pictoUrlMaps ?? T, o = {};
	return V(I(r, t), t).forEach(([e, n]) => {
		let r = z(e, t);
		o[e] = {
			title: r,
			visible: (t) => !M(t.get(e)),
			...ft(e) ? { format: (e, t) => {
				let n = t.get(b), i = We(e, {
					pictoUrlMaps: a,
					layerId: n
				});
				return i ? mt(i, r) : String(e);
			} } : P(e, n) ? { format: (e) => mt(e, r) } : N(e, n) ? { format: (e) => pt(e) } : {}
		};
	}), {
		title: i,
		attributes: o
	};
}
//#endregion
//#region src/cache/geodesyFeatureInfoCache.ts
var Y = new qe(128);
function zn(e) {
	return Y.get(e);
}
function Bn(e, t) {
	Y.set(e, t);
}
function Vn() {
	Y.clear();
}
function Hn() {
	let e = 0;
	return Y.forEach((t, n) => {
		e += n.length * 2, e += t.length * 2;
	}), {
		entryCount: Y.entryCount,
		sizeBytes: e
	};
}
//#endregion
//#region src/utils/fetchWithTimeout.ts
var Un = 5e3;
async function Wn(e, t = {}) {
	let { timeoutMs: n = Un, signal: r, ...i } = t, a = new AbortController(), o = window.setTimeout(() => a.abort(), n);
	r && (r.aborted ? a.abort() : r.addEventListener("abort", () => a.abort(), { once: !0 }));
	try {
		return await fetch(e, {
			...i,
			signal: a.signal
		});
	} finally {
		window.clearTimeout(o);
	}
}
//#endregion
//#region src/wms/mergeGeodesyFeatureHits.ts
function Gn(e) {
	return e != null && typeof e != "object";
}
function Kn(e, t) {
	for (let [n, r] of Object.entries(t)) Gn(r) && String(r).trim() !== "" && e.set(n.toLowerCase(), {
		key: n,
		value: r
	});
}
function qn(e, t) {
	let n = /* @__PURE__ */ new Map();
	return Kn(n, t), Object.fromEntries([...n.values()].map(({ key: e, value: t }) => [e, t]));
}
function Jn(e, t) {
	if (t in e) return e[t];
	let n = t.toLowerCase(), r = Object.keys(e).find((e) => e.toLowerCase() === n);
	return r ? e[r] : void 0;
}
function Yn(e, t = "Point géodésique", n = H) {
	let r = String(Jn(e, "groupe_type") ?? "").trim();
	if (!r) return t;
	let i = r.toLowerCase();
	return n.layers.find((e) => e.id !== n.dataLayerId && [
		e.id,
		e.shortLabel,
		e.title
	].map((e) => e.toLowerCase()).some((t) => i.includes(t) || t.includes(i) || i === e.id.toLowerCase()))?.title ?? r;
}
function Xn(e, t, n = H) {
	if (t.length === 0) return !1;
	let r = String(Jn(e, "groupe_type") ?? "").trim();
	if (!r) return !0;
	let i = r.toLowerCase();
	return t.some((e) => {
		let t = n.layers.find((t) => t.id === e);
		return t ? [
			t.id,
			t.shortLabel,
			t.title
		].map((e) => e.toLowerCase()).some((e) => i.includes(e) || e.includes(i) || i === t.id.toLowerCase()) : !1;
	});
}
function Zn(e, t) {
	return e.layerId === t.dataLayerId ? {
		...e,
		layerTitle: Yn(e.feature.getProperties(), e.layerTitle, t)
	} : e;
}
function Qn(t, n, r) {
	let i = new e(qn(t.feature.getProperties(), n.feature.getProperties())), a = n.feature.getGeometry() ?? t.feature.getGeometry();
	a && i.setGeometry(a.clone());
	let o = t.feature.get("coordinate") ?? n.feature.get("coordinate");
	return o !== void 0 && i.set("coordinate", o), {
		layerTitle: Yn(i.getProperties(), t.layerTitle, r),
		layerId: r.dataLayerId,
		feature: i
	};
}
function $n(e, t = H) {
	if (e.length === 0) return e;
	let n = new Set(t.networkLayerIds), r = e.filter((e) => e.layerId === t.dataLayerId).map((e) => Zn(e, t));
	if (r.length > 0) return r;
	if (e.length <= 1) return e.map((e) => Zn(e, t));
	let i = e.filter((e) => e.layerId !== void 0 && n.has(e.layerId))[0], a = e.find((e) => e.layerId === t.dataLayerId);
	return i && a ? [Qn(i, a, t)] : e.map((e) => Zn(e, t));
}
//#endregion
//#region src/wms/queryGeodesyAtCoordinate.ts
var er = "application/json", tr = "text/html";
function nr(e) {
	let t = e.getLayers().getArray().find((e) => e instanceof s && e.get("name") === "geodesyGroup");
	return t instanceof s ? t : null;
}
function rr(e, t) {
	let n = nr(e);
	if (!n) return [];
	let r = t.layerIds ? new Set(t.layerIds) : null;
	return n.getLayers().getArray().flatMap((e) => {
		if (!(e instanceof _)) return [];
		let n = e.get(b);
		return !n || r && !r.has(n) || t.visibleOnly && !e.getVisible() || !t.visibleOnly && e.getVisible() || !e.getSource() ? [] : [{
			layer: e,
			layerTitle: e.get("title") ?? "Géodésie",
			layerId: n
		}];
	});
}
function ir(e) {
	let t = q(e), n = new Set(t.networkLayerIds);
	return rr(e, { visibleOnly: !0 }).map((e) => e.layerId).filter((e) => n.has(e));
}
function ar(e) {
	let t = /* @__PURE__ */ new Set();
	return e.filter((e) => !t.has(e.layerId) && (t.add(e.layerId), !0));
}
function or(e, t) {
	try {
		let n = JSON.parse(e);
		return n.features?.length ? new g().readFeatures(n, { featureProjection: t }) : [];
	} catch {
		return [];
	}
}
function sr(t, n) {
	if (!t.includes("table.featureInfo")) return [];
	let r = new DOMParser().parseFromString(t, "text/html").querySelector("table.featureInfo");
	if (!r) return [];
	let i = {}, a = r.querySelector("caption")?.textContent?.trim();
	if (a && (i._caption = a), r.querySelectorAll("tr").forEach((e) => {
		let t = e.querySelector("th"), n = e.querySelector("td"), r = t?.textContent?.trim(), a = n?.textContent?.trim();
		r && a && (i[r] = a);
	}), Object.keys(i).length === 0) return [];
	let o = new e(i);
	return o.set("coordinate", n), [o];
}
function cr(t, n) {
	let r = new DOMParser().parseFromString(t, "text/html").querySelector("table.featureInfo");
	return r ? [new e({
		_caption: r.querySelector("caption")?.textContent?.trim() ?? n,
		_htmlSnippet: r.outerHTML
	})] : [];
}
function lr(e) {
	return e.includes("ServiceExceptionReport") || e.includes("<ServiceException");
}
async function ur(e, t, n, r, i) {
	let a = e.getParams().LAYERS, o = e.getFeatureInfoUrl(t, n, r, {
		INFO_FORMAT: i,
		QUERY_LAYERS: a,
		FEATURE_COUNT: 10,
		BUFFER: 15,
		STYLES: ""
	});
	if (!o) return null;
	let s = zn(o);
	if (s !== void 0) return s;
	let c = await Wn(o, { timeoutMs: 5e3 });
	if (!c.ok) return null;
	let l = await c.text();
	return lr(l) ? null : (Bn(o, l), l);
}
async function dr(e, t, n, r) {
	let i = e.layer.getSource();
	if (!i) return [];
	let a = or(await ur(i, t, n, r, er) ?? "", r);
	if (a.length === 0) {
		let o = await ur(i, t, n, r, tr) ?? "";
		a = sr(o, t), a.length === 0 && o.includes("table.featureInfo") && (a = cr(o, e.layerTitle));
	}
	return a.map((t) => ({
		layerTitle: e.layerTitle,
		layerId: e.layerId,
		feature: t
	}));
}
async function fr(e, t, n = {}) {
	let r = e.getView(), i = r.getResolution(), a = r.getProjection();
	if (i === void 0 || !a) return [];
	let o = n.dataLayerIds ?? n.enrichmentLayerIds ?? [q(e).dataLayerId], s = n.filterByVisibleNetworkLayers ?? !0, c = ar(rr(e, {
		visibleOnly: !1,
		layerIds: o
	}));
	if (c.length === 0) return [];
	let l = $n((await Promise.all(c.map((e) => dr(e, t, i, a)))).flat(), q(e));
	if (s) {
		let t = ir(e);
		l = l.filter((e) => Xn(e.feature.getProperties(), t));
	}
	return l;
}
//#endregion
//#region src/annex/geodesyAnnexLayerUtils.ts
function pr(e, t) {
	if (!(e instanceof p) || !e.getVisible() || e.get("geodesyLayerKind") !== "annex") return !1;
	let n = e.get(b);
	return n !== void 0 && t.has(n);
}
function mr(e) {
	return e;
}
//#endregion
//#region src/annex/queryGeodesyAnnexAtPixel.ts
function hr(e, t, n, r) {
	let i = e.annexLayers.find((e) => e.id === t);
	return {
		layerTitle: r ?? i?.title ?? "Géodésie annexe",
		layerId: t,
		feature: n
	};
}
function gr(e, t, n = {}) {
	let r = q(e), i = n.hitTolerance ?? 5, a = new Set(n.layerIds ?? r.annexUiLayerIds);
	if (a.size === 0) return [];
	let o = null;
	return e.forEachFeatureAtPixel(t, (e, t) => {
		if (!pr(t, a)) return;
		let n = t.get(b), i = mr(e);
		return o = hr(r, n, i, t.get("title")), !0;
	}, {
		hitTolerance: i,
		layerFilter: (e) => pr(e, a)
	}), o ? [o] : [];
}
//#endregion
//#region src/wfs/resolveGeodesyWfsHitFeature.ts
function _r(e, t) {
	let n = bn(e.get("features") ?? []);
	if (!n.length) return e;
	if (n.length === 1 || !t) return n[0];
	let r = n[0], i = Infinity;
	for (let e of n) {
		let n = e.getGeometry();
		if (!n) continue;
		let a = n.getClosestPoint(t), o = a[0] - t[0], s = a[1] - t[1], c = o * o + s * s;
		c < i && (i = c, r = e);
	}
	return r;
}
//#endregion
//#region src/wfs/queryGeodesyWfsAtPixel.ts
function vr(e, t) {
	return e.wfsDomainLayers.find((e) => e.id === t) && e.wfsDomainSourceLayerId ? e.wfsDomainSourceLayerId : t;
}
function yr(e, t, n) {
	let r = t.get(b);
	if (r && n.has(r)) return r;
	let i = e.wfsDomainSourceLayerId;
	if (!i || e.wfsDomainLayers.length === 0 || r !== void 0 && r !== i) return null;
	for (let r of e.wfsDomainLayers) if (n.has(r.id) && W(t, r.domaines)) return r.id;
	return null;
}
function br(e, t, n, r) {
	let i = e.wfsDomainLayers.find((e) => e.id === t), a = vr(e, t), o = e.wfsLayers.find((e) => e.id === a);
	return {
		layerTitle: r ?? i?.title ?? o?.title ?? "Géodésie WFS",
		layerId: t,
		feature: n
	};
}
function xr(e, t, n, r) {
	if (!wn(e)) return null;
	let i = _r(e, t), a = yr(n, i, r);
	return a ? br(n, a, i) : null;
}
function Sr(e, t, n, r, i, a) {
	let o = En(e)?.getLayer() ?? null;
	if (o?.getVisible()) {
		let s = null;
		if (e.forEachFeatureAtPixel(t, (e, t) => {
			if (t === o) return s = xr(e, n, r, i), s !== null;
		}, {
			hitTolerance: a,
			layerFilter: (e) => e === o
		}), s) return s;
	}
	let s = null;
	return e.forEachFeatureAtPixel(t, (e) => (s = xr(e, n, r, i), s !== null), { hitTolerance: a }), s;
}
function Cr(e, t, n, r = {}) {
	let i = q(e), a = new Set(r.layerIds ?? i.wfsUiLayerIds);
	return a.size === 0 ? null : xr(t, n, i, a);
}
function wr(e, t, n = {}) {
	let r = q(e);
	if (!r.wfsCluster.enabled) return !1;
	let i = n.hitTolerance ?? 5, a = new Set(n.layerIds ?? r.wfsUiLayerIds);
	if (a.size === 0) return !1;
	let o = !1;
	return e.forEachFeatureAtPixel(t, (e, t) => {
		if (J(t, a) && Cn(e)) return o = !0, !0;
	}, {
		hitTolerance: i,
		layerFilter: (e) => J(e, a)
	}), o;
}
function Tr(e, t, n = {}) {
	let r = q(e), i = n.hitTolerance ?? 5, a = new Set(n.layerIds ?? r.wfsUiLayerIds);
	if (a.size === 0) return [];
	let o = e.getCoordinateFromPixel(t), s = Sr(e, t, o, r, a, i);
	if (s) return [s];
	let c = null;
	return e.forEachFeatureAtPixel(t, (e, t) => {
		if (!J(t, a)) return;
		let n = e;
		if (r.wfsCluster.enabled && Cn(n)) return;
		let i = t.get(b), s = _r(n, o);
		return c = br(r, i, s, t.get("title")), !0;
	}, {
		hitTolerance: i,
		layerFilter: (e) => J(e, a)
	}), c ? [c] : [];
}
//#endregion
//#region src/interaction/queryGeodesyAtClick.ts
async function Er(e, t, n, r = {}) {
	let i = r.preferWfs ?? !0;
	if (i) {
		let t = Tr(e, n, r.wfs);
		if (t.length > 0) return t;
		let i = gr(e, n, r.annex);
		if (i.length > 0) return i;
	}
	let a = await fr(e, t, r.wms);
	if (a.length > 0 || !i) return a;
	let o = gr(e, n, r.annex);
	return o.length > 0 ? o : Tr(e, n, r.wfs);
}
//#endregion
//#region src/interaction/geodesyPopup.ts
var Dr = "default anim geodesy-ec";
function Or(e, t = {}) {
	if (t.disabled) return () => void 0;
	let n = new h({
		popupClass: Dr,
		closeBox: !0,
		positioning: "auto",
		template: (t) => {
			let n = q(e);
			return Rn(t, n.attributes, { pictoUrlMaps: n.wfsPictoUrlMaps });
		}
	});
	e.addOverlay(n);
	let r = new te({
		popupClass: Dr,
		closeBox: !0,
		positioning: "auto"
	});
	e.addOverlay(r);
	let i = 0, a = l(e, "singleclick", (t) => {
		let a = t;
		(async () => {
			let t = ++i;
			n.hide(), r.hide();
			let o = await Er(e, a.coordinate, a.pixel);
			if (t !== i || o.length === 0) return;
			await Promise.all([et(o), Ln(o)]);
			let s = o[0].feature.get("_htmlSnippet");
			if (s) {
				let e = await tt(s);
				r.show(a.coordinate, `<div class="geodesy-popup-html">${e}</div>`);
				return;
			}
			n.show(a.coordinate, o.map((e) => e.feature));
		})();
	});
	return () => {
		i += 1, u(a), e.removeOverlay(n), e.removeOverlay(r);
	};
}
//#endregion
//#region src/wfs/geodesyWfsAttributeFilterIndex.ts
function kr(e) {
	let t = /* @__PURE__ */ new Map();
	return e.getFeatures().forEach((e) => {
		let n = Kt(e.getProperties());
		n && t.set(n, e.getProperties());
	}), t;
}
function Ar(e) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach(({ layerId: e, source: n }) => {
		t.set(e, kr(n));
	}), t;
}
//#endregion
//#region src/annex/parseGeodesyGdpRgp2.ts
function jr(e) {
	let t = (e.match(/,/g) ?? []).length;
	return (e.match(/;/g) ?? []).length > t ? ";" : ",";
}
function Mr(e, t) {
	let n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a += 1) {
		let o = e[a];
		if (o === "\"") {
			i && e[a + 1] === "\"" ? (r += "\"", a += 1) : i = !i;
			continue;
		}
		if (o === t && !i) {
			n.push(r.trim()), r = "";
			continue;
		}
		r += o;
	}
	return n.push(r.trim()), n;
}
function Nr(e) {
	return e.trim().toLowerCase();
}
function Pr(e) {
	let [t, n] = e.split(",").map((e) => e.trim()), r = Number.parseFloat(t?.replace(",", ".") ?? ""), i = Number.parseFloat(n?.replace(",", ".") ?? "");
	return !Number.isFinite(r) || !Number.isFinite(i) ? null : {
		longitude: r,
		latitude: i
	};
}
function Fr(e) {
	return e.findIndex((e) => {
		let t = Nr(e);
		return t === "longitude,latitude" || t === "lon,lat";
	});
}
function Ir(t, n, r, i) {
	let a = {};
	t.forEach((e, t) => {
		let r = n[t]?.trim();
		r && (a[Nr(e)] = r);
	});
	let s = Fr(t);
	if (s < 0) return null;
	let c = Pr(n[s] ?? "");
	if (!c) return null;
	a.longitude = String(c.longitude), a.latitude = String(c.latitude);
	let l = ne([c.longitude, c.latitude], r, i), u = new e(a);
	return u.setGeometry(new o(l)), u.setId(a.nom ?? void 0), u;
}
function Lr(e, t = {}) {
	let { dataProjection: n = "EPSG:4326", featureProjection: r = "EPSG:3857" } = t, i = e.split(/\r?\n/).map((e) => e.trim()).filter((e) => e.length > 0 && !e.startsWith("#"));
	if (i.length < 2) return [];
	let a = jr(i[0]), o = Mr(i[0], a);
	return i.slice(1).flatMap((e) => {
		let t = Mr(e, a), i = Ir(o, t, n, r);
		return i ? [i] : [];
	});
}
//#endregion
//#region src/annex/loadGeodesyAnnexFeatures.ts
var Rr = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
function zr(e, t) {
	return `${e.url}|${e.format}|${t}`;
}
function Br(e, t) {
	return zr(e, t?.wfsDataProjection ?? "EPSG:4326");
}
function Vr(e, t) {
	if (!e) {
		Rr.clear(), X.clear();
		return;
	}
	let n = Br(e, t);
	Rr.delete(n), X.delete(n);
}
function Hr(e) {
	let t = Br(e.definition, e.catalog), n = X.get(t);
	return n === void 0 ? null : new Date(n);
}
function Ur(e, t, n) {
	switch (e.format) {
		case "gdp-rgp2": return Lr(t, { dataProjection: n });
		default: return [];
	}
}
async function Wr(e) {
	let t = await Wn(e, { credentials: "omit" });
	if (!t.ok) throw Error(`[gdp-tools] Annex fetch failed (${t.status}) for ${e}`);
	return t.text();
}
async function Gr(e) {
	let { definition: t, catalog: n } = e, r = Br(t, n), i = Rr.get(r);
	return i || (i = Wr(t.url).then((e) => Ur(t, e, n?.wfsDataProjection ?? "EPSG:4326")).then((e) => (X.set(r, Date.now()), e)), Rr.set(r, i)), i;
}
//#endregion
//#region src/annex/geodesyGdpRgp2Dispo.ts
var Kr = "Non disponible", qr = "Disponible";
function Jr(e) {
	if (e == null) return "";
	let t = String(e).trim().toLowerCase();
	return !t || t === "null" ? "" : t;
}
function Yr(e) {
	return e === "1" ? "available" : e === "0" ? "unavailable" : null;
}
function Xr(e) {
	let t = Jr(e);
	return !t || !/^[01]+$/.test(t) ? ["unavailable"] : t.split("").flatMap((e) => {
		let t = Yr(e);
		return t ? [t] : [];
	});
}
function Zr(e) {
	return e === "1" ? qr : e === "0" ? Kr : e;
}
function Qr(e) {
	let t = Jr(e);
	return t ? /^[01]+$/.test(t) ? t.split("").map(Zr).join(", ") : String(e).trim() : Kr;
}
function $r(e) {
	let t = Jr(e);
	return t !== "" && /^[01]+$/.test(t);
}
function ei(e) {
	let t = Jr(e);
	return !t || !/^[01]+$/.test(t) ? !1 : t.split("").every((e) => e === "1");
}
//#endregion
//#region src/style/geodesyAnnexStyle.ts
var ti = {
	full: "#26a581",
	partial: "#f18345",
	none: "#e86f4a",
	down: "#6c6661"
};
function ni(e) {
	if (!$r(e)) return "down";
	let t = Xr(e), n = t.filter((e) => e === "available").length;
	return n === 0 ? "none" : n === t.length ? "full" : "partial";
}
function ri(e) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<circle cx="14" cy="14" r="6.5" fill="${e}"/>
</svg>`;
}
function ii(e) {
	let t = `data:image/svg+xml;utf8,${encodeURIComponent(ri(e))}`;
	return new a({ image: new r({
		src: t,
		anchor: [.5, .5]
	}) });
}
var ai = {
	full: ii(ti.full),
	partial: ii(ti.partial),
	none: ii(ti.none),
	down: ii(ti.down)
};
function oi() {
	return (t) => t instanceof e ? ai[ni(t.get("dispo"))] : ai.down;
}
//#endregion
//#region src/layers/geodesyAnnexLayer.ts
var si = 55;
function ci(e, t) {
	return t === void 0 ? (e.format, oi()) : t;
}
function li(e, t) {
	let n = new v();
	return Gr({
		definition: e,
		catalog: t
	}).then((e) => {
		n.addFeatures(e);
	}).catch((t) => {
		console.error(`[gdp-tools] Failed to load annex layer "${e.id}".`, t);
	}), n;
}
function ui(e, t = {}) {
	let { visible: n = !1, catalog: r = H, style: i } = t, a = r.annexLayerIds.indexOf(e.id);
	return new p({
		properties: {
			title: e.title,
			name: `geodesyAnnex-${e.id}`,
			[b]: e.id,
			[C]: "annex"
		},
		visible: n,
		source: li(e, r),
		style: ci(e, i),
		zIndex: si + Math.max(a, 0)
	});
}
//#endregion
//#region src/style/geodesyWfsClusterStyle.ts
var di = {
	strokeColor: "#ffffff",
	textColor: "#ffffff",
	minRadius: 8,
	maxRadius: 20,
	radiusScale: .75,
	smallClusterColor: "rgb(0, 128, 0)",
	mediumClusterColor: "rgb(255, 128, 0)",
	largeClusterColor: "rgb(192, 0, 0)",
	mediumClusterThreshold: 8,
	largeClusterThreshold: 25
};
function fi(e) {
	let t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3]),
		t[4] === void 0 ? 1 : Number(t[4])
	] : null;
}
function pi(e, t, n, r) {
	return `rgba(${Math.round(e)}, ${Math.round(t)}, ${Math.round(n)}, ${r.toFixed(2)})`;
}
function mi(e, t) {
	let n = fi(e);
	return n ? [
		n[0],
		n[1],
		n[2]
	] : t;
}
function hi(e, t) {
	return e > t.largeClusterThreshold ? mi(t.largeClusterColor, [
		192,
		0,
		0
	]) : e > t.mediumClusterThreshold ? mi(t.mediumClusterColor, [
		255,
		128,
		0
	]) : mi(t.smallClusterColor, [
		0,
		128,
		0
	]);
}
function gi(e, t) {
	if (t.fillColor) return t.fillColor;
	let [n, r, i] = hi(e, t);
	return pi(n, r, i, 1);
}
function _i(e, t) {
	return Math.max(t.minRadius, Math.min(e * t.radiusScale, t.maxRadius));
}
var vi = 6, yi = 15;
function bi(e, t) {
	let n = fi(e), r = n ? pi(n[0], n[1], n[2], .5) : e, a = 2 * Math.PI * t / vi;
	return new i({
		color: r,
		width: yi,
		lineDash: [
			0,
			a,
			a,
			a,
			a,
			a,
			a
		],
		lineCap: "butt"
	});
}
function xi(e, r) {
	let o = _i(e, r), s = gi(e, r);
	return new a({
		image: new t({
			radius: o,
			fill: new n({ color: s }),
			stroke: bi(s, o)
		}),
		text: new ie({
			text: String(e),
			fill: new n({ color: r.textColor }),
			stroke: new i({
				color: "rgba(0, 0, 0, 0.35)",
				width: 2
			})
		})
	});
}
function Si(e, t = {}) {
	let n = {
		...di,
		...t
	}, r = /* @__PURE__ */ new Map();
	return (t, i) => {
		let a = t, o = Sn(a);
		if (o > 1) {
			let e = r.get(o);
			return e || (e = xi(o, n), r.set(o, e)), e;
		}
		return e(xn(a)[0] ?? a, i);
	};
}
function Ci(e, t) {
	return Si(typeof e == "function" ? e : () => e, t);
}
//#endregion
//#region src/style/geodesyWfsDisplayFilterStyle.ts
function wi(t, n = {}) {
	let r = typeof t == "function" ? t : () => t, i = n.cluster ? Ci(r) : r, a = n.domaines ?? [], o = n.attributeFilters ?? [], s = n.attributeFilterValues;
	return (t, r) => {
		if (!(t instanceof e)) return i(t, r);
		if (a.length > 0 && !W(t, a)) return [];
		let c = s?.values ?? {};
		return o.length > 0 && !mn(t, o, c, {
			domainSourceLayerId: n.domainSourceLayerId,
			auxiliaryPropertiesByLayerId: s?.auxiliaryPropertiesByLayerId
		}) ? [] : i(t, r);
	};
}
//#endregion
//#region src/layers/geodesyAnimatedClusterLayer.ts
var Ti = class extends se {
	getClusterForFeature(e, t) {
		let n = e.getId();
		for (let r of t) {
			let t = r.get("features");
			if (t?.length) {
				for (let i of t) if (i === e || n !== void 0 && i.getId() === n) return r;
			}
		}
		return !1;
	}
};
//#endregion
//#region src/wfs/buildGeodesyWfsGetFeatureUrl.ts
function Ei(e, t, n = {}) {
	let { bboxOrder: r = "latLon", paddingRatio: i = 0, bboxCrs: a } = n, [o, s, c, l] = re(e, t, "EPSG:4326");
	if (i > 0) {
		let e = (c - o) * i, t = (l - s) * i;
		o -= e, c += e, s -= t, l += t;
	}
	let u = (r === "latLon" ? [
		s,
		o,
		l,
		c
	] : [
		o,
		s,
		c,
		l
	]).join(",");
	return a ? `${u},${a}` : u;
}
function Di(e) {
	return e.startsWith("2.");
}
function Oi(e) {
	let { wfsUrl: t, typeName: n, bbox: r, cqlFilter: i, propertyNames: a, apiKey: o, version: s = "2.0.0", outputFormat: c = "application/json", useCacheBuster: l = !0 } = e, u = new URLSearchParams({
		SERVICE: "WFS",
		VERSION: s,
		REQUEST: "GetFeature",
		OUTPUTFORMAT: c
	});
	return r && u.set("bbox", r), i && u.set("CQL_FILTER", i), a?.length && u.set("PROPERTYNAME", a.join(",")), Di(s) ? u.set("typeNames", n) : u.set("TYPENAME", n), o && u.set("apikey", o), l && u.set("_t", String(Date.now())), `${t}${t.includes("?") ? "&" : "?"}${u.toString()}`;
}
//#endregion
//#region src/wfs/parseGeodesyWfsCsv.ts
var ki = new ce(), Ai = /* @__PURE__ */ new Set([
	"the_geom",
	"geom",
	"geometry",
	"wkt",
	"shape",
	"geometrie"
]), ji = /* @__PURE__ */ new Set([
	"lon",
	"longitude",
	"x",
	"coord_x",
	"cg1_coord1"
]), Mi = /* @__PURE__ */ new Set([
	"lat",
	"latitude",
	"y",
	"coord_y",
	"cg1_coord2"
]);
function Ni(e) {
	let t = (e.match(/,/g) ?? []).length;
	return (e.match(/;/g) ?? []).length > t ? ";" : ",";
}
function Pi(e, t) {
	let n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a += 1) {
		let o = e[a];
		if (o === "\"") {
			i && e[a + 1] === "\"" ? (r += "\"", a += 1) : i = !i;
			continue;
		}
		if (o === t && !i) {
			n.push(r.trim()), r = "";
			continue;
		}
		r += o;
	}
	return n.push(r.trim()), n;
}
function Fi(e) {
	return e.trim().toLowerCase();
}
function Ii(e, t) {
	return e.findIndex((e) => t.has(Fi(e)));
}
function Li(e) {
	return e.findIndex((e) => Ai.has(Fi(e)));
}
function Ri(t, n, r, i) {
	let a = {};
	t.forEach((e, t) => {
		let r = n[t]?.trim();
		r && (a[e] = r);
	});
	let s = Li(t);
	if (s >= 0) {
		let e = n[s]?.trim();
		if (e) try {
			let t = ki.readFeature(e, {
				dataProjection: r,
				featureProjection: i
			});
			return t.setProperties(a), t;
		} catch {
			return null;
		}
	}
	let c = Ii(t, ji), l = Ii(t, Mi);
	if (c >= 0 && l >= 0) {
		let t = Number.parseFloat(n[c]?.replace(",", ".") ?? ""), s = Number.parseFloat(n[l]?.replace(",", ".") ?? "");
		if (Number.isFinite(t) && Number.isFinite(s)) {
			let n = ne([t, s], r, i), c = new e(a);
			return c.setGeometry(new o(n)), c;
		}
	}
	return null;
}
function zi(e, t = {}) {
	let { dataProjection: n = "EPSG:4326", featureProjection: r = "EPSG:3857" } = t, i = e.split(/\r?\n/).map((e) => e.trim()).filter((e) => e.length > 0);
	if (i.length < 2) return [];
	let a = Ni(i[0]), o = Pi(i[0], a);
	return i.slice(1).flatMap((e) => {
		let t = Pi(e, a), i = Ri(o, t, n, r);
		return i ? [i] : [];
	});
}
//#endregion
//#region src/wfs/parseGeodesyWfsGeoJson.ts
var Bi = new g();
function Vi(e, t = {}) {
	let { dataProjection: n = "EPSG:4326", featureProjection: r = "EPSG:3857" } = t;
	try {
		let t = JSON.parse(e);
		return t.features?.length ? Bi.readFeatures(t, {
			dataProjection: n,
			featureProjection: r
		}) : [];
	} catch {
		return [];
	}
}
//#endregion
//#region src/wfs/loadGeodesyWfsFeatures.ts
var Hi = 15e3;
function Ui(e) {
	let t = e.trim().toLowerCase();
	return t.includes("serviceexception") || t.includes("exceptionreport") || t.startsWith("<?xml");
}
function Wi(e, t, n, r) {
	return t.responseFormat === "geojson" ? Vi(e, {
		dataProjection: n.wfsDataProjection,
		featureProjection: r.getCode()
	}) : zi(e, {
		dataProjection: n.wfsDataProjection,
		featureProjection: r.getCode()
	});
}
async function Gi(e) {
	let { catalog: t, definition: n, extent: r, projection: i, timeoutMs: a = Hi } = e;
	if (!Ae(n, t.wfsApiKey)) return [];
	let o = Ei(r, i, {
		bboxOrder: n.bboxOrder,
		paddingRatio: t.wfsBboxPaddingRatio,
		bboxCrs: n.bboxCrs
	}), s = Oi({
		wfsUrl: je(n, t.wfsUrl),
		typeName: n.typeName,
		apiKey: n.requiresApiKey ? t.wfsApiKey : void 0,
		bbox: o,
		version: n.version,
		outputFormat: n.outputFormat,
		useCacheBuster: t.wfsUseCacheBuster
	}), c = await fetch(s, {
		signal: AbortSignal.timeout(a),
		credentials: "omit",
		mode: "cors"
	});
	if (!c.ok) throw Error(`[gdp-tools] WFS GetFeature failed (${c.status})`);
	let l = await c.text();
	return !l.trim() || Ui(l) ? [] : Wi(l, n, t, i).map((e) => (e.set(b, n.id), Yt(e, n.id), e));
}
//#endregion
//#region src/wfs/geodesyWfsClusterGeometry.ts
function Ki(e) {
	let { catalog: t, domaines: n, attributeFilterValues: r, domainSourceLayerId: i } = e, a = t.wfsAttributeFilters, s = {
		domainSourceLayerId: i,
		auxiliaryPropertiesByLayerId: r?.auxiliaryPropertiesByLayerId
	};
	return (e) => {
		let t = e.getGeometry();
		if (!(t instanceof o) || n?.length && !W(e, n)) return null;
		let i = r?.values ?? {};
		return a.length > 0 && !mn(e, a, i, s) ? null : t;
	};
}
//#endregion
//#region src/layers/geodesyWfsLayer.ts
var qi = 50;
function Ji(e) {
	return e.wfsCluster.maxResolution;
}
function Yi(e, t) {
	return new v({
		strategy: ae,
		loader: async (n, r, i) => Gi({
			catalog: t,
			definition: e,
			extent: n,
			projection: i
		})
	});
}
function Xi(e, t, n) {
	return new oe({
		distance: t.wfsCluster.distance,
		minDistance: t.wfsCluster.minDistance,
		source: e,
		...n ? { geometryFunction: Ki(n) } : {}
	});
}
function Zi(e, t, n) {
	let r = Yi(e, t);
	return t.wfsCluster.enabled ? Xi(r, t, n) : r;
}
function Qi(e) {
	let { catalog: t, visible: n, source: r, style: i, zIndex: a, properties: o } = e, s = {
		properties: o,
		visible: n,
		source: r,
		style: i,
		zIndex: a,
		maxResolution: Ji(t),
		...t.wfsCluster.enabled ? {
			updateWhileAnimating: !0,
			updateWhileInteracting: !0
		} : {}
	};
	return t.wfsCluster.enabled ? new Ti({
		...s,
		animationDuration: t.wfsCluster.animationDuration
	}) : new p(s);
}
function $i(e, t = {}) {
	let n = t.catalog ?? H, r = n.wfsLayerIds.indexOf(e.id);
	return new p({
		properties: {
			title: e.title,
			name: `geodesyWfs-${e.id}`,
			[b]: e.id,
			[C]: "wfs"
		},
		visible: t.visible ?? !1,
		source: Yi(e, n),
		style: () => [],
		maxResolution: Ji(n),
		zIndex: qi + Math.max(r, 0)
	});
}
function ea(e, t) {
	let { catalog: n, visible: r, layerStyle: i, layerIndex: a, clusterGeometryFilter: o } = t;
	return Qi({
		catalog: n,
		visible: r,
		source: Zi(e, n, o),
		style: i,
		zIndex: qi + Math.max(a, 0),
		properties: {
			title: e.title,
			name: `geodesyWfs-${e.id}`,
			[b]: e.id,
			[C]: "wfs"
		}
	});
}
function ta(e, t = {}) {
	let { visible: n = !1, catalog: r = H, style: i, clusterGeometryFilter: a } = t, o = r.wfsPictoUrlMaps[e.id], s = ze(o, i);
	return ea(e, {
		catalog: r,
		visible: n,
		layerStyle: r.wfsCluster.enabled ? Ci(s) : s,
		layerIndex: r.wfsLayerIds.indexOf(e.id),
		clusterGeometryFilter: a
	});
}
//#endregion
//#region src/layers/geodesyWfsDomainLayer.ts
var na = 1;
function ra(e, t) {
	let { catalog: n, sourceLayerId: r, source: i, pointStyle: a, baseZIndex: o, attributeFilterValues: s, visible: c = !1 } = t;
	return Qi({
		catalog: n,
		visible: c,
		source: i,
		zIndex: o + na,
		properties: {
			title: e.title,
			name: `geodesyWfsDomain-${e.id}`,
			[b]: e.id,
			[C]: "wfs",
			[Pt]: r
		},
		style: wi(a, {
			domaines: e.domaines,
			attributeFilters: n.wfsAttributeFilters,
			attributeFilterValues: s,
			domainSourceLayerId: r,
			cluster: n.wfsCluster.enabled
		})
	});
}
function ia(e) {
	let t = 0, n = [];
	return {
		acquire: () => t < e ? (t += 1, Promise.resolve()) : new Promise((e) => {
			n.push(() => {
				t += 1, e();
			});
		}),
		release: () => {
			t = Math.max(t - 1, 0);
			let e = n.shift();
			e && e();
		}
	};
}
var aa = ia(2);
function oa(e) {
	return e.startsWith("image/");
}
function sa(e = {}) {
	let t = e.timeoutMs ?? 6e3, n = e.maxConcurrent ? ia(e.maxConcurrent) : aa;
	return (e, r) => {
		n.acquire().then(async () => {
			let i = new AbortController(), a = window.setTimeout(() => i.abort(), t);
			try {
				let t = await fetch(r, {
					signal: i.signal,
					mode: "cors",
					credentials: "omit"
				});
				if (!t.ok) {
					e.setState(ue.ERROR);
					return;
				}
				if (!oa(t.headers.get("content-type") ?? "")) {
					e.setState(ue.ERROR);
					return;
				}
				let n = await t.blob(), a = URL.createObjectURL(n), o = e.getImage();
				o.onload = () => {
					URL.revokeObjectURL(a);
				}, o.onerror = () => {
					URL.revokeObjectURL(a), e.setState(ue.ERROR);
				}, o.src = a;
			} catch {
				e.setState(ue.ERROR);
			} finally {
				window.clearTimeout(a), n.release();
			}
		});
	};
}
var ca = sa(), la = 20;
function ua(e, t = {}) {
	let { visible: n = !1, zIndexOffset: r = 0, catalog: i = H } = t, a = jt(i, e.id);
	return new _({
		properties: {
			title: e.title,
			name: `geodesyWms-${e.id}`,
			[b]: e.id
		},
		visible: n,
		preload: 0,
		useInterimTilesOnError: !1,
		source: new le({
			url: i.wmsUrl,
			params: {
				LAYERS: e.wmsLayer,
				STYLES: e.style,
				FORMAT: "image/png",
				TRANSPARENT: !0,
				VERSION: "1.3.0",
				"gp-ol-ext": i.wmsGpOlExt
			},
			crossOrigin: "anonymous",
			tileLoadFunction: ca
		}),
		zIndex: la + a + r
	});
}
//#endregion
//#region src/layers/geodesyLayerGroup.ts
var da = 50;
function fa(e) {
	return e.getSource() || null;
}
function pa(e, t, n) {
	e.auxiliaryPropertiesByLayerId = Ar(t.flatMap(({ layerId: e, layer: t }) => {
		let n = fa(t);
		return n ? [{
			layerId: e,
			source: n
		}] : [];
	})), n.forEach((e) => e.changed());
}
function ma(e, t) {
	e.on("addfeature", t), e.on("removefeature", t), e.on("clear", t);
}
function ha(e, t, n, r) {
	let i = en(e.wfsAttributeFilters, t);
	if (!i.length) return [];
	let a = i.flatMap((t) => {
		let n = e.wfsLayers.find((e) => e.id === t);
		if (!n) return [];
		let r = $i(n, {
			catalog: e,
			visible: !1
		});
		r.set(U, !0);
		let i = fa(r);
		return i ? [{
			layerId: t,
			layer: r,
			source: i
		}] : [];
	}), o = () => {
		pa(n, a, r);
	};
	return a.forEach(({ source: e }) => ma(e, o)), o(), a.map(({ layer: e }) => e);
}
function ga(e, t) {
	return e.wfsDomainLayerIds.some((e) => t[e]);
}
function _a(e, t, n) {
	let r = e.wfsDomainSourceLayerId;
	if (!r) return [];
	let i = e.wfsLayers.find((e) => e.id === r);
	if (!i) throw Error(`[gdp-tools] wfsDomainSourceLayerId "${r}" is missing from the catalog.`);
	let a = $i(i, {
		catalog: e,
		visible: t[r] ?? ga(e, t)
	});
	a.set(U, !0);
	let o = a.getSource();
	if (!o) throw Error(`[gdp-tools] WFS source layer "${r}" has no vector source.`);
	let s = e.wfsPictoUrlMaps[r], c = ze(s), l = da + Math.max(e.wfsLayerIds.indexOf(r), 0), u = e.wfsDomainLayers.map((i) => {
		let a = e.wfsCluster.enabled ? Xi(o, e, {
			catalog: e,
			domaines: i.domaines,
			attributeFilterValues: n,
			domainSourceLayerId: r
		}) : o;
		return ra(i, {
			catalog: e,
			sourceLayerId: r,
			source: a,
			pointStyle: c,
			baseZIndex: l,
			attributeFilterValues: n,
			visible: t[i.id] ?? !1
		});
	});
	return [
		a,
		...ha(e, r, n, u),
		...u
	];
}
function va(e = {}) {
	let t = e.catalog ?? H, { visibility: n = { RBF: !0 }, attributeFilterValues: r } = e, i = Xt(r), a = t.layers.map((e) => ua(e, {
		catalog: t,
		visible: e.id === t.dataLayerId ? !1 : n[e.id] ?? !1
	})), o = t.wfsDomainLayers.length > 0 ? _a(t, n, i) : t.wfsLayers.map((e) => ta(e, {
		catalog: t,
		visible: n[e.id] ?? !1,
		clusterGeometryFilter: {
			catalog: t,
			attributeFilterValues: i,
			domainSourceLayerId: e.id
		}
	})), c = t.annexLayers.map((e) => ui(e, {
		catalog: t,
		visible: n[e.id] ?? !1
	}));
	return new s({
		properties: {
			title: "Géodésie",
			name: fe,
			[vt]: t,
			[G]: i
		},
		layers: [
			...a,
			...o,
			...c
		]
	});
}
//#endregion
//#region src/registerGeodesyOnMap.ts
function Z(e) {
	let t = e.getLayers().getArray().find((e) => e.get("name") === fe);
	return t instanceof s ? t : null;
}
function ya(e, t = {}) {
	let n = Z(e);
	n && e.removeLayer(n);
	let r = va({
		catalog: t.catalog,
		visibility: t.visibility,
		attributeFilterValues: t.attributeFilterValues
	});
	e.addLayer(r);
	let i = t.popup === !1, a = Or(e, {
		...typeof t.popup == "object" ? t.popup : {},
		disabled: i
	}), o = On(e, t.catalog ?? q(e));
	return () => {
		o(), a(), e.removeLayer(r);
	};
}
//#endregion
//#region src/geodesyLayerVisibility.ts
function ba(e = ["RBF"], t = H) {
	let n = new Set(e), r = Object.fromEntries(t.layers.map((e) => [e.id, e.id !== t.dataLayerId && n.has(e.id)])), i = t.wfsDomainLayerIds.length > 0 ? Object.fromEntries(t.wfsDomainLayers.map((e) => [e.id, n.has(e.id)])) : Object.fromEntries(t.wfsLayers.map((e) => [e.id, n.has(e.id)]));
	t.wfsDomainSourceLayerId && (i[t.wfsDomainSourceLayerId] = t.wfsDomainLayerIds.some((e) => n.has(e)));
	let a = Object.fromEntries(t.annexLayers.map((e) => [e.id, n.has(e.id)]));
	return {
		...r,
		...i,
		...a
	};
}
function xa(e, t) {
	let n = e.get(b);
	return n ? Mt(t).includes(n) : !1;
}
function Sa(e, t) {
	if (!e.wfsDomainSourceLayerId) return t;
	let n = e.wfsDomainLayerIds.some((e) => t[e]);
	return {
		...t,
		[e.wfsDomainSourceLayerId]: n
	};
}
function Ca(e, t, n) {
	let r = Sa(n, t);
	e.getLayers().forEach((e) => {
		if (!xa(e, n)) return;
		let t = e.get(b), i = t === n.dataLayerId;
		e.setVisible(i ? !1 : r[t] ?? !1);
	});
}
function wa(e) {
	let t = q(e), n = ba([], t), r = Z(e);
	if (!r) return n;
	let i = { ...n };
	return r.getLayers().forEach((e) => {
		if (!xa(e, t)) return;
		let n = e.get(b);
		i[n] = e.getVisible();
	}), i;
}
function Ta(e, t) {
	let n = Z(e);
	if (!n) return;
	let r = q(e);
	Ca(n, {
		...wa(e),
		...t
	}, r);
}
function Ea(e, t, n) {
	Ta(e, { [t]: n });
}
function Da(e) {
	let t = q(e), n = wa(e);
	return t.uiLayers.some((e) => n[e.id]) || t.wfsDomainLayers.some((e) => n[e.id]) || t.wfsUiLayers.some((e) => n[e.id]) || t.annexUiLayers.some((e) => n[e.id]);
}
//#endregion
//#region src/geodesyWfsAttributeFilters.ts
function Oa(e) {
	return e instanceof p && e.get("geodesyLayerKind") === "wfs" && e.get("geodesyWfsDataLayer") !== !0;
}
function ka(e) {
	e.getLayers().forEach((e) => {
		Oa(e) && e.changed();
	});
}
function Aa(e) {
	e.getLayers().forEach((e) => {
		if (!Oa(e)) return;
		let t = e.getSource();
		t instanceof oe && t.refresh();
	});
}
function ja(e) {
	let t = Z(e);
	return t ? t.get("geodesyWfsAttributeFilterValues") ?? null : null;
}
function Ma(e) {
	return ja(e)?.values ?? {};
}
function Na(e) {
	return _n(e.wfsAttributeFilters);
}
function Pa(e, t) {
	let n = Z(e);
	if (!n) return;
	let r = n.get(G);
	r || (r = { values: Na(q(e)) }, n.set(G, r)), r.values = { ...t }, Dn(e), Aa(n), ka(n);
}
function Fa(e) {
	Pa(e, Na(q(e)));
}
//#endregion
//#region src/constants/geodesyExternalUrl.ts
var Ia = "gdp-tools";
function Q(e) {
	return e?.trim() || "gdp-tools";
}
function La(e, t = Ia) {
	let n = Q(t);
	return `${e}${e.includes("?") ? "&" : "?"}source=${encodeURIComponent(n)}`;
}
function Ra(e = Ia) {
	let t = Q(e);
	return (e) => La(e, t);
}
//#endregion
//#region src/annex/geodesyGdpRgp2FicheUrl.ts
var za = "https://fiches-geodesie.ign.fr/st-datageod.php/pt-rgp-1-redirect.html", Ba = "Fiche RGP", Va = "Consulter la fiche station";
function Ha(e, t = Ia) {
	let n = e.trim();
	return n ? La(`${za}?station=${encodeURIComponent(n)}`, Q(t)) : void 0;
}
//#endregion
//#region src/catalog/resolveGeodesyHitAttributeCatalog.ts
function Ua(e, t, n = R) {
	let r = e.annexLayers.find((e) => e.id === t.layerId);
	return r ? L({
		attributeKeys: r.attributeKeys,
		titleKeys: r.titleKeys,
		labels: n.labels
	}) : n;
}
//#endregion
//#region src/wfs/geodesyWfsLoadingState.ts
function Wa(e) {
	if (!e) return null;
	if (e instanceof oe) {
		let t = e.getSource();
		return t instanceof v ? t : null;
	}
	return e instanceof v ? e : null;
}
function $(e) {
	let t = Z(e);
	if (!t) return [];
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		if (e instanceof s) {
			e.getLayers().forEach(r);
			return;
		}
		if (!(e instanceof p)) return;
		let t = e.get(U) === !0, i = e.get(C) === "wfs";
		if (!t && !i) return;
		let a = Wa(e.getSource());
		a && n.add(a);
	};
	return t.getLayers().forEach(r), [...n];
}
function Ga(e) {
	let t = e.loading;
	if (t === !1 || t === void 0) return 0;
	let n = Number(t);
	return Number.isFinite(n) ? Math.max(0, n) : 0;
}
function Ka(e) {
	let t = $(e).reduce((e, t) => e + Ga(t), 0);
	return {
		pendingCount: t,
		isLoading: t > 0
	};
}
function qa(e, t) {
	let n = [], r = 0, i = () => {
		t({
			pendingCount: r,
			isLoading: r > 0
		});
	}, a = () => {
		n.forEach(de), n.length = 0, r = 0;
		for (let t of $(e)) n.push(t.on("featuresloadstart", () => {
			r += 1, i();
		}), t.on("featuresloadend", () => {
			r = Math.max(0, r - 1), i();
		}), t.on("featuresloaderror", () => {
			r = Math.max(0, r - 1), i();
		}));
		i();
	};
	a(), $(e).length === 0 && window.setTimeout(a, 0);
	let o = [e.getLayers().on("add", (e) => {
		e.element.get("name") === "geodesyGroup" && a();
	}), e.getLayers().on("remove", (e) => {
		e.element.get("name") === "geodesyGroup" && a();
	})];
	return () => {
		n.forEach(de), o.forEach(de);
	};
}
//#endregion
//#region src/report/geodesyPointPhotos.ts
function Ja(e, t) {
	return I(e, t).filter(([e, t]) => P(e, t)).map(([e, n]) => {
		let r = n.trim();
		return {
			key: e,
			label: z(e, t),
			url: r,
			displayUrl: A(r)
		};
	});
}
//#endregion
//#region src/report/geodesyPointDisplay.ts
function Ya(e, t) {
	let n = e.feature.getGeometry();
	if (n instanceof o) {
		let [e, t] = y(n.getCoordinates());
		return {
			longitude: e,
			latitude: t
		};
	}
	let r = e.feature.get("coordinate");
	if (r) {
		let [e, t] = y(r);
		return {
			longitude: e,
			latitude: t
		};
	}
	let [i, a] = y(t);
	return {
		longitude: i,
		latitude: a
	};
}
function Xa(e) {
	return e.transformExternalUrl ? e.transformExternalUrl : Ra(Q(e.externalUrlSource));
}
function Za(e, t, n) {
	if (n.layerId !== "GDP_RGP2") return e;
	let r = Ha(String(t.nom ?? "").trim(), Q(n.externalUrlSource));
	return r ? [...e, {
		label: Ba,
		value: Va,
		href: r
	}] : e;
}
function Qa(e, t, n) {
	let r = t.trim();
	return n.layerId === "GDP_RGP2" && e.toLowerCase() === "dispo" ? Qr(r) : r;
}
function $a(e, t, n, r) {
	let i = t.trim(), a = z(e, n), o = Xa(r);
	if (r.layerId === "GDP_RGP2" && e.toLowerCase() === "dispo") return {
		label: a,
		value: i,
		dispoStates: Xr(i)
	};
	if (ft(e)) {
		let e = We(i, {
			pictoUrlMaps: r.pictoUrlMaps ?? T,
			layerId: r.layerId
		});
		return e ? {
			label: a,
			value: i,
			isPicto: !0,
			href: o(e),
			imageUrl: e,
			displayImageUrl: A(e)
		} : {
			label: a,
			value: i,
			isPicto: !0
		};
	}
	return P(e, t) ? {
		label: a,
		value: i,
		href: o(i),
		imageUrl: i,
		displayImageUrl: A(i)
	} : {
		label: a,
		value: i,
		...N(e, t) ? { href: o(i) } : {}
	};
}
function eo(e, t) {
	let n = e.picto ?? e.PICTO;
	if (n == null || String(n).trim() === "") return;
	let r = String(n).trim(), i = We(r, {
		pictoUrlMaps: t.pictoUrlMaps ?? T,
		layerId: t.layerId
	});
	if (!i) return;
	let a = Xa(t);
	return {
		value: r,
		imageUrl: i,
		displayImageUrl: A(i),
		href: a(i)
	};
}
function to(e, t = {}) {
	let n = t.attributeCatalog ?? R;
	return V(I(e, n), n).map(([e, r]) => $a(e, r, n, t));
}
function no(e, t = R, n = {}) {
	let r = e.feature.getProperties(), i = [`Couche : ${e.layerTitle}`], a = n.layerId ?? e.layerId;
	return V(I(r, t), t).forEach(([e, n]) => {
		let r = Qa(e, n, { layerId: a });
		i.push(`${z(e, t)} : ${r}`);
	}), i.join("\n");
}
function ro(e, t, n = {}) {
	let r = n.attributeCatalog ?? R, i = n.geodesyCatalog ? Ua(n.geodesyCatalog, e, r) : r, a = e.feature.getProperties(), { longitude: o, latitude: s } = Ya(e, t), c = {
		...n,
		attributeCatalog: i,
		layerId: n.layerId ?? e.layerId
	}, l = eo(a, c);
	return {
		title: B(a, i),
		titlePicto: l,
		layerTitle: e.layerTitle,
		longitude: o,
		latitude: s,
		attributes: Za(to(a, c), a, c),
		photos: Ja(a, i),
		comment: no(e, i, { layerId: c.layerId })
	};
}
function io(e, t = {}) {
	let n = t.attributeCatalog ?? R;
	return {
		title: B(e, n),
		titlePicto: eo(e, {
			...t,
			attributeCatalog: n
		})
	};
}
function ao(e, t) {
	return `${t.toFixed(5)}° N, ${e.toFixed(5)}° E`;
}
//#endregion
//#region src/report/geodesyPointReportContext.ts
function oo(e) {
	let t = e.id ?? e.ID;
	if (t != null) return String(t).trim() || void 0;
}
function so(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) n === "geometry" || typeof r == "object" && r || (t[n] = r);
	return t;
}
function co(e, t, n = {}) {
	let r = so(e.feature.getProperties());
	return {
		...ro(e, t, n),
		layerId: e.layerId,
		properties: r,
		geodesyId: oo(r)
	};
}
//#endregion
export { Cr as $, ye as $n, B as $t, va as A, Re as An, mn as At, Ci as B, Ae as Bn, W as Bt, ba as C, Ke as Cn, wn as Ct, Ta as D, We as Dn, gn as Dt, Ea as E, Ue as En, G as Et, zi as F, Oe as Fn, Wt as Ft, Xr as G, xe as Gn, Mt as Gt, oi as H, Ce as Hn, H as Ht, Oi as I, ke as In, Ft as It, Hr as J, fe as Jn, R as Jt, Zr as K, S as Kn, At as Kt, Ei as L, Te as Ln, U as Lt, ta as M, Pe as Mn, en as Mt, Gi as N, ze as Nn, Rt as Nt, Z as O, Fe as On, _n as Ot, Vi as P, C as Pn, Ut as Pt, Er as Q, me as Qn, _t as Qt, wi as R, Ee as Rn, Nt as Rt, Pa as S, E as Sn, On as St, Da as T, Ge as Tn, Zt as Tt, Qr as U, we as Un, vt as Ut, ui as V, je as Vn, It as Vt, ei as W, Se as Wn, kt as Wt, Lr as X, he as Xn, L as Xt, Gr as Y, b as Yn, ht as Yt, Or as Z, ge as Zn, z as Zt, La as _, Qe as _n, Nn as _t, no as a, I as an, Xn as at, Fa as b, A as bn, Dn as bt, $ as c, P as cn, Yn as ct, Ua as d, it as dn, Rn as dt, V as en, x as er, wr as et, Ba as f, j as fn, An as ft, Ia as g, rt as gn, Pn as gt, Ha as h, Xe as hn, Mn as ht, Ya as i, pt as in, fr as it, ua as j, Ne as jn, ln as jt, ya as k, Me as kn, Xt as kt, Ka as l, ft as ln, Vn as lt, za as m, nt as mn, In as mt, ro as n, mt as nn, be as nr, _r as nt, ao as o, M as on, $n as ot, Va as p, at as pn, Fn as pt, Vr as q, _e as qn, jt as qt, io as r, lt as rn, pe as rr, gr as rt, Ja as s, ct as sn, qn as st, co as t, ot as tn, ve as tr, Tr as tt, qa as u, N as un, Hn as ut, Ra as v, $e as vn, Ln as vt, wa as w, T as wn, q as wt, Ma as x, qe as xn, En as xt, Q as y, et as yn, jn as yt, Si as z, De as zn, Pt as zt };
