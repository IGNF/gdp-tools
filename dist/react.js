import { At as e, Bt as t, E as n, F as r, It as i, N as a, O as o, Pt as s, Ut as c, ct as l, dt as u, en as d, j as f, jt as p, k as m, lt as h, mt as g, n as _, nn as v, o as y, pt as b, s as x, t as S, u as C, ut as w } from "./geodesyPointReportContext-DwPOSJrU.js";
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
function U({ visibility: e, onToggle: t, catalog: n = d, groupLabel: r = "Géodésie", className: i }) {
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
	let r = c(e, t), i = (t) => {
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
			subtitle: y(t, n)
		}
	};
}
function Z(e, t, n) {
	return x(e, n), {
		kind: "geodesy",
		display: _(e, t, n),
		reportContext: S(e, t, {
			...n,
			attributeCatalog: n.attributeCatalog
		})
	};
}
function Q(e, t) {
	return {
		attributeCatalog: t.attributeCatalog,
		geodesyCatalog: i(e),
		externalUrlSource: t.externalUrlSource,
		transformExternalUrl: t.transformExternalUrl,
		pictoUrlMaps: t.pictoUrlMaps
	};
}
function ae(t, n = {}) {
	let { enabled: r = !0, isMapReady: i = !1, query: a, attributeCatalog: o, externalUrlSource: c, transformExternalUrl: d, pictoUrlMaps: m } = n, [_, v] = F(null), y = j(() => {
		t && e(t), v(null);
	}, [t]), x = j(async (e) => {
		if (!t) return !1;
		let n = t.getPixelFromCoordinate(e);
		if (!n) return !1;
		let r = await l(t, e, n, a);
		if (r.length === 0) return !1;
		let i = Q(t, {
			attributeCatalog: o,
			externalUrlSource: c,
			transformExternalUrl: d,
			pictoUrlMaps: m
		});
		return v(Z(r[0], e, i)), !0;
	}, [
		t,
		a,
		o,
		c,
		d,
		m
	]);
	return M(() => {
		if (!t || !r || !i) return;
		let e = 0, n = !1, l = p(t), _ = l?.on("select", (r) => {
			let i = r, l = i.selected[0];
			if (!l || !s(l)) return;
			let u = i.mapBrowserEvent, f = l.getGeometry(), p = u?.coordinate ?? (f instanceof T ? f.getCoordinates() : void 0);
			if (!p) return;
			let g = Q(t, {
				attributeCatalog: o,
				externalUrlSource: c,
				transformExternalUrl: d,
				pictoUrlMaps: m
			}), _ = h(t, l, p, a?.wfs);
			_ && (n = !0, e += 1, v(Z(_, p, g)));
		}), y = E(t, "singleclick", (r) => {
			let i = r;
			if (n) {
				n = !1;
				return;
			}
			if ((l?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0) return;
			let s = Q(t, {
				attributeCatalog: o,
				externalUrlSource: c,
				transformExternalUrl: d,
				pictoUrlMaps: m
			}), p = a?.preferWfs ?? !0;
			if (p) {
				let e = u(t, i.pixel, a?.wfs);
				if (e.length > 0) {
					v(Z(e[0], i.coordinate, s));
					return;
				}
				let n = b(t, i.pixel, a?.annex);
				if (n.length > 0) {
					v(Z(n[0], i.coordinate, s));
					return;
				}
				if (w(t, i.pixel, a?.wfs)) return;
			}
			(async () => {
				let n = ++e, r = ie(i.coordinate);
				try {
					if (v(r), !f(t)) return;
					let o = await g(t, i.coordinate, a?.wms);
					if (n !== e) return;
					if (o.length > 0) {
						v(Z(o[0], i.coordinate, s));
						return;
					}
					if (!p || w(t, i.pixel, a?.wfs)) return;
					let c = u(t, i.pixel, a?.wfs);
					if (n !== e) return;
					if (c.length > 0) {
						v(Z(c[0], i.coordinate, s));
						return;
					}
					let l = b(t, i.pixel, a?.annex);
					if (n !== e) return;
					l.length > 0 && v(Z(l[0], i.coordinate, s));
				} catch {
					if (n !== e) return;
					v(r);
				}
			})();
		});
		return () => {
			e += 1, _ && D(_), D(y);
		};
	}, [
		o,
		r,
		c,
		i,
		t,
		m,
		a,
		d
	]), {
		pendingClick: _,
		clearPendingClick: y,
		openAtCoordinate: x
	};
}
// src/react/useGeodesyOnMap.ts
function oe(e, i = {}) {
	let { catalog: s, initialActive: c = ["RBF"], initialWfsAttributeFilterValues: l, popup: u, layers: d, layerIds: f, uiLayerIds: p, dataLayerId: h, networkLayerIds: g, wmsUrl: _, wmsGpOlExt: y, attributes: b, attributeKeys: x, excludedKeys: S, titleKeys: C, labels: w, wfsLayers: T, wfsLayerIds: E, wfsUiLayerIds: D, wfsUrl: O, wfsApiKey: k, wfsDataProjection: A, wfsBboxPaddingRatio: P, wfsUseCacheBuster: I, wfsCluster: L, wfsDomainLayers: R, wfsDomainSourceLayerId: z, wfsAttributeFilters: B, annexLayers: V, annexLayerIds: H, annexUiLayerIds: U } = i, W = N(() => s ?? v({
		layers: d,
		layerIds: f,
		uiLayerIds: p,
		dataLayerId: h,
		networkLayerIds: g,
		wmsUrl: _,
		wmsGpOlExt: y,
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
		d,
		f,
		p,
		h,
		g,
		_,
		y,
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
	]), G = N(() => W.wfsDomainLayers.length > 0 ? W.wfsDomainLayers : W.wfsUiLayers, [W.wfsDomainLayers, W.wfsUiLayers]), [K, q] = F(() => m(c, W)), [J, Y] = F(() => l ?? t(W.wfsAttributeFilters));
	M(() => {
		if (e) return r(e, {
			catalog: W,
			visibility: K,
			attributeFilterValues: J,
			popup: u
		});
	}, [
		e,
		u,
		W
	]), M(() => {
		e && a(e, K);
	}, [e, K]), M(() => {
		e && o(e, J);
	}, [e, J]);
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
		Y(t(W.wfsAttributeFilters)), e && n(e);
	}, [W.wfsAttributeFilters, e]), re = N(() => [
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
		let t = C(e, (e) => {
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
