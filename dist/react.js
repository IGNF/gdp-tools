import { $ as e, C as t, Ct as n, D as r, Ht as i, Ot as a, Q as o, S as s, T as c, Wt as l, b as u, bt as d, et as f, it as p, jt as m, k as h, n as g, o as _, rt as v, t as y, tt as b, u as x, wt as S, xt as C } from "./geodesyPointReportContext-CmEyb00K.js";
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
	if (e.mode === "single") {
		e.onActiveIdChange(t);
		return;
	}
	e.onToggle(t);
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
function H({ visibility: e, onToggle: t, catalog: n = i, groupLabel: r = "Géodésie", className: a }) {
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
		className: a
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
		if (!n) {
			t(null);
			return;
		}
		if (typeof e == "string" && e.length > 0) {
			t(e);
			return;
		}
		t((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
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
	let r = m(e, t), i = (t) => {
		let i = new Set(r);
		if (i.has(t) ? i.delete(t) : i.add(t), i.size === 0) {
			n("");
			return;
		}
		if (i.size === e.options.length) {
			n(null);
			return;
		}
		n([...i].join(","));
	};
	return /* @__PURE__ */ O("div", {
		className: R.segmented,
		role: "group",
		"aria-label": e.title,
		children: e.options.map((e) => /* @__PURE__ */ O("button", {
			type: "button",
			className: R.segment,
			"data-active": r.has(e.value) ? "true" : void 0,
			"aria-pressed": r.has(e.value),
			onClick: () => i(e.value),
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
			subtitle: _(t, n)
		}
	};
}
function Q(e, t, n) {
	return {
		kind: "geodesy",
		display: g(e, t, n),
		reportContext: y(e, t, {
			...n,
			attributeCatalog: n.attributeCatalog
		})
	};
}
function $(e, t) {
	return {
		attributeCatalog: t.attributeCatalog,
		geodesyCatalog: S(e),
		externalUrlSource: t.externalUrlSource,
		transformExternalUrl: t.transformExternalUrl,
		pictoUrlMaps: t.pictoUrlMaps
	};
}
function re(t, r = {}) {
	let { enabled: i = !0, isMapReady: a = !1, query: s, attributeCatalog: l, externalUrlSource: u, transformExternalUrl: m, pictoUrlMaps: h } = r, [g, _] = P(null), y = A(() => {
		t && d(t), _(null);
	}, [t]), x = A(async (e) => {
		if (!t) return !1;
		let n = t.getPixelFromCoordinate(e);
		if (!n) return !1;
		let r = await o(t, e, n, s);
		if (r.length === 0) return !1;
		let i = $(t, {
			attributeCatalog: l,
			externalUrlSource: u,
			transformExternalUrl: m,
			pictoUrlMaps: h
		});
		return _(Q(r[0], e, i)), !0;
	}, [
		t,
		s,
		l,
		u,
		m,
		h
	]);
	return j(() => {
		if (!t || !i || !a) return;
		let r = 0, o = !1, d = C(t), g = d?.on("select", (i) => {
			let a = i, c = a.selected[0];
			if (!c || !n(c)) return;
			let d = a.mapBrowserEvent, f = c.getGeometry(), p = d?.coordinate ?? (f instanceof w ? f.getCoordinates() : void 0);
			if (!p) return;
			let g = $(t, {
				attributeCatalog: l,
				externalUrlSource: u,
				transformExternalUrl: m,
				pictoUrlMaps: h
			}), v = e(t, c, p, s?.wfs);
			v && (o = !0, r += 1, _(Q(v, p, g)));
		}), y = T(t, "singleclick", (e) => {
			let n = e;
			if (o) {
				o = !1;
				return;
			}
			if ((d?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0) return;
			let i = $(t, {
				attributeCatalog: l,
				externalUrlSource: u,
				transformExternalUrl: m,
				pictoUrlMaps: h
			}), a = s?.preferWfs ?? !0;
			if (a) {
				let e = b(t, n.pixel, s?.wfs);
				if (e.length > 0) {
					_(Q(e[0], n.coordinate, i));
					return;
				}
				let r = v(t, n.pixel, s?.annex);
				if (r.length > 0) {
					_(Q(r[0], n.coordinate, i));
					return;
				}
				if (f(t, n.pixel, s?.wfs)) return;
			}
			(async () => {
				let e = ++r, o = ne(n.coordinate);
				try {
					if (_(o), !c(t)) return;
					let l = await p(t, n.coordinate, s?.wms);
					if (e !== r) return;
					if (l.length > 0) {
						_(Q(l[0], n.coordinate, i));
						return;
					}
					if (!a || f(t, n.pixel, s?.wfs)) return;
					let u = b(t, n.pixel, s?.wfs);
					if (e !== r) return;
					if (u.length > 0) {
						_(Q(u[0], n.coordinate, i));
						return;
					}
					let d = v(t, n.pixel, s?.annex);
					if (e !== r) return;
					d.length > 0 && _(Q(d[0], n.coordinate, i));
				} catch {
					if (e !== r) return;
					_(o);
				}
			})();
		});
		return () => {
			r += 1, g && E(g), E(y);
		};
	}, [
		l,
		i,
		u,
		a,
		t,
		h,
		s,
		m
	]), {
		pendingClick: g,
		clearPendingClick: y,
		openAtCoordinate: x
	};
}
//#endregion
//#region src/react/useGeodesyOnMap.ts
function ie(e, n = {}) {
	let { catalog: i, initialActive: o = ["RBF"], initialWfsAttributeFilterValues: c, popup: d, layers: f, layerIds: p, uiLayerIds: m, dataLayerId: g, networkLayerIds: _, wmsUrl: v, wmsGpOlExt: y, attributes: b, attributeKeys: x, excludedKeys: S, titleKeys: C, labels: w, wfsLayers: T, wfsLayerIds: E, wfsUiLayerIds: D, wfsUrl: O, wfsApiKey: k, wfsDataProjection: N, wfsBboxPaddingRatio: F, wfsUseCacheBuster: I, wfsCluster: L, wfsDomainLayers: R, wfsDomainSourceLayerId: z, wfsAttributeFilters: B, annexLayers: V, annexLayerIds: H, annexUiLayerIds: U } = n, W = M(() => i ?? l({
		layers: f,
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
		i,
		f,
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
	]), G = M(() => W.wfsDomainLayers.length > 0 ? W.wfsDomainLayers : W.wfsUiLayers, [W.wfsDomainLayers, W.wfsUiLayers]), [K, q] = P(() => t(o, W)), [J, Y] = P(() => c ?? a(W.wfsAttributeFilters));
	j(() => {
		if (e) return h(e, {
			catalog: W,
			visibility: K,
			attributeFilterValues: J,
			popup: d
		});
	}, [
		e,
		d,
		W
	]), j(() => {
		e && r(e, K);
	}, [e, K]), j(() => {
		e && s(e, J);
	}, [e, J]);
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
		Y(a(W.wfsAttributeFilters)), e && u(e);
	}, [W.wfsAttributeFilters, e]), ne = M(() => [
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
		let t = x(e, (e) => {
			if (s.current !== null && (window.clearTimeout(s.current), s.current = null), e.isLoading) {
				o.current = Date.now(), l((t) => ({
					...e,
					elapsedMs: t.isLoading ? t.elapsedMs : 0
				}));
				return;
			}
			let t = o.current, n = t === null ? 0 : Date.now() - t, r = Math.max(0, ae - n);
			if (r === 0) {
				o.current = null, l({
					...e,
					elapsedMs: 0
				});
				return;
			}
			l((e) => ({
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
			}, r);
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
