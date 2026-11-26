import { A as e, At as t, Bt as n, C as r, E as i, It as a, M as o, O as s, Pt as c, T as l, Ut as u, ct as d, dt as f, en as p, f as m, jt as h, lt as g, mt as _, n as v, nn as y, o as b, pt as x, s as S, t as C, ut as w } from "./geodesyPointReportContext-I2Vg6nVJ.js";
import T from "ol/geom/Point";
import { listen as E, unlistenByKey as D } from "ol/events";
import { toLonLat as O } from "ol/proj";
import { jsx as k, jsxs as A } from "react/jsx-runtime";
import { useCallback as j, useEffect as M, useMemo as N, useRef as P, useState as F } from "react";
var I = {
	switcher: "_switcher_jknvk_1",
	groupLabel: "_groupLabel_jknvk_9",
	layerButton: "_layerButton_jknvk_19",
	layerButtonActive: "_layerButtonActive_jknvk_32"
}, L = {
	details: "_details_auv5o_1",
	meta: "_meta_auv5o_7",
	attributeList: "_attributeList_auv5o_13",
	attributeRow: "_attributeRow_auv5o_20",
	imageBlock: "_imageBlock_auv5o_59",
	imageLink: "_imageLink_auv5o_66",
	imageThumb: "_imageThumb_auv5o_72",
	pictoCode: "_pictoCode_auv5o_89",
	imageOpenLink: "_imageOpenLink_auv5o_96",
	empty: "_empty_auv5o_103",
	dispoStates: "_dispoStates_auv5o_109",
	dispoDotAvailable: "_dispoDotAvailable_auv5o_115",
	dispoDotUnavailable: "_dispoDotUnavailable_auv5o_116"
}, R = {
	titleRow: "_titleRow_1al4w_1",
	titlePicto: "_titlePicto_1al4w_8",
	titleText: "_titleText_1al4w_15"
}, z = {
	panel: "_panel_1eyrw_1",
	filterRow: "_filterRow_1eyrw_7",
	filterLabel: "_filterLabel_1eyrw_17",
	segmented: "_segmented_1eyrw_23",
	segment: "_segment_1eyrw_23",
	dateRow: "_dateRow_1eyrw_47",
	textRow: "_textRow_1eyrw_48",
	checkboxLabel: "_checkboxLabel_1eyrw_54",
	dateInput: "_dateInput_1eyrw_62",
	textInput: "_textInput_1eyrw_63",
	select: "_select_1eyrw_64",
	clearButton: "_clearButton_1eyrw_80"
};
// src/react/MapLayerSwitcher.tsx
function B(e, t) {
	return e.mode === "single" ? e.activeId === t : !!e.activeIds[t];
}
function V(e, t) {
	e.mode === "single" ? e.onActiveIdChange(t) : e.onToggle(t);
}
function H(e) {
	let { options: t, groupLabel: n, className: r } = e, i = r ? `${I.switcher} ${r}` : I.switcher;
	return /* @__PURE__ */ A("div", {
		className: i,
		role: "group",
		"aria-label": n,
		children: [n ? /* @__PURE__ */ k("span", {
			className: I.groupLabel,
			children: n
		}) : null, t.map((t) => {
			let n = B(e, t.id);
			return /* @__PURE__ */ k("button", {
				type: "button",
				title: t.title,
				className: `${I.layerButton} ${n ? I.layerButtonActive : ""}`,
				"aria-pressed": e.mode === "multiple" ? n : void 0,
				onClick: () => V(e, t.id),
				children: t.label
			}, t.id);
		})]
	});
}
// src/react/GeodesyLayerSwitcher.tsx
function U({ visibility: e, onToggle: t, catalog: n = p, groupLabel: r = "Géodésie", className: i }) {
	let a = n.uiLayers.map((e) => ({
		id: e.id,
		label: e.shortLabel,
		title: e.title
	})), o = Object.fromEntries(a.map((t) => [t.id, e[t.id] ?? !1]));
	return /* @__PURE__ */ k(H, {
		mode: "multiple",
		groupLabel: r,
		options: a,
		activeIds: o,
		onToggle: (e) => t(e),
		className: i
	});
}
// src/react/GeodesyPointDetails.tsx
function W({ states: e }) {
	return /* @__PURE__ */ k("span", {
		className: L.dispoStates,
		role: "img",
		"aria-label": "Disponibilité",
		children: e.map((e, t) => /* @__PURE__ */ k("span", {
			className: e === "available" ? L.dispoDotAvailable : L.dispoDotUnavailable,
			"aria-hidden": "true"
		}, `${e}-${t}`))
	});
}
function G({ attribute: e }) {
	let [t, n] = F(!1), r = e.displayImageUrl ?? e.imageUrl;
	return e.dispoStates?.length ? /* @__PURE__ */ k(W, { states: e.dispoStates }) : r && !t ? /* @__PURE__ */ A("div", {
		className: L.imageBlock,
		children: [
			/* @__PURE__ */ k("a", {
				href: e.href ?? r,
				target: "_blank",
				rel: "noopener noreferrer",
				className: L.imageLink,
				title: `Ouvrir ${e.label}`,
				children: /* @__PURE__ */ k("img", {
					src: r,
					alt: e.label,
					className: L.imageThumb,
					loading: "lazy",
					onError: () => n(!0)
				})
			}),
			e.isPicto ? /* @__PURE__ */ k("span", {
				className: L.pictoCode,
				children: e.value
			}) : null,
			e.href && !e.isPicto ? /* @__PURE__ */ k("a", {
				href: e.href,
				target: "_blank",
				rel: "noopener noreferrer",
				className: L.imageOpenLink,
				children: "Ouvrir l'image"
			}) : null
		]
	}) : e.href ? /* @__PURE__ */ k("a", {
		href: e.href,
		target: "_blank",
		rel: "noopener noreferrer",
		children: e.value
	}) : e.value;
}
function K({ layerTitle: e, longitude: t, latitude: n, attributes: r, showMeta: i = !0 }) {
	return /* @__PURE__ */ A("div", {
		className: L.details,
		children: [i ? /* @__PURE__ */ A("p", {
			className: L.meta,
			children: [
				e,
				" · ",
				n.toFixed(5),
				"° N, ",
				t.toFixed(5),
				"° E"
			]
		}) : null, r.length > 0 ? /* @__PURE__ */ k("dl", {
			className: L.attributeList,
			children: r.map((e, t) => /* @__PURE__ */ A("div", {
				className: L.attributeRow,
				children: [/* @__PURE__ */ k("dt", { children: e.label }), /* @__PURE__ */ k("dd", { children: /* @__PURE__ */ k(G, { attribute: e }) })]
			}, `${e.label}-${e.value}-${t}`))
		}) : /* @__PURE__ */ k("p", {
			className: L.empty,
			children: "Aucun attribut disponible pour ce point."
		})]
	});
}
// src/react/GeodesyPointTitle.tsx
function q({ title: e, picto: t, className: n }) {
	let [r, i] = F(!1), a = t?.displayImageUrl ?? t?.imageUrl, o = t && a && !r;
	return /* @__PURE__ */ A("span", {
		className: [R.titleRow, n].filter(Boolean).join(" "),
		children: [o ? /* @__PURE__ */ k("img", {
			src: a,
			alt: "",
			className: R.titlePicto,
			loading: "lazy",
			onError: () => i(!0)
		}) : null, /* @__PURE__ */ k("span", {
			className: R.titleText,
			children: e
		})]
	});
}
// src/react/GeodesyWfsAttributeFiltersPanel.tsx
function J(e, t, n) {
	return {
		...e,
		[t]: n
	};
}
function Y({ definition: e, value: t, onChange: n }) {
	let r = e.trueLabel ?? "Oui", i = e.falseLabel ?? "Non";
	return /* @__PURE__ */ A("div", {
		className: z.segmented,
		role: "group",
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ k("button", {
				type: "button",
				className: z.segment,
				"data-active": t == null ? "true" : void 0,
				onClick: () => n(null),
				children: "Tous"
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: z.segment,
				"data-active": t === !0 ? "true" : void 0,
				onClick: () => n(!0),
				children: r
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: z.segment,
				"data-active": t === !1 ? "true" : void 0,
				onClick: () => n(!1),
				children: i
			})
		]
	});
}
function X({ value: e, onChange: t }) {
	let n = typeof e == "string", r = (n) => {
		n ? typeof e == "string" && e.length > 0 ? t(e) : t((/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) : t(null);
	};
	return /* @__PURE__ */ A("div", {
		className: z.dateRow,
		children: [/* @__PURE__ */ A("label", {
			className: z.checkboxLabel,
			children: [/* @__PURE__ */ k("input", {
				type: "checkbox",
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), "Activer"]
		}), /* @__PURE__ */ k("input", {
			type: "date",
			className: z.dateInput,
			value: typeof e == "string" ? e : "",
			disabled: !n,
			onChange: (e) => t(e.target.value || null)
		})]
	});
}
function ee({ definition: e, value: t, onChange: n }) {
	let r = typeof t == "string";
	return /* @__PURE__ */ A("div", {
		className: z.textRow,
		children: [/* @__PURE__ */ A("label", {
			className: z.checkboxLabel,
			children: [/* @__PURE__ */ k("input", {
				type: "checkbox",
				checked: r,
				onChange: (e) => n(e.target.checked ? String(t ?? "") : null)
			}), "Activer"]
		}), /* @__PURE__ */ k("input", {
			type: "text",
			className: z.textInput,
			value: typeof t == "string" ? t : "",
			disabled: !r,
			placeholder: e.placeholder ?? "",
			onChange: (e) => n(e.target.value || null)
		})]
	});
}
function te({ definition: e, value: t, onChange: n }) {
	return /* @__PURE__ */ A("select", {
		className: z.select,
		value: typeof t == "string" ? t : "",
		onChange: (e) => n(e.target.value || null),
		children: [/* @__PURE__ */ k("option", {
			value: "",
			children: "Tous"
		}), e.options.map((e) => /* @__PURE__ */ k("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
}
function ne({ definition: e, value: t, onChange: n }) {
	let r = u(e, t), i = (t) => {
		let i = new Set(r);
		i.has(t) ? i.delete(t) : i.add(t), i.size === 0 ? n("") : i.size === e.options.length ? n(null) : n([...i].join(","));
	};
	return /* @__PURE__ */ k("div", {
		className: z.segmented,
		role: "group",
		"aria-label": e.title,
		children: e.options.map((e) => /* @__PURE__ */ k("button", {
			type: "button",
			className: z.segment,
			"data-active": r.has(e.value) ? "true" : void 0,
			"aria-pressed": r.has(e.value),
			onClick: () => i(e.value),
			children: e.label
		}, e.value))
	});
}
function re({ filters: e, values: t, onChange: n, onClear: r, className: i }) {
	return e.length ? /* @__PURE__ */ A("div", {
		className: [z.panel, i].filter(Boolean).join(" "),
		children: [e.map((e) => /* @__PURE__ */ A("div", {
			className: z.filterRow,
			children: [
				/* @__PURE__ */ k("span", {
					className: z.filterLabel,
					children: e.title
				}),
				e.type === "boolean" ? /* @__PURE__ */ k(Y, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(J(t, e.id, r))
				}) : null,
				e.type === "date" ? /* @__PURE__ */ k(X, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(J(t, e.id, r))
				}) : null,
				e.type === "text" ? /* @__PURE__ */ k(ee, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(J(t, e.id, r))
				}) : null,
				e.type === "choice" ? /* @__PURE__ */ k(te, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(J(t, e.id, r))
				}) : null,
				e.type === "multiChoice" ? /* @__PURE__ */ k(ne, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(J(t, e.id, r))
				}) : null
			]
		}, e.id)), r ? /* @__PURE__ */ k("button", {
			type: "button",
			className: z.clearButton,
			onClick: r,
			children: "Réinitialiser les filtres"
		}) : null]
	}) : null;
}
// src/react/useGeodesyMapClick.ts
function ie(e) {
	let [t, n] = O(e);
	return {
		kind: "coordinate",
		coordinate: {
			longitude: t,
			latitude: n,
			subtitle: b(t, n)
		}
	};
}
function Z(e, t, n) {
	return S(e, n), {
		kind: "geodesy",
		display: v(e, t, n),
		reportContext: C(e, t, {
			...n,
			attributeCatalog: n.attributeCatalog
		})
	};
}
function Q(e, t) {
	return {
		attributeCatalog: t.attributeCatalog,
		geodesyCatalog: a(e),
		externalUrlSource: t.externalUrlSource,
		transformExternalUrl: t.transformExternalUrl,
		pictoUrlMaps: t.pictoUrlMaps
	};
}
function ae(e, n = {}) {
	let { enabled: r = !0, isMapReady: i = !1, query: a, attributeCatalog: o, externalUrlSource: l, transformExternalUrl: u, pictoUrlMaps: p } = n, [m, v] = F(null), y = j(() => {
		e && t(e), v(null);
	}, [e]), b = j(async (t) => {
		if (!e) return !1;
		let n = e.getPixelFromCoordinate(t);
		if (!n) return !1;
		let r = await d(e, t, n, a);
		if (r.length === 0) return !1;
		let i = Q(e, {
			attributeCatalog: o,
			externalUrlSource: l,
			transformExternalUrl: u,
			pictoUrlMaps: p
		});
		return v(Z(r[0], t, i)), !0;
	}, [
		e,
		a,
		o,
		l,
		u,
		p
	]);
	return M(() => {
		if (!e || !r || !i) return;
		let t = 0, n = !1, d = h(e), m = d?.on("select", (r) => {
			let i = r, s = i.selected[0];
			if (!s || !c(s)) return;
			let d = i.mapBrowserEvent, f = s.getGeometry(), m = d?.coordinate ?? (f instanceof T ? f.getCoordinates() : void 0);
			if (!m) return;
			let h = Q(e, {
				attributeCatalog: o,
				externalUrlSource: l,
				transformExternalUrl: u,
				pictoUrlMaps: p
			}), _ = g(e, s, m, a?.wfs);
			_ && (n = !0, t += 1, v(Z(_, m, h)));
		}), y = E(e, "singleclick", (r) => {
			let i = r;
			if (n) {
				n = !1;
				return;
			}
			if ((d?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0) return;
			let c = Q(e, {
				attributeCatalog: o,
				externalUrlSource: l,
				transformExternalUrl: u,
				pictoUrlMaps: p
			}), m = a?.preferWfs ?? !0;
			if (m) {
				let t = f(e, i.pixel, a?.wfs);
				if (t.length > 0) {
					v(Z(t[0], i.coordinate, c));
					return;
				}
				let n = x(e, i.pixel, a?.annex);
				if (n.length > 0) {
					v(Z(n[0], i.coordinate, c));
					return;
				}
				if (w(e, i.pixel, a?.wfs)) return;
			}
			(async () => {
				let n = ++t, r = ie(i.coordinate);
				try {
					if (v(r), !s(e)) return;
					let o = await _(e, i.coordinate, a?.wms);
					if (n !== t) return;
					if (o.length > 0) {
						v(Z(o[0], i.coordinate, c));
						return;
					}
					if (!m || w(e, i.pixel, a?.wfs)) return;
					let l = f(e, i.pixel, a?.wfs);
					if (n !== t) return;
					if (l.length > 0) {
						v(Z(l[0], i.coordinate, c));
						return;
					}
					let u = x(e, i.pixel, a?.annex);
					if (n !== t) return;
					u.length > 0 && v(Z(u[0], i.coordinate, c));
				} catch {
					if (n !== t) return;
					v(r);
				}
			})();
		});
		return () => {
			t += 1, m && D(m), D(y);
		};
	}, [
		o,
		r,
		l,
		i,
		e,
		p,
		a,
		u
	]), {
		pendingClick: m,
		clearPendingClick: y,
		openAtCoordinate: b
	};
}
// src/react/useGeodesyOnMap.ts
function oe(t, a = {}) {
	let { catalog: s, initialActive: c = ["RBF"], initialWfsAttributeFilterValues: u, popup: d, layers: f, layerIds: p, uiLayerIds: m, dataLayerId: h, networkLayerIds: g, wmsUrl: _, wmsGpOlExt: v, attributes: b, attributeKeys: x, excludedKeys: S, titleKeys: C, labels: w, wfsLayers: T, wfsLayerIds: E, wfsUiLayerIds: D, wfsUrl: O, wfsApiKey: k, wfsDataProjection: A, wfsBboxPaddingRatio: P, wfsUseCacheBuster: I, wfsCluster: L, wfsDomainLayers: R, wfsDomainSourceLayerId: z, wfsAttributeFilters: B, annexLayers: V, annexLayerIds: H, annexUiLayerIds: U } = a, W = N(() => s ?? y({
		layers: f,
		layerIds: p,
		uiLayerIds: m,
		dataLayerId: h,
		networkLayerIds: g,
		wmsUrl: _,
		wmsGpOlExt: v,
		attributes: b,
		attributeKeys: x,
		excludedKeys: S,
		titleKeys: C,
		labels: w,
		wfsLayers: T,
		wfsLayerIds: E,
		wfsUiLayerIds: D,
		wfsUrl: O,
		wfsApiKey: k,
		wfsDataProjection: A,
		wfsBboxPaddingRatio: P,
		wfsUseCacheBuster: I,
		wfsCluster: L,
		wfsDomainLayers: R,
		wfsDomainSourceLayerId: z,
		wfsAttributeFilters: B,
		annexLayers: V,
		annexLayerIds: H,
		annexUiLayerIds: U
	}), [
		s,
		f,
		p,
		m,
		h,
		g,
		_,
		v,
		b,
		x,
		S,
		C,
		w,
		T,
		E,
		D,
		O,
		k,
		A,
		P,
		I,
		L,
		R,
		z,
		B,
		V,
		H,
		U
	]), G = N(() => W.wfsDomainLayers.length > 0 ? W.wfsDomainLayers : W.wfsUiLayers, [W.wfsDomainLayers, W.wfsUiLayers]), [K, q] = F(() => i(c, W)), [J, Y] = F(() => u ?? n(W.wfsAttributeFilters));
	M(() => {
		if (t) return o(t, {
			catalog: W,
			visibility: K,
			attributeFilterValues: J,
			popup: d
		});
	}, [
		t,
		d,
		W
	]), M(() => {
		t && e(t, K);
	}, [t, K]), M(() => {
		t && l(t, J);
	}, [t, J]);
	let X = j((e) => {
		let t = W.uiLayers.some((t) => t.id === e) || W.wfsUiLayers.some((t) => t.id === e) || W.wfsDomainLayers.some((t) => t.id === e) || W.annexUiLayers.some((t) => t.id === e);
		q((n) => ({
			...n,
			[e]: t ? !n[e] : n[e]
		}));
	}, [
		W.uiLayers,
		W.wfsUiLayers,
		W.wfsDomainLayers,
		W.annexUiLayers
	]), ee = j((e) => {
		q(e);
	}, []), te = j((e) => {
		Y(e);
	}, []), ne = j(() => {
		Y(n(W.wfsAttributeFilters)), t && r(t);
	}, [W.wfsAttributeFilters, t]), re = N(() => [
		...W.uiLayers.filter((e) => K[e.id]).map((e) => e.shortLabel),
		...G.filter((e) => K[e.id]).map((e) => e.shortLabel),
		...W.annexUiLayers.filter((e) => K[e.id]).map((e) => e.shortLabel)
	], [
		W.uiLayers,
		W.annexUiLayers,
		G,
		K
	]);
	return {
		catalog: W,
		uiLayers: W.uiLayers,
		uiWfsLayers: G,
		uiAnnexLayers: W.annexUiLayers,
		visibility: K,
		wfsAttributeFilterValues: J,
		setWfsAttributeFilterValues: te,
		clearWfsAttributeFilterValues: ne,
		toggleLayer: X,
		setVisibility: ee,
		activeLabels: re
	};
}
// src/react/useGeodesyWfsLoading.ts
var se = 400;
function ce(e, t) {
	return e.layers.some((n) => n.id !== e.dataLayerId && t[n.id]) ? !0 : (e.wfsDomainLayers.length > 0 ? e.wfsDomainLayers : e.wfsLayers).some((e) => t[e.id]);
}
function $(e) {
	return e === null ? 0 : Date.now() - e;
}
function le(e, t) {
	let { catalog: n, visibility: r, showIndicator: i = !0, showAfterMs: a = 0 } = t, o = i && ce(n, r), s = P(null), c = P(null), l = P(null), u = P(!1), d = P(!1), [f, p] = F({
		pendingCount: 0,
		isLoading: !1,
		elapsedMs: 0
	});
	return M(() => {
		if (!e || !o) {
			u.current = !1, d.current = !1, s.current = null, c.current !== null && (window.clearTimeout(c.current), c.current = null), l.current !== null && (window.clearTimeout(l.current), l.current = null), p({
				pendingCount: 0,
				isLoading: !1,
				elapsedMs: 0
			});
			return;
		}
		let t = m(e, (e) => {
			if (c.current !== null && (window.clearTimeout(c.current), c.current = null), e.isLoading) {
				let t = !u.current;
				u.current = !0, t && (s.current = Date.now(), d.current = a === 0, l.current !== null && (window.clearTimeout(l.current), l.current = null), a > 0 && (l.current = window.setTimeout(() => {
					l.current = null, u.current && (d.current = !0, p((e) => ({
						...e,
						isLoading: !0,
						elapsedMs: $(s.current)
					})));
				}, a))), p((t) => ({
					...e,
					isLoading: d.current,
					elapsedMs: d.current ? t.isLoading ? t.elapsedMs : $(s.current) : 0
				}));
				return;
			}
			if (u.current = !1, l.current !== null && (window.clearTimeout(l.current), l.current = null), !d.current) {
				s.current = null, p({
					...e,
					elapsedMs: 0
				});
				return;
			}
			let t = s.current, n = $(t), r = Math.max(0, se - n);
			r === 0 ? (s.current = null, d.current = !1, p({
				...e,
				elapsedMs: 0
			})) : (p((e) => ({
				...e,
				pendingCount: 0,
				isLoading: !0,
				elapsedMs: n
			})), c.current = window.setTimeout(() => {
				s.current = null, d.current = !1, c.current = null, p({
					pendingCount: 0,
					isLoading: !1,
					elapsedMs: 0
				});
			}, r));
		});
		return () => {
			t(), u.current = !1, c.current !== null && (window.clearTimeout(c.current), c.current = null), l.current !== null && (window.clearTimeout(l.current), l.current = null);
		};
	}, [
		e,
		o,
		n,
		a
	]), M(() => {
		if (!f.isLoading) return;
		let e = window.setInterval(() => {
			let e = s.current;
			e !== null && p((t) => ({
				...t,
				elapsedMs: Date.now() - e
			}));
		}, 200);
		return () => {
			window.clearInterval(e);
		};
	}, [f.isLoading]), f;
}
export { U as GeodesyLayerSwitcher, K as GeodesyPointDetails, q as GeodesyPointTitle, re as GeodesyWfsAttributeFiltersPanel, H as MapLayerSwitcher, ae as useGeodesyMapClick, oe as useGeodesyOnMap, le as useGeodesyWfsLoading };
