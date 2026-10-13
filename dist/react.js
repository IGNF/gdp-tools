import { C as e, D as t, Dt as n, Ft as r, Jt as i, Kt as a, Mt as o, Ot as s, S as c, T as l, Tt as u, at as d, b as f, ct as p, it as m, k as h, n as g, nt as _, o as v, rt as y, st as b, t as x, u as S, wt as C } from "./geodesyPointReportContext-B03jrT89.js";
import w from "ol/geom/Point";
import { listen as T, unlistenByKey as E } from "ol/events";
import { toLonLat as D } from "ol/proj";
import { jsx as O, jsxs as k } from "react/jsx-runtime";
import { useCallback as A, useEffect as j, useMemo as M, useRef as N, useState as P } from "react";
var F = {
	switcher: "_switcher_jknvk_1",
	groupLabel: "_groupLabel_jknvk_9",
	layerButton: "_layerButton_jknvk_19",
	layerButtonActive: "_layerButtonActive_jknvk_32"
}, I = {
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
}, L = {
	titleRow: "_titleRow_1al4w_1",
	titlePicto: "_titlePicto_1al4w_8",
	titleText: "_titleText_1al4w_15"
}, R = {
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
//#endregion
//#region src/react/MapLayerSwitcher.tsx
function z(e, t) {
	return e.mode === "single" ? e.activeId === t : !!e.activeIds[t];
}
function B(e, t) {
	e.mode === "single" ? e.onActiveIdChange(t) : e.onToggle(t);
}
function V(e) {
	let { options: t, groupLabel: n, className: r } = e, i = r ? `${F.switcher} ${r}` : F.switcher;
	return /* @__PURE__ */ k("div", {
		className: i,
		role: "group",
		"aria-label": n,
		children: [n ? /* @__PURE__ */ O("span", {
			className: F.groupLabel,
			children: n
		}) : null, t.map((t) => {
			let n = z(e, t.id);
			return /* @__PURE__ */ O("button", {
				type: "button",
				title: t.title,
				className: `${F.layerButton} ${n ? F.layerButtonActive : ""}`,
				"aria-pressed": e.mode === "multiple" ? n : void 0,
				onClick: () => B(e, t.id),
				children: t.label
			}, t.id);
		})]
	});
}
//#endregion
//#region src/react/GeodesyLayerSwitcher.tsx
function H({ visibility: e, onToggle: t, catalog: n = a, groupLabel: r = "Géodésie", className: i }) {
	let o = n.uiLayers.map((e) => ({
		id: e.id,
		label: e.shortLabel,
		title: e.title
	})), s = Object.fromEntries(o.map((t) => [t.id, e[t.id] ?? !1]));
	return /* @__PURE__ */ O(V, {
		mode: "multiple",
		groupLabel: r,
		options: o,
		activeIds: s,
		onToggle: (e) => t(e),
		className: i
	});
}
//#endregion
//#region src/react/GeodesyPointDetails.tsx
function U({ states: e }) {
	return /* @__PURE__ */ O("span", {
		className: I.dispoStates,
		role: "img",
		"aria-label": "Disponibilité",
		children: e.map((e, t) => /* @__PURE__ */ O("span", {
			className: e === "available" ? I.dispoDotAvailable : I.dispoDotUnavailable,
			"aria-hidden": "true"
		}, `${e}-${t}`))
	});
}
function W({ attribute: e }) {
	let [t, n] = P(!1), r = e.displayImageUrl ?? e.imageUrl;
	return e.dispoStates?.length ? /* @__PURE__ */ O(U, { states: e.dispoStates }) : r && !t ? /* @__PURE__ */ k("div", {
		className: I.imageBlock,
		children: [
			/* @__PURE__ */ O("a", {
				href: e.href ?? r,
				target: "_blank",
				rel: "noopener noreferrer",
				className: I.imageLink,
				title: `Ouvrir ${e.label}`,
				children: /* @__PURE__ */ O("img", {
					src: r,
					alt: e.label,
					className: I.imageThumb,
					loading: "lazy",
					onError: () => n(!0)
				})
			}),
			e.isPicto ? /* @__PURE__ */ O("span", {
				className: I.pictoCode,
				children: e.value
			}) : null,
			e.href && !e.isPicto ? /* @__PURE__ */ O("a", {
				href: e.href,
				target: "_blank",
				rel: "noopener noreferrer",
				className: I.imageOpenLink,
				children: "Ouvrir l'image"
			}) : null
		]
	}) : e.href ? /* @__PURE__ */ O("a", {
		href: e.href,
		target: "_blank",
		rel: "noopener noreferrer",
		children: e.value
	}) : e.value;
}
function G({ layerTitle: e, longitude: t, latitude: n, attributes: r, showMeta: i = !0 }) {
	return /* @__PURE__ */ k("div", {
		className: I.details,
		children: [i ? /* @__PURE__ */ k("p", {
			className: I.meta,
			children: [
				e,
				" · ",
				n.toFixed(5),
				"° N, ",
				t.toFixed(5),
				"° E"
			]
		}) : null, r.length > 0 ? /* @__PURE__ */ O("dl", {
			className: I.attributeList,
			children: r.map((e, t) => /* @__PURE__ */ k("div", {
				className: I.attributeRow,
				children: [/* @__PURE__ */ O("dt", { children: e.label }), /* @__PURE__ */ O("dd", { children: /* @__PURE__ */ O(W, { attribute: e }) })]
			}, `${e.label}-${e.value}-${t}`))
		}) : /* @__PURE__ */ O("p", {
			className: I.empty,
			children: "Aucun attribut disponible pour ce point."
		})]
	});
}
//#endregion
//#region src/react/GeodesyPointTitle.tsx
function K({ title: e, picto: t, className: n }) {
	let [r, i] = P(!1), a = t?.displayImageUrl ?? t?.imageUrl, o = t && a && !r;
	return /* @__PURE__ */ k("span", {
		className: [L.titleRow, n].filter(Boolean).join(" "),
		children: [o ? /* @__PURE__ */ O("img", {
			src: a,
			alt: "",
			className: L.titlePicto,
			loading: "lazy",
			onError: () => i(!0)
		}) : null, /* @__PURE__ */ O("span", {
			className: L.titleText,
			children: e
		})]
	});
}
//#endregion
//#region src/react/GeodesyWfsAttributeFiltersPanel.tsx
function q(e, t, n) {
	return {
		...e,
		[t]: n
	};
}
function J({ definition: e, value: t, onChange: n }) {
	let r = e.trueLabel ?? "Oui", i = e.falseLabel ?? "Non";
	return /* @__PURE__ */ k("div", {
		className: R.segmented,
		role: "group",
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ O("button", {
				type: "button",
				className: R.segment,
				"data-active": t == null ? "true" : void 0,
				onClick: () => n(null),
				children: "Tous"
			}),
			/* @__PURE__ */ O("button", {
				type: "button",
				className: R.segment,
				"data-active": t === !0 ? "true" : void 0,
				onClick: () => n(!0),
				children: r
			}),
			/* @__PURE__ */ O("button", {
				type: "button",
				className: R.segment,
				"data-active": t === !1 ? "true" : void 0,
				onClick: () => n(!1),
				children: i
			})
		]
	});
}
function Y({ value: e, onChange: t }) {
	let n = typeof e == "string", r = (n) => {
		n ? typeof e == "string" && e.length > 0 ? t(e) : t((/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) : t(null);
	};
	return /* @__PURE__ */ k("div", {
		className: R.dateRow,
		children: [/* @__PURE__ */ k("label", {
			className: R.checkboxLabel,
			children: [/* @__PURE__ */ O("input", {
				type: "checkbox",
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), "Activer"]
		}), /* @__PURE__ */ O("input", {
			type: "date",
			className: R.dateInput,
			value: typeof e == "string" ? e : "",
			disabled: !n,
			onChange: (e) => t(e.target.value || null)
		})]
	});
}
function X({ definition: e, value: t, onChange: n }) {
	let r = typeof t == "string";
	return /* @__PURE__ */ k("div", {
		className: R.textRow,
		children: [/* @__PURE__ */ k("label", {
			className: R.checkboxLabel,
			children: [/* @__PURE__ */ O("input", {
				type: "checkbox",
				checked: r,
				onChange: (e) => n(e.target.checked ? String(t ?? "") : null)
			}), "Activer"]
		}), /* @__PURE__ */ O("input", {
			type: "text",
			className: R.textInput,
			value: typeof t == "string" ? t : "",
			disabled: !r,
			placeholder: e.placeholder ?? "",
			onChange: (e) => n(e.target.value || null)
		})]
	});
}
function Z({ definition: e, value: t, onChange: n }) {
	return /* @__PURE__ */ k("select", {
		className: R.select,
		value: typeof t == "string" ? t : "",
		onChange: (e) => n(e.target.value || null),
		children: [/* @__PURE__ */ O("option", {
			value: "",
			children: "Tous"
		}), e.options.map((e) => /* @__PURE__ */ O("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
}
function ee({ definition: e, value: t, onChange: n }) {
	let i = r(e, t), a = (t) => {
		let r = new Set(i);
		r.has(t) ? r.delete(t) : r.add(t), r.size === 0 ? n("") : r.size === e.options.length ? n(null) : n([...r].join(","));
	};
	return /* @__PURE__ */ O("div", {
		className: R.segmented,
		role: "group",
		"aria-label": e.title,
		children: e.options.map((e) => /* @__PURE__ */ O("button", {
			type: "button",
			className: R.segment,
			"data-active": i.has(e.value) ? "true" : void 0,
			"aria-pressed": i.has(e.value),
			onClick: () => a(e.value),
			children: e.label
		}, e.value))
	});
}
function te({ filters: e, values: t, onChange: n, onClear: r, className: i }) {
	return e.length ? /* @__PURE__ */ k("div", {
		className: [R.panel, i].filter(Boolean).join(" "),
		children: [e.map((e) => /* @__PURE__ */ k("div", {
			className: R.filterRow,
			children: [
				/* @__PURE__ */ O("span", {
					className: R.filterLabel,
					children: e.title
				}),
				e.type === "boolean" ? /* @__PURE__ */ O(J, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(q(t, e.id, r))
				}) : null,
				e.type === "date" ? /* @__PURE__ */ O(Y, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(q(t, e.id, r))
				}) : null,
				e.type === "text" ? /* @__PURE__ */ O(X, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(q(t, e.id, r))
				}) : null,
				e.type === "choice" ? /* @__PURE__ */ O(Z, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(q(t, e.id, r))
				}) : null,
				e.type === "multiChoice" ? /* @__PURE__ */ O(ee, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(q(t, e.id, r))
				}) : null
			]
		}, e.id)), r ? /* @__PURE__ */ O("button", {
			type: "button",
			className: R.clearButton,
			onClick: r,
			children: "Réinitialiser les filtres"
		}) : null]
	}) : null;
}
//#endregion
//#region src/react/useGeodesyMapClick.ts
function ne(e) {
	let [t, n] = D(e);
	return {
		kind: "coordinate",
		coordinate: {
			longitude: t,
			latitude: n,
			subtitle: v(t, n)
		}
	};
}
function Q(e, t, n) {
	return {
		kind: "geodesy",
		display: g(e, t, n),
		reportContext: x(e, t, {
			...n,
			attributeCatalog: n.attributeCatalog
		})
	};
}
function $(e, t) {
	return {
		attributeCatalog: t.attributeCatalog,
		geodesyCatalog: s(e),
		externalUrlSource: t.externalUrlSource,
		transformExternalUrl: t.transformExternalUrl,
		pictoUrlMaps: t.pictoUrlMaps
	};
}
function re(e, t = {}) {
	let { enabled: r = !0, isMapReady: i = !1, query: a, attributeCatalog: o, externalUrlSource: s, transformExternalUrl: c, pictoUrlMaps: f } = t, [h, g] = P(null), v = A(() => {
		e && C(e), g(null);
	}, [e]), x = A(async (t) => {
		if (!e) return !1;
		let n = e.getPixelFromCoordinate(t);
		if (!n) return !1;
		let r = await _(e, t, n, a);
		if (r.length === 0) return !1;
		let i = $(e, {
			attributeCatalog: o,
			externalUrlSource: s,
			transformExternalUrl: c,
			pictoUrlMaps: f
		});
		return g(Q(r[0], t, i)), !0;
	}, [
		e,
		a,
		o,
		s,
		c,
		f
	]);
	return j(() => {
		if (!e || !r || !i) return;
		let t = 0, h = !1, _ = u(e), v = _?.on("select", (r) => {
			let i = r, l = i.selected[0];
			if (!l || !n(l)) return;
			let u = i.mapBrowserEvent, d = l.getGeometry(), p = u?.coordinate ?? (d instanceof w ? d.getCoordinates() : void 0);
			if (!p) return;
			let m = $(e, {
				attributeCatalog: o,
				externalUrlSource: s,
				transformExternalUrl: c,
				pictoUrlMaps: f
			}), _ = y(e, l, p, a?.wfs);
			_ && (h = !0, t += 1, g(Q(_, p, m)));
		}), x = T(e, "singleclick", (n) => {
			let r = n;
			if (h) {
				h = !1;
				return;
			}
			if ((_?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0) return;
			let i = $(e, {
				attributeCatalog: o,
				externalUrlSource: s,
				transformExternalUrl: c,
				pictoUrlMaps: f
			}), u = a?.preferWfs ?? !0;
			if (u) {
				let t = d(e, r.pixel, a?.wfs);
				if (t.length > 0) {
					g(Q(t[0], r.coordinate, i));
					return;
				}
				let n = b(e, r.pixel, a?.annex);
				if (n.length > 0) {
					g(Q(n[0], r.coordinate, i));
					return;
				}
				if (m(e, r.pixel, a?.wfs)) return;
			}
			(async () => {
				let n = ++t, o = ne(r.coordinate);
				try {
					if (g(o), !l(e)) return;
					let s = await p(e, r.coordinate, a?.wms);
					if (n !== t) return;
					if (s.length > 0) {
						g(Q(s[0], r.coordinate, i));
						return;
					}
					if (!u || m(e, r.pixel, a?.wfs)) return;
					let c = d(e, r.pixel, a?.wfs);
					if (n !== t) return;
					if (c.length > 0) {
						g(Q(c[0], r.coordinate, i));
						return;
					}
					let f = b(e, r.pixel, a?.annex);
					if (n !== t) return;
					f.length > 0 && g(Q(f[0], r.coordinate, i));
				} catch {
					if (n !== t) return;
					g(o);
				}
			})();
		});
		return () => {
			t += 1, v && E(v), E(x);
		};
	}, [
		o,
		r,
		s,
		i,
		e,
		f,
		a,
		c
	]), {
		pendingClick: h,
		clearPendingClick: v,
		openAtCoordinate: x
	};
}
//#endregion
//#region src/react/useGeodesyOnMap.ts
function ie(n, r = {}) {
	let { catalog: a, initialActive: s = ["RBF"], initialWfsAttributeFilterValues: l, popup: u, layers: d, layerIds: p, uiLayerIds: m, dataLayerId: g, networkLayerIds: _, wmsUrl: v, wmsGpOlExt: y, attributes: b, attributeKeys: x, excludedKeys: S, titleKeys: C, labels: w, wfsLayers: T, wfsLayerIds: E, wfsUiLayerIds: D, wfsUrl: O, wfsApiKey: k, wfsDataProjection: N, wfsBboxPaddingRatio: F, wfsUseCacheBuster: I, wfsCluster: L, wfsDomainLayers: R, wfsDomainSourceLayerId: z, wfsAttributeFilters: B, annexLayers: V, annexLayerIds: H, annexUiLayerIds: U } = r, W = M(() => a ?? i({
		layers: d,
		layerIds: p,
		uiLayerIds: m,
		dataLayerId: g,
		networkLayerIds: _,
		wmsUrl: v,
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
		wfsDataProjection: N,
		wfsBboxPaddingRatio: F,
		wfsUseCacheBuster: I,
		wfsCluster: L,
		wfsDomainLayers: R,
		wfsDomainSourceLayerId: z,
		wfsAttributeFilters: B,
		annexLayers: V,
		annexLayerIds: H,
		annexUiLayerIds: U
	}), [
		a,
		d,
		p,
		m,
		g,
		_,
		v,
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
		N,
		F,
		I,
		L,
		R,
		z,
		B,
		V,
		H,
		U
	]), G = M(() => W.wfsDomainLayers.length > 0 ? W.wfsDomainLayers : W.wfsUiLayers, [W.wfsDomainLayers, W.wfsUiLayers]), [K, q] = P(() => e(s, W)), [J, Y] = P(() => l ?? o(W.wfsAttributeFilters));
	j(() => {
		if (n) return h(n, {
			catalog: W,
			visibility: K,
			attributeFilterValues: J,
			popup: u
		});
	}, [
		n,
		u,
		W
	]), j(() => {
		n && t(n, K);
	}, [n, K]), j(() => {
		n && c(n, J);
	}, [n, J]);
	let X = A((e) => {
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
	]), Z = A((e) => {
		q(e);
	}, []), ee = A((e) => {
		Y(e);
	}, []), te = A(() => {
		Y(o(W.wfsAttributeFilters)), n && f(n);
	}, [W.wfsAttributeFilters, n]), ne = M(() => [
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
		setWfsAttributeFilterValues: ee,
		clearWfsAttributeFilterValues: te,
		toggleLayer: X,
		setVisibility: Z,
		activeLabels: ne
	};
}
//#endregion
//#region src/react/useGeodesyWfsLoading.ts
var ae = 400;
function oe(e, t) {
	let n = e.wfsDomainLayers.length > 0 ? e.wfsDomainLayers : e.wfsLayers;
	return n.length !== 0 && n.some((e) => t[e.id]);
}
function se(e, t) {
	let { catalog: n, visibility: r, showIndicator: i = !0 } = t, a = i && oe(n, r), o = N(null), s = N(null), [c, l] = P({
		pendingCount: 0,
		isLoading: !1,
		elapsedMs: 0
	});
	return j(() => {
		if (!e || !a) {
			o.current = null, s.current !== null && (window.clearTimeout(s.current), s.current = null), l({
				pendingCount: 0,
				isLoading: !1,
				elapsedMs: 0
			});
			return;
		}
		let t = S(e, (e) => {
			if (s.current !== null && (window.clearTimeout(s.current), s.current = null), e.isLoading) {
				o.current = Date.now(), l((t) => ({
					...e,
					elapsedMs: t.isLoading ? t.elapsedMs : 0
				}));
				return;
			}
			let t = o.current, n = t === null ? 0 : Date.now() - t, r = Math.max(0, ae - n);
			r === 0 ? (o.current = null, l({
				...e,
				elapsedMs: 0
			})) : (l((e) => ({
				...e,
				pendingCount: 0,
				isLoading: !0,
				elapsedMs: n
			})), s.current = window.setTimeout(() => {
				o.current = null, s.current = null, l({
					pendingCount: 0,
					isLoading: !1,
					elapsedMs: 0
				});
			}, r));
		});
		return () => {
			t(), s.current !== null && (window.clearTimeout(s.current), s.current = null);
		};
	}, [
		e,
		a,
		n
	]), j(() => {
		if (!c.isLoading) return;
		let e = window.setInterval(() => {
			let e = o.current;
			e !== null && l((t) => ({
				...t,
				elapsedMs: Date.now() - e
			}));
		}, 200);
		return () => {
			window.clearInterval(e);
		};
	}, [c.isLoading]), c;
}
//#endregion
export { H as GeodesyLayerSwitcher, G as GeodesyPointDetails, K as GeodesyPointTitle, te as GeodesyWfsAttributeFiltersPanel, V as MapLayerSwitcher, re as useGeodesyMapClick, ie as useGeodesyOnMap, se as useGeodesyWfsLoading };
