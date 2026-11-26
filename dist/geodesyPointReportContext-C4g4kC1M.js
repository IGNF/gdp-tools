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
// src/constants/wms.ts
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
// src/style/geodesyWfsPictoStyle.ts
var Me = "https://data.geopf.fr/annexes/geodesie/symbol";
function Ne(e) {
	if (e == null) return;
	let t = String(e).trim();
	return t ? t.toUpperCase() : void 0;
}
function w(e, t) {
	let n = e[t];
	if (n) return n;
	let r = t.toLowerCase();
	for (let [t, n] of Object.entries(e)) if (t.toLowerCase() === r) return n;
}
var T = new a({ image: new t({
	radius: 5,
	fill: new n({ color: "rgba(38, 165, 129, 0.85)" }),
	stroke: new i({
		color: "#ffffff",
		width: 1.5
	})
}) });
function Pe(e) {
	return Ne(e);
}
function Fe(e, t) {
	return w(e, t);
}
function Ie(t, n = {}) {
	let i = n.fallbackStyle ?? T, o = n.pictoProperty ?? "picto", s = n.iconScale ?? 1, c = /* @__PURE__ */ new Map();
	return (n) => {
		if (!(n instanceof e)) return i;
		let l = Pe(n.get(o));
		if (!l) return i;
		let u = Fe(t, l);
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
function Le(e, t) {
	return t === void 0 ? e && Object.keys(e).length > 0 ? Ie(e) : T : t;
}
function Re(e) {
	return typeof e == "function" ? e : () => e;
}
function ze(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.wfsLayerIds) {
		let r = e.wfsPictoUrlMaps[n];
		t.set(n, Re(Le(r)));
	}
	return (e, n) => {
		let r = e.get(b), i = r ? t.get(r) : void 0;
		return i ? i(e, n) : T;
	};
}
function Be(e) {
	let t = ze(e);
	return (e, n) => {
		if (e.get("selectclusterlink")) return [];
		let r = e.get("features")?.[0] ?? e;
		return t(r, n);
	};
}
// src/constants/geodesyPictoUrls.ts
var E = (e) => `${Me}/${e}`;
function Ve(e) {
	let t = {};
	for (let n of Object.values(e)) n && Object.assign(t, n);
	return t;
}
function He(e, t = {}) {
	let n = Ne(e);
	if (!n) return;
	let r = t.pictoUrlMaps ?? D;
	if (t.layerId) {
		let e = r[t.layerId];
		if (e) {
			let t = w(e, n);
			if (t) return t;
		}
	}
	return w(Ve(r), n);
}
var Ue = {
	PT_RN_GOOD: E("rn_bon_15.gif"),
	PT_RN_BAD: E("rn_bad_15.gif"),
	PT_RN_DEL: E("rn_del_15.gif"),
	PT_RN_TRIPLET_GOOD: E("rn_triplet_15.gif"),
	PT_RN_TRIPLET_BAD: E("rn_triplet_15.gif"),
	PT_RN_TRIPLET_DEL: E("rn_triplet_15.gif"),
	PT_RDF_GOOD: E("rdf_bon_15.gif"),
	PT_RDF_BAD: E("rdf_bad_15.gif"),
	PT_RDF_DEL: E("rdf_del_15.gif"),
	PT_RBF_GOOD: E("rbf_bon_15.gif"),
	PT_RBF_BAD: E("rbf_bad_15.gif"),
	PT_RBF_DEL: E("rbf_del_15.gif"),
	PT_RN_CANEX_GOOD: E("rn_canex_bon_15.gif"),
	PT_RN_CANEX_BAD: E("rn_canex_bad_15.gif"),
	PT_RN_CANEX_DEL: E("rn_canex_del_15.gif"),
	PT_RDF_CANEX_GOOD: E("rdf_canex_bon_15.gif"),
	PT_RDF_CANEX_BAD: E("rdf_canex_bad_15.gif"),
	PT_RDF_CANEX_DEL: E("rdf_canex_del_15.gif"),
	PT_RN_CANEX_TRIPLET_GOOD: E("rn_canex_bon_15.gif"),
	PT_RN_CANEX_TRIPLET_BAD: E("rn_canex_bad_15.gif"),
	PT_RN_CANEX_TRIPLET_DEL: E("rn_canex_del_15.gif")
}, D = {
	DATA_GEOD: Ue,
	GDP: Ue
}, O = {
	enabled: !0,
	distance: 40,
	minDistance: 0,
	animationDuration: 700,
	animateExplosion: !0,
	explosionAnimationDuration: 500,
	pointRadius: 12,
	maxResolution: 80
};
function We(e) {
	let t = e?.animationDuration ?? O.animationDuration, n = e?.explosionAnimationDuration ?? O.explosionAnimationDuration;
	return {
		enabled: e?.enabled ?? O.enabled,
		distance: e?.distance ?? O.distance,
		minDistance: e?.minDistance ?? O.minDistance,
		animationDuration: t,
		animateExplosion: e?.animateExplosion ?? O.animateExplosion,
		explosionAnimationDuration: n,
		pointRadius: e?.pointRadius ?? O.pointRadius,
		maxResolution: e?.maxResolution ?? O.maxResolution
	};
}
// src/cache/lruMemoryCache.ts
var Ge = class {
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
// src/cache/geodesyImageCache.ts
function Ke(e) {
	return e.trim();
}
function qe(e) {
	URL.revokeObjectURL(e.objectUrl);
}
var k = new Ge(64, (e) => {
	qe(e);
}), A = /* @__PURE__ */ new Map();
function j(e) {
	let t = Ke(e);
	return k.get(t)?.objectUrl ?? t;
}
function Je(e) {
	return F(e).filter(([e, t]) => P(e, t)).map(([, e]) => Ke(e));
}
function Ye(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of Je(n.feature.getProperties())) t.add(e);
	return Array.from(t);
}
async function Xe(e) {
	let t = Ke(e), n = k.get(t);
	if (n) return n.objectUrl;
	let r = await fetch(t);
	if (!r.ok) return t;
	let i = await r.blob(), a = URL.createObjectURL(i);
	return k.set(t, {
		objectUrl: a,
		sizeBytes: i.size
	}), a;
}
async function Ze(e) {
	let t = Ke(e), n = k.get(t);
	if (n) return n.objectUrl;
	let r = A.get(t);
	if (r) return r;
	let i = Xe(t).finally(() => {
		A.delete(t);
	});
	return A.set(t, i), i;
}
async function M(e) {
	await Promise.all(e.map((e) => Ze(e)));
}
async function Qe(e) {
	await M(Ye(e));
}
async function $e(e) {
	let t = new DOMParser().parseFromString(e, "text/html"), n = t.querySelectorAll("img[src]");
	return n.length === 0 ? e : (await M(Array.from(n).map((e) => e.getAttribute("src")).filter((e) => !!e?.trim())), n.forEach((e) => {
		let t = e.getAttribute("src");
		t && e.setAttribute("src", j(t));
	}), t.querySelector("table.featureInfo")?.outerHTML ?? t.body.innerHTML);
}
function et() {
	k.forEach((e) => {
		qe(e);
	}), k.clear(), A.clear();
}
function tt() {
	let e = 0;
	return k.forEach((t) => {
		e += t.sizeBytes;
	}), {
		entryCount: k.entryCount,
		sizeBytes: e
	};
}
// src/constants/geodesyAttributeLabels.ts
var nt = {
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
}, rt = Object.keys(nt);
function it(e) {
	return nt[e.toLowerCase()] || e.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
}
// src/interaction/geodesyFeatureAttributes.ts
var at = [
	"geometry",
	"boundedBy",
	"coordinate"
], ot = new Set(at.map((e) => e.toLowerCase()));
function st(e) {
	return e.startsWith("_") || ot.has(e.toLowerCase());
}
function ct(e) {
	return it(e);
}
function lt(e) {
	let t = e.toLowerCase();
	return t.includes("url") || t === "lien" || t === "link";
}
function ut(e) {
	return /^https?:\/\//i.test(e.trim());
}
function N(e) {
	return e == null || typeof e == "object" || String(e).trim() === "";
}
function dt(e, t) {
	if (N(t)) return !1;
	let n = String(t).trim();
	return lt(e) || ut(n);
}
function ft(e) {
	return e.toLowerCase() === "picto";
}
function P(e, t) {
	if (!dt(e, t)) return !1;
	let n = e.toLowerCase();
	return n === "url_pdf" ? !1 : /^img\d*_url$/.test(n) || /^groupe_img\d*_url$/.test(n) || /^groupe_croquis\d*_url$/.test(n);
}
function pt(e) {
	return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function mt(e) {
	let t = pt(String(e).trim());
	return `<a href="${t}" target="_blank" rel="noopener noreferrer">${t}</a>`;
}
function ht(e, t = "Image") {
	let n = String(e).trim(), r = j(n), i = pt(n), a = pt(r), o = pt(t);
	return `<div class="geodesy-attribute-image">
  <a class="geodesy-attribute-image__link" href="${i}" target="_blank" rel="noopener noreferrer" title="Ouvrir ${o}">
    <img class="geodesy-attribute-image__thumb" src="${a}" alt="${o}" loading="lazy" />
    <span class="geodesy-attribute-image__caption">Ouvrir</span>
  </a>
</div>`;
}
function F(e, t = I) {
	return Object.keys(e).flatMap((n) => {
		if (yt(n, t)) return [];
		let r = e[n];
		return N(r) ? [] : [[n, String(r).trim()]];
	});
}
// src/catalog/geodesyAttributeCatalog.ts
var gt = [
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
function _t(e) {
	let t = /* @__PURE__ */ new Set();
	return e.filter((e) => {
		let n = e.toLowerCase();
		return !t.has(n) && (t.add(n), !0);
	});
}
function vt(e = {}) {
	return {
		attributeKeys: _t(e.attributeKeys ?? rt),
		excludedKeys: _t([...at, ...e.excludedKeys ?? []]),
		titleKeys: _t(e.titleKeys ?? gt),
		labels: {
			...nt,
			...e.labels ?? {}
		}
	};
}
var I = vt();
function L(e, t = I) {
	let n = e.toLowerCase();
	return t.labels[n] || it(e);
}
function yt(e, t = I) {
	if (st(e)) return !0;
	let n = e.toLowerCase();
	return t.excludedKeys.some((e) => e.toLowerCase() === n);
}
function R(e, t = I, n = "Point géodésique") {
	for (let n of t.titleKeys) {
		let t = e[n];
		if (t != null && String(t).trim() !== "") return String(t);
	}
	return n;
}
function z(e, t = I) {
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
// src/catalog/geodesyCatalog.ts
var bt = "geodesyCatalog";
function xt(e) {
	return Array.from(new Set(e));
}
function St(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function Ct(e) {
	if (e.layers?.length) return e.layers;
	let t = x;
	return e.layerIds?.length ? St(t, xt(e.layerIds)) : t;
}
function wt(e) {
	return Array.from(new Set(e));
}
function Tt(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function Et(e, t) {
	if (e && t.includes(e)) return e;
	if (t.includes("DATA_GEOD")) return "DATA_GEOD";
	if (t.includes("GDP")) return "GDP";
	let n = t[0];
	if (!n) throw Error("[gdp-tools] wfsDomainLayers require at least one active WFS layer in the catalog.");
	return n;
}
function Dt(e) {
	return Array.from(new Set(e));
}
function Ot(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.flatMap((e) => {
		let t = n.get(e);
		return t ? [t] : [];
	});
}
function kt(e) {
	return e.annexLayers?.length ? e.annexLayers : e.annexLayerIds?.length ? Ot(Ce, Dt(e.annexLayerIds)) : [];
}
function At(e) {
	let t = [];
	if (e.wfsLayers?.length) t = [...e.wfsLayers];
	else if (e.wfsLayerIds?.length) t = Tt(Oe, wt(e.wfsLayerIds));
	else return [];
	return t.filter((t) => Ae(t, e.wfsApiKey));
}
function jt(e = {}) {
	let t = Ct(e), n = t.map((e) => e.id), r = e.dataLayerId ?? "TOUT";
	if (!n.includes(r)) throw Error(`[gdp-tools] dataLayerId "${r}" must be included in the catalog layers.`);
	let i = n.filter((e) => e !== r), a = xt(e.networkLayerIds ?? i).filter((e) => n.includes(e)), o = n.filter((e) => e !== r), s = xt(e.uiLayerIds ?? o).filter((e) => n.includes(e)), c = St(t, s), l = e.attributes ?? vt({
		attributeKeys: e.attributeKeys,
		excludedKeys: e.excludedKeys,
		titleKeys: e.titleKeys,
		labels: e.labels
	}), u = At(e), d = u.map((e) => e.id), f = wt(e.wfsUiLayerIds ?? d).filter((e) => d.includes(e)), ee = Tt(u, f), p = e.wfsDomainLayers ?? [], m = p.map((e) => e.id), te = e.wfsAttributeFilters ?? [], h = p.length > 0 ? Et(e.wfsDomainSourceLayerId, d) : void 0, g = p.length > 0 ? [...m] : [...f], _ = kt(e), v = _.map((e) => e.id), y = Dt(e.annexUiLayerIds ?? v).filter((e) => v.includes(e)), ne = Ot(_, y);
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
			...D,
			...e.wfsPictoUrlMaps ?? {}
		},
		wfsCluster: We(e.wfsCluster),
		annexLayers: _,
		annexLayerIds: v,
		annexUiLayers: ne,
		annexUiLayerIds: y
	};
}
var B = jt();
function Mt(e, t) {
	return e.layers.find((e) => e.id === t);
}
function Nt(e, t) {
	let n = e.layerIds.indexOf(t);
	return n >= 0 ? n : e.layerIds.length;
}
function Pt(e) {
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
// src/constants/wfsDomainLayers.ts
var Ft = "domaine", It = "geodesyWfsDomainSourceLayerId", V = "geodesyWfsDataLayer", Lt = [{
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
function Rt(e) {
	if (e != null) return String(e).trim().toLowerCase() || void 0;
}
function zt(e) {
	return Rt(e.get("domaine") ?? e.get("DOMAINE"));
}
function H(e, t) {
	if (!t.length) return !0;
	let n = new Set(t.map((e) => e.toLowerCase())), r = e.get("features");
	if (r?.length) return r.some((e) => {
		let t = zt(e);
		return t !== void 0 && n.has(t);
	});
	let i = zt(e);
	return i !== void 0 && n.has(i);
}
// src/constants/geodesyNetworkFilterCategories.ts
var Bt = [
	"RBF",
	"RDF",
	"TRIPLET",
	"NON_TRIPLET"
], Vt = ["PT_RN_TRIPLET", "PT_RN_CANEX_TRIPLET"];
function Ht(e, t) {
	if (t in e) return e[t];
	let n = t.toLowerCase(), r = Object.keys(e).find((e) => e.toLowerCase() === n);
	return r ? e[r] : void 0;
}
function Ut(e) {
	return Ne(Ht(e, "picto") ?? Ht(e, "PICTO"));
}
function Wt(e) {
	return Vt.some((t) => e.startsWith(t));
}
function Gt(e) {
	let t = Ut(e);
	return t !== void 0 && Wt(t);
}
function Kt(e) {
	let t = Ut(e);
	if (!t) return [];
	let n = [];
	return t.startsWith("PT_RBF") && n.push("RBF"), t.startsWith("PT_RDF") && n.push("RDF"), Wt(t) ? n.push("TRIPLET") : t.startsWith("PT_RN") && n.push("NON_TRIPLET"), n;
}
// src/wfs/geodesyWfsFeatureId.ts
var qt = [
	"id",
	"ID",
	"no",
	"NO"
];
function Jt(e) {
	for (let t of qt) {
		let n = e[t];
		if (n == null) continue;
		let r = String(n).trim();
		if (r) return r;
	}
}
function Yt(e, t) {
	return `${e}:${t}`;
}
function Xt(e, t) {
	let n = e.getGeometry();
	if (!(n instanceof o)) return;
	let [r, i] = n.getCoordinates();
	return Yt(t, `${r.toFixed(3)}:${i.toFixed(3)}`);
}
function Zt(e, t) {
	let n = `${t}:`, r = e.getId();
	if (r !== void 0 && String(r).startsWith(n)) return;
	let i = Jt(e.getProperties()) ?? (r === void 0 ? void 0 : String(r).trim()) ?? Xt(e, t);
	i && e.setId(i.startsWith(n) ? i : Yt(t, i));
}
// src/constants/wfsAttributeFilters.ts
var U = "geodesyWfsAttributeFilterValues";
function Qt(e = {}) {
	return { values: { ...e } };
}
var $t = [
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
function en(e, t) {
	return e.get(t) ?? e.get(t.toUpperCase());
}
function tn(e, t) {
	return e[t] ?? e[t.toUpperCase()];
}
function nn(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) r.wfsLayerId && (t && r.wfsLayerId === t || n.add(r.wfsLayerId));
	return [...n];
}
function W(e, t, n = {}) {
	let { domainSourceLayerId: r, auxiliaryPropertiesByLayerId: i } = n;
	if (t.wfsLayerId && r && t.wfsLayerId !== r) {
		let n = Jt(e.getProperties());
		if (!n) return;
		let r = i?.get(t.wfsLayerId)?.get(n);
		return r ? tn(r, t.property) : void 0;
	}
	return en(e, t.property);
}
function rn(e) {
	return e == null ? "" : String(e).trim();
}
function an(e) {
	let t = rn(e);
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
function on(e, t, n, r) {
	let i = !N(W(e, t, r));
	return n ? i : !i;
}
function sn(e, t, n, r) {
	let i = an(W(e, t, r)), a = an(n);
	return i === null || a === null ? !1 : t.operator === "before" ? i < a : i > a;
}
function cn(e, t, n, r) {
	let i = rn(W(e, t, r)).toLowerCase(), a = n.trim().toLowerCase();
	if (!a) return !0;
	switch (t.operator ?? "equals") {
		case "contains": return i.includes(a);
		case "notEquals": return i !== a;
		default: return i === a;
	}
}
function ln(e, t, n, r) {
	let i = rn(W(e, t, r)).toLowerCase(), a = t.options.find((e) => e.value === n);
	return a ? a.matchOthers ? !t.options.filter((e) => !e.matchOthers).map((e) => e.value.toLowerCase()).includes(i) : i === a.value.toLowerCase() : !0;
}
function G(e) {
	return new Set(e.split(",").map((e) => e.trim()).filter(Boolean));
}
function un(e, t) {
	return t == null ? new Set(e.options.map((e) => e.value)) : typeof t == "string" && t.trim() === "" ? /* @__PURE__ */ new Set() : typeof t == "string" ? G(t) : new Set(e.options.map((e) => e.value));
}
function dn(e, t, n, r) {
	let i = G(n);
	return i.size === 0 ? !1 : i.size >= t.options.length || Kt(e.getProperties()).some((e) => i.has(e));
}
function K(e, t) {
	return t == null ? !1 : e.type === "multiChoice" ? typeof t == "string" && G(t).size < e.options.length : typeof t == "boolean" || t.trim() !== "";
}
function fn(e, t, n, r) {
	switch (t.type) {
		case "boolean": return on(e, t, n, r);
		case "date": return sn(e, t, String(n), r);
		case "text": return cn(e, t, String(n), r);
		case "choice": return ln(e, t, String(n), r);
		case "multiChoice": return dn(e, t, String(n), r);
		default: return !0;
	}
}
function pn(e, t, n, r) {
	for (let i of t) {
		let t = n[i.id];
		if (K(i, t) && !fn(e, i, t, r)) return !1;
	}
	return !0;
}
function mn(e, t, n, r = {}) {
	if (!t.length || !t.some((e) => K(e, n[e.id]))) return !0;
	let i = e.get("features");
	return i?.length ? i.some((e) => pn(e, t, n, r)) : pn(e, t, n, r);
}
function hn(e, t) {
	return !K(e, t) || typeof t != "string" ? 0 : G(t).size;
}
function gn(e, t) {
	return e.reduce((e, n) => {
		let r = t[n.id];
		return n.type === "multiChoice" ? e + hn(n, r) : e + +!!K(n, r);
	}, 0);
}
function _n(e = []) {
	return Object.fromEntries(e.map((e) => [e.id, null]));
}
// src/catalog/getGeodesyCatalogFromMap.ts
function q(e) {
	let t = e.getLayers().getArray().find((e) => e instanceof s && e.get("name") === "geodesyGroup");
	return t instanceof s ? t.get("geodesyCatalog") ?? B : B;
}
// src/interaction/geodesySelectCluster.ts
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
			s >= 1 ? (i.listenerKey_ && u(i.listenerKey_), i.overlayLayer_.getSource()?.addFeatures(r), i.overlayLayer_.changed()) : t.frameState.animate = !0;
		});
		let g = new e(new o(m.getView().getCenter() ?? n));
		g.setStyle(new a({ image: new t({ radius: .1 }) })), i.overlayLayer_.getSource()?.addFeature(g);
	}
};
// src/wfs/geodesyWfsLayerUtils.ts
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
// src/interaction/geodesyWfsClusterSelect.ts
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
		featureStyle: Be(t),
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
// src/partner/partnerLogo.ts
var kn = "https://data.geopf.fr/annexes/geodesie/gdp/logos";
function An(e) {
	return !e || e.trim() === "" ? null : `${kn}/logo_${e.trim()}.jpg`;
}
function jn(e) {
	return j(e);
}
async function Mn(e) {
	return Ze(e);
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
// src/interaction/geodesyPopupTemplate.ts
function Rn(e, t = I, n = {}) {
	let r = e.getProperties(), i = R(r, t), a = n.pictoUrlMaps ?? D, o = {};
	return z(F(r, t), t).forEach(([e, n]) => {
		let r = L(e, t);
		o[e] = {
			title: r,
			visible: (t) => !N(t.get(e)),
			...ft(e) ? { format: (e, t) => {
				let n = t.get(b), i = He(e, {
					pictoUrlMaps: a,
					layerId: n
				});
				return i ? ht(i, r) : String(e);
			} } : P(e, n) ? { format: (e) => ht(e, r) } : dt(e, n) ? { format: (e) => mt(e) } : {}
		};
	}), {
		title: i,
		attributes: o
	};
}
// src/cache/geodesyFeatureInfoCache.ts
var Y = new Ge(128);
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
// src/utils/fetchWithTimeout.ts
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
// src/wms/mergeGeodesyFeatureHits.ts
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
function Yn(e, t = "Point géodésique", n = B) {
	let r = String(Jn(e, "groupe_type") ?? "").trim();
	if (!r) return t;
	let i = r.toLowerCase();
	return n.layers.find((e) => e.id !== n.dataLayerId && [
		e.id,
		e.shortLabel,
		e.title
	].map((e) => e.toLowerCase()).some((t) => i.includes(t) || t.includes(i) || i === e.id.toLowerCase()))?.title ?? r;
}
function Xn(e, t, n = B) {
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
function $n(e, t = B) {
	if (e.length === 0) return e;
	let n = new Set(t.networkLayerIds), r = e.filter((e) => e.layerId === t.dataLayerId).map((e) => Zn(e, t));
	if (r.length > 0) return r;
	if (e.length <= 1) return e.map((e) => Zn(e, t));
	let i = e.filter((e) => e.layerId !== void 0 && n.has(e.layerId))[0], a = e.find((e) => e.layerId === t.dataLayerId);
	return i && a ? [Qn(i, a, t)] : e.map((e) => Zn(e, t));
}
// src/wms/queryGeodesyAtCoordinate.ts
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
		let t = q(e), n = ir(e);
		if (n.length === 0) {
			let r = Ma(e);
			n = t.layers.filter((e) => e.id !== t.dataLayerId && r[e.id]).map((e) => e.id);
		}
		n.length > 0 && (l = l.filter((e) => Xn(e.feature.getProperties(), n, t)));
	}
	return l;
}
// src/annex/geodesyAnnexLayerUtils.ts
function pr(e, t) {
	if (!(e instanceof p) || !e.getVisible() || e.get("geodesyLayerKind") !== "annex") return !1;
	let n = e.get(b);
	return n !== void 0 && t.has(n);
}
function mr(e) {
	return e;
}
// src/annex/queryGeodesyAnnexAtPixel.ts
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
// src/wfs/resolveGeodesyWfsHitFeature.ts
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
// src/wfs/queryGeodesyWfsAtPixel.ts
function vr(e, t) {
	return e.wfsDomainLayers.find((e) => e.id === t) && e.wfsDomainSourceLayerId ? e.wfsDomainSourceLayerId : t;
}
function yr(e, t, n) {
	let r = t.get(b);
	if (r && n.has(r)) return r;
	let i = e.wfsDomainSourceLayerId;
	if (!i || e.wfsDomainLayers.length === 0 || r !== void 0 && r !== i) return null;
	for (let r of e.wfsDomainLayers) if (n.has(r.id) && H(t, r.domaines)) return r.id;
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
// src/interaction/queryGeodesyAtClick.ts
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
// src/interaction/geodesyPopup.ts
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
			await Promise.all([Qe(o), Ln(o)]);
			let s = o[0].feature.get("_htmlSnippet");
			if (s) {
				let e = await $e(s);
				r.show(a.coordinate, `<div class="geodesy-popup-html">${e}</div>`);
			} else n.show(a.coordinate, o.map((e) => e.feature));
		})();
	});
	return () => {
		i += 1, u(a), e.removeOverlay(n), e.removeOverlay(r);
	};
}
// src/wfs/geodesyWfsAttributeFilterIndex.ts
function kr(e) {
	let t = /* @__PURE__ */ new Map();
	return e.getFeatures().forEach((e) => {
		let n = Jt(e.getProperties());
		n && t.set(n, e.getProperties());
	}), t;
}
function Ar(e) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach(({ layerId: e, source: n }) => {
		t.set(e, kr(n));
	}), t;
}
// src/annex/parseGeodesyGdpRgp2.ts
function jr(e) {
	let t = (e.match(/,/g) ?? []).length;
	return (e.match(/;/g) ?? []).length > t ? ";" : ",";
}
function Mr(e, t) {
	let n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a += 1) {
		let o = e[a];
		o === "\"" ? i && e[a + 1] === "\"" ? (r += "\"", a += 1) : i = !i : o === t && !i ? (n.push(r.trim()), r = "") : r += o;
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
// src/annex/loadGeodesyAnnexFeatures.ts
var Rr = /* @__PURE__ */ new Map(), zr = /* @__PURE__ */ new Map();
function Br(e, t) {
	return `${e.url}|${e.format}|${t}`;
}
function Vr(e, t) {
	return Br(e, t?.wfsDataProjection ?? "EPSG:4326");
}
function Hr(e, t) {
	if (!e) {
		Rr.clear(), zr.clear();
		return;
	}
	let n = Vr(e, t);
	Rr.delete(n), zr.delete(n);
}
function Ur(e) {
	let t = Vr(e.definition, e.catalog), n = zr.get(t);
	return n === void 0 ? null : new Date(n);
}
function Wr(e, t, n) {
	switch (e.format) {
		case "gdp-rgp2": return Lr(t, { dataProjection: n });
		default: return [];
	}
}
async function Gr(e) {
	let t = await Wn(e, { credentials: "omit" });
	if (!t.ok) throw Error(`[gdp-tools] Annex fetch failed (${t.status}) for ${e}`);
	return t.text();
}
async function Kr(e) {
	let { definition: t, catalog: n } = e, r = Vr(t, n), i = Rr.get(r);
	return i || (i = Gr(t.url).then((e) => Wr(t, e, n?.wfsDataProjection ?? "EPSG:4326")).then((e) => (zr.set(r, Date.now()), e)), Rr.set(r, i)), i;
}
// src/annex/geodesyGdpRgp2Dispo.ts
var qr = "Non disponible", Jr = "Disponible", X = {
	full: "#26a581",
	partial: "#f18345",
	none: "#f72525",
	down: "#6c6661"
}, Yr = {
	full: "Station opérationnelle",
	partial: "Station opérationnelle, données en attente",
	none: "Données manquantes",
	down: "Station en panne"
};
function Xr(e) {
	if (e == null) return "";
	let t = String(e).trim().toLowerCase();
	return !t || t === "null" ? "" : t;
}
function Zr(e) {
	return e === "1" ? "available" : e === "0" ? "unavailable" : null;
}
function Qr(e) {
	let t = Xr(e);
	return !t || !/^[01]+$/.test(t) ? ["unavailable"] : t.split("").flatMap((e) => {
		let t = Zr(e);
		return t ? [t] : [];
	});
}
function $r(e) {
	return e === "1" ? Jr : e === "0" ? qr : e;
}
function ei(e) {
	let t = Xr(e);
	return t ? /^[01]+$/.test(t) ? t.split("").map($r).join(", ") : String(e).trim() : qr;
}
function ti(e) {
	let t = Xr(e);
	return t !== "" && /^[01]+$/.test(t);
}
function ni(e) {
	if (!ti(e)) return "down";
	let t = Qr(e), n = t.filter((e) => e === "available").length;
	return n === 0 ? "none" : n === t.length ? "full" : "partial";
}
function ri(e) {
	let t = Xr(e);
	return !t || !/^[01]+$/.test(t) ? !1 : t.split("").every((e) => e === "1");
}
// src/style/geodesyAnnexStyle.ts
function ii(e) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<circle cx="14" cy="14" r="6.5" fill="${e}"/>
</svg>`;
}
function ai(e) {
	let t = `data:image/svg+xml;utf8,${encodeURIComponent(ii(e))}`;
	return new a({ image: new r({
		src: t,
		anchor: [.5, .5]
	}) });
}
var oi = {
	full: ai(X.full),
	partial: ai(X.partial),
	none: ai(X.none),
	down: ai(X.down)
};
function si() {
	return (t) => t instanceof e ? oi[ni(t.get("dispo"))] : oi.down;
}
// src/layers/geodesyAnnexLayer.ts
var ci = 55;
function li(e, t) {
	return t === void 0 ? (e.format, si()) : t;
}
function ui(e, t) {
	let n = new v();
	return Kr({
		definition: e,
		catalog: t
	}).then((e) => {
		n.addFeatures(e);
	}).catch((t) => {
		console.error(`[gdp-tools] Failed to load annex layer "${e.id}".`, t);
	}), n;
}
function di(e, t = {}) {
	let { visible: n = !1, catalog: r = B, style: i } = t, a = r.annexLayerIds.indexOf(e.id);
	return new p({
		properties: {
			title: e.title,
			name: `geodesyAnnex-${e.id}`,
			[b]: e.id,
			[C]: "annex"
		},
		visible: n,
		source: ui(e, r),
		style: li(e, i),
		zIndex: ci + Math.max(a, 0)
	});
}
// src/style/geodesyWfsClusterStyle.ts
var fi = {
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
function pi(e) {
	let t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3]),
		t[4] === void 0 ? 1 : Number(t[4])
	] : null;
}
function mi(e, t, n, r) {
	return `rgba(${Math.round(e)}, ${Math.round(t)}, ${Math.round(n)}, ${r.toFixed(2)})`;
}
function hi(e, t) {
	let n = pi(e);
	return n ? [
		n[0],
		n[1],
		n[2]
	] : t;
}
function gi(e, t) {
	return e > t.largeClusterThreshold ? hi(t.largeClusterColor, [
		192,
		0,
		0
	]) : e > t.mediumClusterThreshold ? hi(t.mediumClusterColor, [
		255,
		128,
		0
	]) : hi(t.smallClusterColor, [
		0,
		128,
		0
	]);
}
function _i(e, t) {
	if (t.fillColor) return t.fillColor;
	let [n, r, i] = gi(e, t);
	return mi(n, r, i, 1);
}
function vi(e, t) {
	return Math.max(t.minRadius, Math.min(e * t.radiusScale, t.maxRadius));
}
var yi = 6, bi = 15;
function xi(e, t) {
	let n = pi(e), r = n ? mi(n[0], n[1], n[2], .5) : e, a = 2 * Math.PI * t / yi;
	return new i({
		color: r,
		width: bi,
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
function Si(e, r) {
	let o = vi(e, r), s = _i(e, r);
	return new a({
		image: new t({
			radius: o,
			fill: new n({ color: s }),
			stroke: xi(s, o)
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
function Ci(e, t = {}) {
	let n = {
		...fi,
		...t
	}, r = /* @__PURE__ */ new Map();
	return (t, i) => {
		let a = t, o = Sn(a);
		if (o > 1) {
			let e = r.get(o);
			return e || (e = Si(o, n), r.set(o, e)), e;
		}
		return e(xn(a)[0] ?? a, i);
	};
}
function wi(e, t) {
	return Ci(typeof e == "function" ? e : () => e, t);
}
// src/style/geodesyWfsDisplayFilterStyle.ts
function Ti(t, n = {}) {
	let r = typeof t == "function" ? t : () => t, i = n.cluster ? wi(r) : r, a = n.domaines ?? [], o = n.attributeFilters ?? [], s = n.attributeFilterValues;
	return (t, r) => {
		if (!(t instanceof e)) return i(t, r);
		if (a.length > 0 && !H(t, a)) return [];
		let c = s?.values ?? {};
		return o.length > 0 && !mn(t, o, c, {
			domainSourceLayerId: n.domainSourceLayerId,
			auxiliaryPropertiesByLayerId: s?.auxiliaryPropertiesByLayerId
		}) ? [] : i(t, r);
	};
}
// src/layers/geodesyAnimatedClusterLayer.ts
var Ei = class extends se {
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
// src/wfs/buildGeodesyWfsGetFeatureUrl.ts
function Di(e, t, n = {}) {
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
function Oi(e) {
	return e.startsWith("2.");
}
function ki(e) {
	let { wfsUrl: t, typeName: n, bbox: r, cqlFilter: i, propertyNames: a, apiKey: o, version: s = "2.0.0", outputFormat: c = "application/json", useCacheBuster: l = !0 } = e, u = new URLSearchParams({
		SERVICE: "WFS",
		VERSION: s,
		REQUEST: "GetFeature",
		OUTPUTFORMAT: c
	});
	return r && u.set("bbox", r), i && u.set("CQL_FILTER", i), a?.length && u.set("PROPERTYNAME", a.join(",")), Oi(s) ? u.set("typeNames", n) : u.set("TYPENAME", n), o && u.set("apikey", o), l && u.set("_t", String(Date.now())), `${t}${t.includes("?") ? "&" : "?"}${u.toString()}`;
}
// src/wfs/parseGeodesyWfsCsv.ts
var Ai = new ce(), ji = /* @__PURE__ */ new Set([
	"the_geom",
	"geom",
	"geometry",
	"wkt",
	"shape",
	"geometrie"
]), Mi = /* @__PURE__ */ new Set([
	"lon",
	"longitude",
	"x",
	"coord_x",
	"cg1_coord1"
]), Ni = /* @__PURE__ */ new Set([
	"lat",
	"latitude",
	"y",
	"coord_y",
	"cg1_coord2"
]);
function Pi(e) {
	let t = (e.match(/,/g) ?? []).length;
	return (e.match(/;/g) ?? []).length > t ? ";" : ",";
}
function Fi(e, t) {
	let n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a += 1) {
		let o = e[a];
		o === "\"" ? i && e[a + 1] === "\"" ? (r += "\"", a += 1) : i = !i : o === t && !i ? (n.push(r.trim()), r = "") : r += o;
	}
	return n.push(r.trim()), n;
}
function Ii(e) {
	return e.trim().toLowerCase();
}
function Li(e, t) {
	return e.findIndex((e) => t.has(Ii(e)));
}
function Ri(e) {
	return e.findIndex((e) => ji.has(Ii(e)));
}
function zi(t, n, r, i) {
	let a = {};
	t.forEach((e, t) => {
		let r = n[t]?.trim();
		r && (a[e] = r);
	});
	let s = Ri(t);
	if (s >= 0) {
		let e = n[s]?.trim();
		if (e) try {
			let t = Ai.readFeature(e, {
				dataProjection: r,
				featureProjection: i
			});
			return t.setProperties(a), t;
		} catch {
			return null;
		}
	}
	let c = Li(t, Mi), l = Li(t, Ni);
	if (c >= 0 && l >= 0) {
		let t = Number.parseFloat(n[c]?.replace(",", ".") ?? ""), s = Number.parseFloat(n[l]?.replace(",", ".") ?? "");
		if (Number.isFinite(t) && Number.isFinite(s)) {
			let n = ne([t, s], r, i), c = new e(a);
			return c.setGeometry(new o(n)), c;
		}
	}
	return null;
}
function Bi(e, t = {}) {
	let { dataProjection: n = "EPSG:4326", featureProjection: r = "EPSG:3857" } = t, i = e.split(/\r?\n/).map((e) => e.trim()).filter((e) => e.length > 0);
	if (i.length < 2) return [];
	let a = Pi(i[0]), o = Fi(i[0], a);
	return i.slice(1).flatMap((e) => {
		let t = Fi(e, a), i = zi(o, t, n, r);
		return i ? [i] : [];
	});
}
// src/wfs/parseGeodesyWfsGeoJson.ts
var Vi = new g();
function Hi(e, t = {}) {
	let { dataProjection: n = "EPSG:4326", featureProjection: r = "EPSG:3857" } = t;
	try {
		let t = JSON.parse(e);
		return t.features?.length ? Vi.readFeatures(t, {
			dataProjection: n,
			featureProjection: r
		}) : [];
	} catch {
		return [];
	}
}
// src/wfs/loadGeodesyWfsFeatures.ts
var Ui = 15e3;
function Wi(e) {
	let t = e.trim().toLowerCase();
	return t.includes("serviceexception") || t.includes("exceptionreport") || t.startsWith("<?xml");
}
function Gi(e, t, n, r) {
	return t.responseFormat === "geojson" ? Hi(e, {
		dataProjection: n.wfsDataProjection,
		featureProjection: r.getCode()
	}) : Bi(e, {
		dataProjection: n.wfsDataProjection,
		featureProjection: r.getCode()
	});
}
async function Ki(e) {
	let { catalog: t, definition: n, extent: r, projection: i, timeoutMs: a = Ui } = e;
	if (!Ae(n, t.wfsApiKey)) return [];
	let o = Di(r, i, {
		bboxOrder: n.bboxOrder,
		paddingRatio: t.wfsBboxPaddingRatio,
		bboxCrs: n.bboxCrs
	}), s = ki({
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
	return !l.trim() || Wi(l) ? [] : Gi(l, n, t, i).map((e) => (e.set(b, n.id), Zt(e, n.id), e));
}
// src/wfs/geodesyWfsClusterGeometry.ts
function qi(e) {
	let { catalog: t, domaines: n, attributeFilterValues: r, domainSourceLayerId: i } = e, a = t.wfsAttributeFilters, s = {
		domainSourceLayerId: i,
		auxiliaryPropertiesByLayerId: r?.auxiliaryPropertiesByLayerId
	};
	return (e) => {
		let t = e.getGeometry();
		if (!(t instanceof o) || n?.length && !H(e, n)) return null;
		let i = r?.values ?? {};
		return a.length > 0 && !mn(e, a, i, s) ? null : t;
	};
}
// src/layers/geodesyWfsLayer.ts
var Ji = 50;
function Yi(e) {
	return e.wfsCluster.maxResolution;
}
function Xi(e, t) {
	return new v({
		strategy: ae,
		loader: async (n, r, i) => Ki({
			catalog: t,
			definition: e,
			extent: n,
			projection: i
		})
	});
}
function Zi(e, t, n) {
	return new oe({
		distance: t.wfsCluster.distance,
		minDistance: t.wfsCluster.minDistance,
		source: e,
		...n ? { geometryFunction: qi(n) } : {}
	});
}
function Qi(e, t, n) {
	let r = Xi(e, t);
	return t.wfsCluster.enabled ? Zi(r, t, n) : r;
}
function $i(e) {
	let { catalog: t, visible: n, source: r, style: i, zIndex: a, properties: o } = e, s = {
		properties: o,
		visible: n,
		source: r,
		style: i,
		zIndex: a,
		maxResolution: Yi(t),
		...t.wfsCluster.enabled ? {
			updateWhileAnimating: !0,
			updateWhileInteracting: !0
		} : {}
	};
	return t.wfsCluster.enabled ? new Ei({
		...s,
		animationDuration: t.wfsCluster.animationDuration
	}) : new p(s);
}
function ea(e, t = {}) {
	let n = t.catalog ?? B, r = n.wfsLayerIds.indexOf(e.id);
	return new p({
		properties: {
			title: e.title,
			name: `geodesyWfs-${e.id}`,
			[b]: e.id,
			[C]: "wfs"
		},
		visible: t.visible ?? !1,
		source: Xi(e, n),
		style: () => [],
		maxResolution: Yi(n),
		zIndex: Ji + Math.max(r, 0)
	});
}
function ta(e, t) {
	let { catalog: n, visible: r, layerStyle: i, layerIndex: a, clusterGeometryFilter: o } = t;
	return $i({
		catalog: n,
		visible: r,
		source: Qi(e, n, o),
		style: i,
		zIndex: Ji + Math.max(a, 0),
		properties: {
			title: e.title,
			name: `geodesyWfs-${e.id}`,
			[b]: e.id,
			[C]: "wfs"
		}
	});
}
function na(e, t = {}) {
	let { visible: n = !1, catalog: r = B, style: i, clusterGeometryFilter: a } = t, o = r.wfsPictoUrlMaps[e.id], s = Le(o, i);
	return ta(e, {
		catalog: r,
		visible: n,
		layerStyle: r.wfsCluster.enabled ? wi(s) : s,
		layerIndex: r.wfsLayerIds.indexOf(e.id),
		clusterGeometryFilter: a
	});
}
// src/layers/geodesyWfsDomainLayer.ts
var ra = 1;
function ia(e, t) {
	let { catalog: n, sourceLayerId: r, source: i, pointStyle: a, baseZIndex: o, attributeFilterValues: s, visible: c = !1 } = t;
	return $i({
		catalog: n,
		visible: c,
		source: i,
		zIndex: o + ra,
		properties: {
			title: e.title,
			name: `geodesyWfsDomain-${e.id}`,
			[b]: e.id,
			[C]: "wfs",
			[It]: r
		},
		style: Ti(a, {
			domaines: e.domaines,
			attributeFilters: n.wfsAttributeFilters,
			attributeFilterValues: s,
			domainSourceLayerId: r,
			cluster: n.wfsCluster.enabled
		})
	});
}
// src/wms/geodesyWmsTileLoadPending.ts
var Z = 0, aa = /* @__PURE__ */ new Set();
function oa() {
	return {
		pendingCount: Z,
		isLoading: Z > 0
	};
}
function sa() {
	let e = oa();
	aa.forEach((t) => t(e));
}
function ca() {
	Z += 1, sa();
}
function la() {
	Z = Math.max(0, Z - 1), sa();
}
function ua() {
	return oa();
}
function da(e) {
	return aa.add(e), e(oa()), () => {
		aa.delete(e);
	};
}
function fa(e) {
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
var pa = fa(2);
function ma(e) {
	return e.startsWith("image/");
}
function ha(e = {}) {
	let t = e.timeoutMs ?? 6e3, n = e.maxConcurrent ? fa(e.maxConcurrent) : pa;
	return (e, r) => {
		n.acquire().then(async () => {
			ca();
			let i = !1, a = () => {
				i || (i = !0, la(), n.release());
			}, o = new AbortController(), s = window.setTimeout(() => o.abort(), t);
			try {
				let t = await fetch(r, {
					signal: o.signal,
					mode: "cors",
					credentials: "omit"
				});
				if (!t.ok || !ma(t.headers.get("content-type") ?? "")) {
					e.setState(ue.ERROR), a();
					return;
				}
				let n = await t.blob(), i = URL.createObjectURL(n), s = e.getImage();
				s.onload = () => {
					URL.revokeObjectURL(i), a();
				}, s.onerror = () => {
					URL.revokeObjectURL(i), e.setState(ue.ERROR), a();
				}, s.src = i;
			} catch {
				e.setState(ue.ERROR), a();
			} finally {
				window.clearTimeout(s);
			}
		});
	};
}
var ga = ha(), _a = 20;
function va(e, t = {}) {
	let { visible: n = !1, zIndexOffset: r = 0, catalog: i = B } = t, a = Nt(i, e.id);
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
			tileLoadFunction: ga
		}),
		zIndex: _a + a + r
	});
}
// src/layers/geodesyLayerGroup.ts
var ya = 50;
function ba(e) {
	return e.getSource() || null;
}
function xa(e, t, n) {
	e.auxiliaryPropertiesByLayerId = Ar(t.flatMap(({ layerId: e, layer: t }) => {
		let n = ba(t);
		return n ? [{
			layerId: e,
			source: n
		}] : [];
	})), n.forEach((e) => e.changed());
}
function Sa(e, t) {
	e.on("addfeature", t), e.on("removefeature", t), e.on("clear", t);
}
function Ca(e, t, n, r) {
	let i = nn(e.wfsAttributeFilters, t);
	if (!i.length) return [];
	let a = i.flatMap((t) => {
		let n = e.wfsLayers.find((e) => e.id === t);
		if (!n) return [];
		let r = ea(n, {
			catalog: e,
			visible: !1
		});
		r.set(V, !0);
		let i = ba(r);
		return i ? [{
			layerId: t,
			layer: r,
			source: i
		}] : [];
	}), o = () => {
		xa(n, a, r);
	};
	return a.forEach(({ source: e }) => Sa(e, o)), o(), a.map(({ layer: e }) => e);
}
function wa(e, t) {
	return e.wfsDomainLayerIds.some((e) => t[e]);
}
function Ta(e, t, n) {
	let r = e.wfsDomainSourceLayerId;
	if (!r) return [];
	let i = e.wfsLayers.find((e) => e.id === r);
	if (!i) throw Error(`[gdp-tools] wfsDomainSourceLayerId "${r}" is missing from the catalog.`);
	let a = ea(i, {
		catalog: e,
		visible: t[r] ?? wa(e, t)
	});
	a.set(V, !0);
	let o = a.getSource();
	if (!o) throw Error(`[gdp-tools] WFS source layer "${r}" has no vector source.`);
	let s = e.wfsPictoUrlMaps[r], c = Le(s), l = ya + Math.max(e.wfsLayerIds.indexOf(r), 0), u = e.wfsDomainLayers.map((i) => {
		let a = e.wfsCluster.enabled ? Zi(o, e, {
			catalog: e,
			domaines: i.domaines,
			attributeFilterValues: n,
			domainSourceLayerId: r
		}) : o;
		return ia(i, {
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
		...Ca(e, r, n, u),
		...u
	];
}
function Ea(e = {}) {
	let t = e.catalog ?? B, { visibility: n = { RBF: !0 }, attributeFilterValues: r } = e, i = Qt(r), a = t.layers.map((e) => va(e, {
		catalog: t,
		visible: e.id === t.dataLayerId ? !1 : n[e.id] ?? !1
	})), o = t.wfsDomainLayers.length > 0 ? Ta(t, n, i) : t.wfsLayers.map((e) => na(e, {
		catalog: t,
		visible: n[e.id] ?? !1,
		clusterGeometryFilter: {
			catalog: t,
			attributeFilterValues: i,
			domainSourceLayerId: e.id
		}
	})), c = t.annexLayers.map((e) => di(e, {
		catalog: t,
		visible: n[e.id] ?? !1
	}));
	return new s({
		properties: {
			title: "Géodésie",
			name: fe,
			[bt]: t,
			[U]: i
		},
		layers: [
			...a,
			...o,
			...c
		]
	});
}
// src/registerGeodesyOnMap.ts
function Q(e) {
	let t = e.getLayers().getArray().find((e) => e.get("name") === fe);
	return t instanceof s ? t : null;
}
function Da(e, t = {}) {
	let n = Q(e);
	n && e.removeLayer(n);
	let r = Ea({
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
// src/geodesyLayerVisibility.ts
function Oa(e = ["RBF"], t = B) {
	let n = new Set(e), r = Object.fromEntries(t.layers.map((e) => [e.id, e.id !== t.dataLayerId && n.has(e.id)])), i = t.wfsDomainLayerIds.length > 0 ? Object.fromEntries(t.wfsDomainLayers.map((e) => [e.id, n.has(e.id)])) : Object.fromEntries(t.wfsLayers.map((e) => [e.id, n.has(e.id)]));
	t.wfsDomainSourceLayerId && (i[t.wfsDomainSourceLayerId] = t.wfsDomainLayerIds.some((e) => n.has(e)));
	let a = Object.fromEntries(t.annexLayers.map((e) => [e.id, n.has(e.id)]));
	return {
		...r,
		...i,
		...a
	};
}
function ka(e, t) {
	let n = e.get(b);
	return n ? Pt(t).includes(n) : !1;
}
function Aa(e, t) {
	if (!e.wfsDomainSourceLayerId) return t;
	let n = e.wfsDomainLayerIds.some((e) => t[e]);
	return {
		...t,
		[e.wfsDomainSourceLayerId]: n
	};
}
function ja(e, t, n) {
	let r = Aa(n, t);
	e.getLayers().forEach((e) => {
		if (!ka(e, n)) return;
		let t = e.get(b), i = t === n.dataLayerId;
		e.setVisible(i ? !1 : r[t] ?? !1);
	});
}
function Ma(e) {
	let t = q(e), n = Oa([], t), r = Q(e);
	if (!r) return n;
	let i = { ...n };
	return r.getLayers().forEach((e) => {
		if (!ka(e, t)) return;
		let n = e.get(b);
		i[n] = e.getVisible();
	}), i;
}
function Na(e, t) {
	let n = Q(e);
	if (!n) return;
	let r = q(e);
	ja(n, {
		...Ma(e),
		...t
	}, r);
}
function Pa(e, t, n) {
	Na(e, { [t]: n });
}
function Fa(e) {
	let t = q(e), n = Ma(e);
	return t.uiLayers.some((e) => n[e.id]) || t.wfsDomainLayers.some((e) => n[e.id]) || t.wfsUiLayers.some((e) => n[e.id]) || t.annexUiLayers.some((e) => n[e.id]);
}
// src/geodesyWfsAttributeFilters.ts
function Ia(e) {
	return e instanceof p && e.get("geodesyLayerKind") === "wfs" && e.get("geodesyWfsDataLayer") !== !0;
}
function La(e) {
	e.getLayers().forEach((e) => {
		Ia(e) && e.changed();
	});
}
function Ra(e) {
	e.getLayers().forEach((e) => {
		if (!Ia(e)) return;
		let t = e.getSource();
		t instanceof oe && t.refresh();
	});
}
function za(e) {
	let t = Q(e);
	return t ? t.get("geodesyWfsAttributeFilterValues") ?? null : null;
}
function Ba(e) {
	return za(e)?.values ?? {};
}
function Va(e) {
	return _n(e.wfsAttributeFilters);
}
function Ha(e, t) {
	let n = Q(e);
	if (!n) return;
	let r = n.get(U);
	r || (r = { values: Va(q(e)) }, n.set(U, r)), r.values = { ...t }, Dn(e), Ra(n), La(n);
}
function Ua(e) {
	Ha(e, Va(q(e)));
}
// src/constants/geodesyExternalUrl.ts
var Wa = "gdp-tools";
function $(e) {
	return e?.trim() || "gdp-tools";
}
function Ga(e, t = Wa) {
	let n = $(t), r = e.indexOf("#"), i = r >= 0 ? e.slice(0, r) : e, a = r >= 0 ? e.slice(r) : "";
	return `${i}${i.includes("?") ? "&" : "?"}source=${encodeURIComponent(n)}${a}`;
}
function Ka(e = Wa) {
	let t = $(e);
	return (e) => Ga(e, t);
}
// src/annex/geodesyGdpRgp2FicheUrl.ts
var qa = "https://rgp.ign.fr/STATIONS/", Ja = "Fiche RGP", Ya = "Consulter la fiche station";
function Xa(e, t = Wa) {
	let n = e.trim();
	return n ? Ga(`${qa}#${encodeURIComponent(n)}`, $(t)) : void 0;
}
// src/catalog/resolveGeodesyHitAttributeCatalog.ts
function Za(e, t, n = I) {
	let r = e.annexLayers.find((e) => e.id === t.layerId);
	return r ? vt({
		attributeKeys: r.attributeKeys,
		titleKeys: r.titleKeys,
		labels: n.labels
	}) : n;
}
// src/wfs/geodesyWfsLoadingState.ts
function Qa(e) {
	if (!e) return null;
	if (e instanceof oe) {
		let t = e.getSource();
		return t instanceof v ? t : null;
	}
	return e instanceof v ? e : null;
}
function $a(e) {
	let t = Q(e);
	if (!t) return [];
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		if (e instanceof s) {
			e.getLayers().forEach(r);
			return;
		}
		if (!(e instanceof p)) return;
		let t = e.get(V) === !0, i = e.get(C) === "wfs";
		if (!t && !i) return;
		let a = Qa(e.getSource());
		a && n.add(a);
	};
	return t.getLayers().forEach(r), [...n];
}
function eo(e) {
	let t = e.loading;
	if (t === !1 || t === void 0) return 0;
	let n = Number(t);
	return Number.isFinite(n) ? Math.max(0, n) : 0;
}
function to(e) {
	let t = $a(e).reduce((e, t) => e + eo(t), 0);
	return {
		pendingCount: t,
		isLoading: t > 0
	};
}
function no(e, t) {
	let n = [], r = 0, i = () => {
		t({
			pendingCount: r,
			isLoading: r > 0
		});
	}, a = () => {
		n.forEach(de), n.length = 0, r = 0;
		for (let t of $a(e)) n.push(t.on("featuresloadstart", () => {
			r += 1, i();
		}), t.on("featuresloadend", () => {
			r = Math.max(0, r - 1), i();
		}), t.on("featuresloaderror", () => {
			r = Math.max(0, r - 1), i();
		}));
		i();
	};
	a(), $a(e).length === 0 && window.setTimeout(a, 0);
	let o = [e.getLayers().on("add", (e) => {
		e.element.get("name") === "geodesyGroup" && a();
	}), e.getLayers().on("remove", (e) => {
		e.element.get("name") === "geodesyGroup" && a();
	})];
	return () => {
		n.forEach(de), o.forEach(de);
	};
}
// src/wms/geodesyWmsLoadingState.ts
function ro(e) {
	let t = Q(e);
	if (!t) return [];
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		if (e instanceof s) {
			e.getLayers().forEach(r);
			return;
		}
		if (!(e instanceof _) || !e.get("geodesyLayerId")) return;
		let t = e.getSource();
		t instanceof le && n.add(t);
	};
	return t.getLayers().forEach(r), [...n];
}
function io(e) {
	return ua();
}
function ao(e, t) {
	return da(t);
}
// src/geodesyMapLoadingState.ts
function oo(e) {
	let t = to(e), n = io(e);
	return {
		pendingCount: t.pendingCount + n.pendingCount,
		isLoading: t.isLoading || n.isLoading
	};
}
function so(e, t) {
	let n = to(e), r = io(e), i = () => {
		t({
			pendingCount: n.pendingCount + r.pendingCount,
			isLoading: n.isLoading || r.isLoading
		});
	}, a = no(e, (e) => {
		n = e, i();
	}), o = ao(e, (e) => {
		r = e, i();
	});
	return i(), () => {
		a(), o();
	};
}
// src/report/geodesyPointPhotos.ts
function co(e, t) {
	return F(e, t).filter(([e, t]) => P(e, t)).map(([e, n]) => {
		let r = n.trim();
		return {
			key: e,
			label: L(e, t),
			url: r,
			displayUrl: j(r)
		};
	});
}
// src/report/geodesyPointDisplay.ts
function lo(e, t) {
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
function uo(e) {
	return e.transformExternalUrl ? e.transformExternalUrl : Ka($(e.externalUrlSource));
}
function fo(e, t, n) {
	if (n.layerId !== "GDP_RGP2") return e;
	let r = Xa(String(t.nom ?? "").trim(), $(n.externalUrlSource));
	return r ? [...e, {
		label: Ja,
		value: Ya,
		href: r
	}] : e;
}
function po(e, t, n) {
	let r = t.trim();
	return n.layerId === "GDP_RGP2" && e.toLowerCase() === "dispo" ? ei(r) : r;
}
function mo(e, t, n, r) {
	let i = t.trim(), a = L(e, n), o = uo(r);
	if (r.layerId === "GDP_RGP2" && e.toLowerCase() === "dispo") return {
		label: a,
		value: i,
		dispoStates: Qr(i)
	};
	if (ft(e)) {
		let e = He(i, {
			pictoUrlMaps: r.pictoUrlMaps ?? D,
			layerId: r.layerId
		});
		return e ? {
			label: a,
			value: i,
			isPicto: !0,
			href: o(e),
			imageUrl: e,
			displayImageUrl: j(e)
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
		displayImageUrl: j(i)
	} : {
		label: a,
		value: i,
		...dt(e, t) ? { href: o(i) } : {}
	};
}
function ho(e, t) {
	let n = e.picto ?? e.PICTO;
	if (n == null || String(n).trim() === "") return;
	let r = String(n).trim(), i = He(r, {
		pictoUrlMaps: t.pictoUrlMaps ?? D,
		layerId: t.layerId
	});
	if (!i) return;
	let a = uo(t);
	return {
		value: r,
		imageUrl: i,
		displayImageUrl: j(i),
		href: a(i)
	};
}
function go(e, t = {}) {
	let n = t.attributeCatalog ?? I;
	return z(F(e, n), n).map(([e, r]) => mo(e, r, n, t));
}
function _o(e, t = I, n = {}) {
	let r = e.feature.getProperties(), i = [`Couche : ${e.layerTitle}`], a = n.layerId ?? e.layerId;
	return z(F(r, t), t).forEach(([e, n]) => {
		let r = po(e, n, { layerId: a });
		i.push(`${L(e, t)} : ${r}`);
	}), i.join("\n");
}
function vo(e, t) {
	let n = t.attributeCatalog ?? I;
	return t.geodesyCatalog ? Za(t.geodesyCatalog, e, n) : n;
}
function yo(e, t = {}) {
	let n = vo(e, t), r = co(e.feature.getProperties(), n).map((e) => e.url);
	r.length !== 0 && M(r).catch(() => void 0);
}
function bo(e, t, n = {}) {
	let r = vo(e, n), i = e.feature.getProperties(), { longitude: a, latitude: o } = lo(e, t), s = {
		...n,
		attributeCatalog: r,
		layerId: n.layerId ?? e.layerId
	}, c = ho(i, s);
	return {
		title: R(i, r),
		titlePicto: c,
		layerTitle: e.layerTitle,
		longitude: a,
		latitude: o,
		attributes: fo(go(i, s), i, s),
		photos: co(i, r),
		comment: _o(e, r, { layerId: s.layerId })
	};
}
function xo(e, t = {}) {
	let n = t.attributeCatalog ?? I;
	return {
		title: R(e, n),
		titlePicto: ho(e, {
			...t,
			attributeCatalog: n
		})
	};
}
function So(e, t) {
	return `${t.toFixed(5)}° N, ${e.toFixed(5)}° E`;
}
// src/report/geodesyPointReportContext.ts
function Co(e) {
	let t = e.id ?? e.ID;
	if (t != null) return String(t).trim() || void 0;
}
function wo(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) n === "geometry" || typeof r == "object" && r || (t[n] = r);
	return t;
}
function To(e, t, n = {}) {
	let r = wo(e.feature.getProperties());
	return {
		...bo(e, t, n),
		layerId: e.layerId,
		properties: r,
		geodesyId: Co(r)
	};
}
export { ri as $, je as $n, Rt as $t, Ma as A, M as An, Dn as At, Hi as B, T as Bn, _n as Bt, Ga as C, rt as Cn, Fn as Ct, Ba as D, Ye as Dn, Nn as Dt, Ua as E, et as En, Pn as Et, Da as F, We as Fn, J as Ft, Ci as G, Le as Gn, Bt as Gt, ki as H, Ie as Hn, mn as Ht, Ea as I, D as In, q as It, si as J, ke as Jn, Lt as Jt, wi as K, C as Kn, Gt as Kt, va as L, Ue as Ln, $t as Lt, Pa as M, j as Mn, On as Mt, Na as N, Ge as Nn, xn as Nt, Ha as O, tt as On, Ln as Ot, Q as P, O as Pn, wn as Pt, ti as Q, Ae as Qn, H as Qt, na as R, Ve as Rn, U as Rt, Wa as S, dt as Sn, An as St, $ as T, it as Tn, Mn as Tt, Di as U, Ne as Un, un as Ut, Bi as V, Me as Vn, Qt as Vt, Ti as W, w as Wn, nn as Wt, Yr as X, Ee as Xn, Ft as Xt, X as Y, Te as Yn, V as Yt, ei as Z, De as Zn, It as Zt, Za as _, F as _n, qn as _t, _o as a, Nt as an, _e as ar, Kr as at, qa as b, P as bn, Hn as bt, co as c, vt as cn, he as cr, Er as ct, ro as d, R as dn, ye as dr, Tr as dt, B as en, Ce as er, Qr as et, io as f, z as fn, x as fr, _r as ft, no as g, mt as gn, $n as gt, to as h, ct as hn, pe as hr, Xn as ht, lo as i, Mt as in, S as ir, Ur as it, Fa as j, Qe as jn, En as jt, Oa as k, Ze as kn, jn as kt, oo as l, L as ln, ge as lr, Cr as lt, $a as m, ht as mn, be as mr, fr as mt, bo as n, jt as nn, Se as nr, $r as nt, So as o, I as on, fe as or, Lr as ot, ao as p, at as pn, ve as pr, gr as pt, di as q, Oe as qn, Kt as qt, xo as r, Pt as rn, xe as rr, Hr as rt, yo as s, gt as sn, b as sr, Or as st, To as t, bt as tn, we as tr, ni as tt, so as u, yt as un, me as ur, wr as ut, Ja as v, N as vn, Yn as vt, Ka as w, nt as wn, In as wt, Xa as x, ft as xn, Rn as xt, Ya as y, st as yn, Vn as yt, Ki as z, He as zn, gn as zt };
