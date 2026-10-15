import { A as e, C as t, E as n, Et as r, It as i, Nt as a, O as o, Ot as s, Tt as c, Yt as l, at as u, ct as d, d as f, it as p, kt as m, lt as h, n as g, o as _, ot as v, qt as y, rt as b, s as x, t as S, w as ee, x as te } from "./geodesyPointReportContext-QJxt1m06.js";
import C from "ol/geom/Point";
import { listen as w, unlistenByKey as T } from "ol/events";
import { toLonLat as E } from "ol/proj";
import { jsx as D, jsxs as O } from "react/jsx-runtime";
import { useCallback as k, useEffect as A, useMemo as j, useRef as M, useState as N } from "react";
var P = {
	switcher: "_switcher_jknvk_1",
	groupLabel: "_groupLabel_jknvk_9",
	layerButton: "_layerButton_jknvk_19",
	layerButtonActive: "_layerButtonActive_jknvk_32"
}, F = {
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
}, I = {
	titleRow: "_titleRow_1al4w_1",
	titlePicto: "_titlePicto_1al4w_8",
	titleText: "_titleText_1al4w_15"
}, L = {
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
function R(e, t) {
	return e.mode === "single" ? e.activeId === t : !!e.activeIds[t];
}
function z(e, t) {
	e.mode === "single" ? e.onActiveIdChange(t) : e.onToggle(t);
}
function B(e) {
	let { options: t, groupLabel: n, className: r } = e, i = r ? `${P.switcher} ${r}` : P.switcher;
	return /* @__PURE__ */ O("div", {
		className: i,
		role: "group",
		"aria-label": n,
		children: [n ? /* @__PURE__ */ D("span", {
			className: P.groupLabel,
			children: n
		}) : null, t.map((t) => {
			let n = R(e, t.id);
			return /* @__PURE__ */ D("button", {
				type: "button",
				title: t.title,
				className: `${P.layerButton} ${n ? P.layerButtonActive : ""}`,
				"aria-pressed": e.mode === "multiple" ? n : void 0,
				onClick: () => z(e, t.id),
				children: t.label
			}, t.id);
		})]
	});
}
//#endregion
//#region src/react/GeodesyLayerSwitcher.tsx
function V({ visibility: e, onToggle: t, catalog: n = y, groupLabel: r = "Géodésie", className: i }) {
	let a = n.uiLayers.map((e) => ({
		id: e.id,
		label: e.shortLabel,
		title: e.title
	})), o = Object.fromEntries(a.map((t) => [t.id, e[t.id] ?? !1]));
	return /* @__PURE__ */ D(B, {
		mode: "multiple",
		groupLabel: r,
		options: a,
		activeIds: o,
		onToggle: (e) => t(e),
		className: i
	});
}
//#endregion
//#region src/react/GeodesyPointDetails.tsx
function H({ states: e }) {
	return /* @__PURE__ */ D("span", {
		className: F.dispoStates,
		role: "img",
		"aria-label": "Disponibilité",
		children: e.map((e, t) => /* @__PURE__ */ D("span", {
			className: e === "available" ? F.dispoDotAvailable : F.dispoDotUnavailable,
			"aria-hidden": "true"
		}, `${e}-${t}`))
	});
}
function U({ attribute: e }) {
	let [t, n] = N(!1), r = e.displayImageUrl ?? e.imageUrl;
	return e.dispoStates?.length ? /* @__PURE__ */ D(H, { states: e.dispoStates }) : r && !t ? /* @__PURE__ */ O("div", {
		className: F.imageBlock,
		children: [
			/* @__PURE__ */ D("a", {
				href: e.href ?? r,
				target: "_blank",
				rel: "noopener noreferrer",
				className: F.imageLink,
				title: `Ouvrir ${e.label}`,
				children: /* @__PURE__ */ D("img", {
					src: r,
					alt: e.label,
					className: F.imageThumb,
					loading: "lazy",
					onError: () => n(!0)
				})
			}),
			e.isPicto ? /* @__PURE__ */ D("span", {
				className: F.pictoCode,
				children: e.value
			}) : null,
			e.href && !e.isPicto ? /* @__PURE__ */ D("a", {
				href: e.href,
				target: "_blank",
				rel: "noopener noreferrer",
				className: F.imageOpenLink,
				children: "Ouvrir l'image"
			}) : null
		]
	}) : e.href ? /* @__PURE__ */ D("a", {
		href: e.href,
		target: "_blank",
		rel: "noopener noreferrer",
		children: e.value
	}) : e.value;
}
function W({ layerTitle: e, longitude: t, latitude: n, attributes: r, showMeta: i = !0 }) {
	return /* @__PURE__ */ O("div", {
		className: F.details,
		children: [i ? /* @__PURE__ */ O("p", {
			className: F.meta,
			children: [
				e,
				" · ",
				n.toFixed(5),
				"° N, ",
				t.toFixed(5),
				"° E"
			]
		}) : null, r.length > 0 ? /* @__PURE__ */ D("dl", {
			className: F.attributeList,
			children: r.map((e, t) => /* @__PURE__ */ O("div", {
				className: F.attributeRow,
				children: [/* @__PURE__ */ D("dt", { children: e.label }), /* @__PURE__ */ D("dd", { children: /* @__PURE__ */ D(U, { attribute: e }) })]
			}, `${e.label}-${e.value}-${t}`))
		}) : /* @__PURE__ */ D("p", {
			className: F.empty,
			children: "Aucun attribut disponible pour ce point."
		})]
	});
}
//#endregion
//#region src/react/GeodesyPointTitle.tsx
function G({ title: e, picto: t, className: n }) {
	let [r, i] = N(!1), a = t?.displayImageUrl ?? t?.imageUrl, o = t && a && !r;
	return /* @__PURE__ */ O("span", {
		className: [I.titleRow, n].filter(Boolean).join(" "),
		children: [o ? /* @__PURE__ */ D("img", {
			src: a,
			alt: "",
			className: I.titlePicto,
			loading: "lazy",
			onError: () => i(!0)
		}) : null, /* @__PURE__ */ D("span", {
			className: I.titleText,
			children: e
		})]
	});
}
//#endregion
//#region src/react/GeodesyWfsAttributeFiltersPanel.tsx
function K(e, t, n) {
	return {
		...e,
		[t]: n
	};
}
function q({ definition: e, value: t, onChange: n }) {
	let r = e.trueLabel ?? "Oui", i = e.falseLabel ?? "Non";
	return /* @__PURE__ */ O("div", {
		className: L.segmented,
		role: "group",
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ D("button", {
				type: "button",
				className: L.segment,
				"data-active": t == null ? "true" : void 0,
				onClick: () => n(null),
				children: "Tous"
			}),
			/* @__PURE__ */ D("button", {
				type: "button",
				className: L.segment,
				"data-active": t === !0 ? "true" : void 0,
				onClick: () => n(!0),
				children: r
			}),
			/* @__PURE__ */ D("button", {
				type: "button",
				className: L.segment,
				"data-active": t === !1 ? "true" : void 0,
				onClick: () => n(!1),
				children: i
			})
		]
	});
}
function J({ value: e, onChange: t }) {
	let n = typeof e == "string", r = (n) => {
		n ? typeof e == "string" && e.length > 0 ? t(e) : t((/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) : t(null);
	};
	return /* @__PURE__ */ O("div", {
		className: L.dateRow,
		children: [/* @__PURE__ */ O("label", {
			className: L.checkboxLabel,
			children: [/* @__PURE__ */ D("input", {
				type: "checkbox",
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), "Activer"]
		}), /* @__PURE__ */ D("input", {
			type: "date",
			className: L.dateInput,
			value: typeof e == "string" ? e : "",
			disabled: !n,
			onChange: (e) => t(e.target.value || null)
		})]
	});
}
function Y({ definition: e, value: t, onChange: n }) {
	let r = typeof t == "string";
	return /* @__PURE__ */ O("div", {
		className: L.textRow,
		children: [/* @__PURE__ */ O("label", {
			className: L.checkboxLabel,
			children: [/* @__PURE__ */ D("input", {
				type: "checkbox",
				checked: r,
				onChange: (e) => n(e.target.checked ? String(t ?? "") : null)
			}), "Activer"]
		}), /* @__PURE__ */ D("input", {
			type: "text",
			className: L.textInput,
			value: typeof t == "string" ? t : "",
			disabled: !r,
			placeholder: e.placeholder ?? "",
			onChange: (e) => n(e.target.value || null)
		})]
	});
}
function X({ definition: e, value: t, onChange: n }) {
	return /* @__PURE__ */ O("select", {
		className: L.select,
		value: typeof t == "string" ? t : "",
		onChange: (e) => n(e.target.value || null),
		children: [/* @__PURE__ */ D("option", {
			value: "",
			children: "Tous"
		}), e.options.map((e) => /* @__PURE__ */ D("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
}
function Z({ definition: e, value: t, onChange: n }) {
	let r = i(e, t), a = (t) => {
		let i = new Set(r);
		i.has(t) ? i.delete(t) : i.add(t), i.size === 0 ? n("") : i.size === e.options.length ? n(null) : n([...i].join(","));
	};
	return /* @__PURE__ */ D("div", {
		className: L.segmented,
		role: "group",
		"aria-label": e.title,
		children: e.options.map((e) => /* @__PURE__ */ D("button", {
			type: "button",
			className: L.segment,
			"data-active": r.has(e.value) ? "true" : void 0,
			"aria-pressed": r.has(e.value),
			onClick: () => a(e.value),
			children: e.label
		}, e.value))
	});
}
function ne({ filters: e, values: t, onChange: n, onClear: r, className: i }) {
	return e.length ? /* @__PURE__ */ O("div", {
		className: [L.panel, i].filter(Boolean).join(" "),
		children: [e.map((e) => /* @__PURE__ */ O("div", {
			className: L.filterRow,
			children: [
				/* @__PURE__ */ D("span", {
					className: L.filterLabel,
					children: e.title
				}),
				e.type === "boolean" ? /* @__PURE__ */ D(q, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(K(t, e.id, r))
				}) : null,
				e.type === "date" ? /* @__PURE__ */ D(J, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(K(t, e.id, r))
				}) : null,
				e.type === "text" ? /* @__PURE__ */ D(Y, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(K(t, e.id, r))
				}) : null,
				e.type === "choice" ? /* @__PURE__ */ D(X, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(K(t, e.id, r))
				}) : null,
				e.type === "multiChoice" ? /* @__PURE__ */ D(Z, {
					definition: e,
					value: t[e.id],
					onChange: (r) => n(K(t, e.id, r))
				}) : null
			]
		}, e.id)), r ? /* @__PURE__ */ D("button", {
			type: "button",
			className: L.clearButton,
			onClick: r,
			children: "Réinitialiser les filtres"
		}) : null]
	}) : null;
}
//#endregion
//#region src/react/useGeodesyMapClick.ts
function re(e) {
	let [t, n] = E(e);
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
	return x(e, n), {
		kind: "geodesy",
		display: g(e, t, n),
		reportContext: S(e, t, {
			...n,
			attributeCatalog: n.attributeCatalog
		})
	};
}
function $(e, t) {
	return {
		attributeCatalog: t.attributeCatalog,
		geodesyCatalog: m(e),
		externalUrlSource: t.externalUrlSource,
		transformExternalUrl: t.transformExternalUrl,
		pictoUrlMaps: t.pictoUrlMaps
	};
}
function ie(e, t = {}) {
	let { enabled: i = !0, isMapReady: a = !1, query: o, attributeCatalog: l, externalUrlSource: f, transformExternalUrl: m, pictoUrlMaps: g } = t, [_, y] = N(null), x = k(() => {
		e && c(e), y(null);
	}, [e]), S = k(async (t) => {
		if (!e) return !1;
		let n = e.getPixelFromCoordinate(t);
		if (!n) return !1;
		let r = await b(e, t, n, o);
		if (r.length === 0) return !1;
		let i = $(e, {
			attributeCatalog: l,
			externalUrlSource: f,
			transformExternalUrl: m,
			pictoUrlMaps: g
		});
		return y(Q(r[0], t, i)), !0;
	}, [
		e,
		o,
		l,
		f,
		m,
		g
	]);
	return A(() => {
		if (!e || !i || !a) return;
		let t = 0, c = !1, _ = r(e), b = _?.on("select", (n) => {
			let r = n, i = r.selected[0];
			if (!i || !s(i)) return;
			let a = r.mapBrowserEvent, u = i.getGeometry(), d = a?.coordinate ?? (u instanceof C ? u.getCoordinates() : void 0);
			if (!d) return;
			let h = $(e, {
				attributeCatalog: l,
				externalUrlSource: f,
				transformExternalUrl: m,
				pictoUrlMaps: g
			}), _ = p(e, i, d, o?.wfs);
			_ && (c = !0, t += 1, y(Q(_, d, h)));
		}), x = w(e, "singleclick", (r) => {
			let i = r;
			if (c) {
				c = !1;
				return;
			}
			if ((_?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0) return;
			let a = $(e, {
				attributeCatalog: l,
				externalUrlSource: f,
				transformExternalUrl: m,
				pictoUrlMaps: g
			}), s = o?.preferWfs ?? !0;
			if (s) {
				let t = v(e, i.pixel, o?.wfs);
				if (t.length > 0) {
					y(Q(t[0], i.coordinate, a));
					return;
				}
				let n = d(e, i.pixel, o?.annex);
				if (n.length > 0) {
					y(Q(n[0], i.coordinate, a));
					return;
				}
				if (u(e, i.pixel, o?.wfs)) return;
			}
			(async () => {
				let r = ++t, c = re(i.coordinate);
				try {
					if (y(c), !n(e)) return;
					let l = await h(e, i.coordinate, o?.wms);
					if (r !== t) return;
					if (l.length > 0) {
						y(Q(l[0], i.coordinate, a));
						return;
					}
					if (!s || u(e, i.pixel, o?.wfs)) return;
					let f = v(e, i.pixel, o?.wfs);
					if (r !== t) return;
					if (f.length > 0) {
						y(Q(f[0], i.coordinate, a));
						return;
					}
					let p = d(e, i.pixel, o?.annex);
					if (r !== t) return;
					p.length > 0 && y(Q(p[0], i.coordinate, a));
				} catch {
					if (r !== t) return;
					y(c);
				}
			})();
		});
		return () => {
			t += 1, b && T(b), T(x);
		};
	}, [
		l,
		i,
		f,
		a,
		e,
		g,
		o,
		m
	]), {
		pendingClick: _,
		clearPendingClick: x,
		openAtCoordinate: S
	};
}
//#endregion
//#region src/react/useGeodesyOnMap.ts
function ae(n, r = {}) {
	let { catalog: i, initialActive: s = ["RBF"], initialWfsAttributeFilterValues: c, popup: u, layers: d, layerIds: f, uiLayerIds: p, dataLayerId: m, networkLayerIds: h, wmsUrl: g, wmsGpOlExt: _, attributes: v, attributeKeys: y, excludedKeys: b, titleKeys: x, labels: S, wfsLayers: C, wfsLayerIds: w, wfsUiLayerIds: T, wfsUrl: E, wfsApiKey: D, wfsDataProjection: O, wfsBboxPaddingRatio: M, wfsUseCacheBuster: P, wfsCluster: F, wfsDomainLayers: I, wfsDomainSourceLayerId: L, wfsAttributeFilters: R, annexLayers: z, annexLayerIds: B, annexUiLayerIds: V } = r, H = j(() => i ?? l({
		layers: d,
		layerIds: f,
		uiLayerIds: p,
		dataLayerId: m,
		networkLayerIds: h,
		wmsUrl: g,
		wmsGpOlExt: _,
		attributes: v,
		attributeKeys: y,
		excludedKeys: b,
		titleKeys: x,
		labels: S,
		wfsLayers: C,
		wfsLayerIds: w,
		wfsUiLayerIds: T,
		wfsUrl: E,
		wfsApiKey: D,
		wfsDataProjection: O,
		wfsBboxPaddingRatio: M,
		wfsUseCacheBuster: P,
		wfsCluster: F,
		wfsDomainLayers: I,
		wfsDomainSourceLayerId: L,
		wfsAttributeFilters: R,
		annexLayers: z,
		annexLayerIds: B,
		annexUiLayerIds: V
	}), [
		i,
		d,
		f,
		p,
		m,
		h,
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
		M,
		P,
		F,
		I,
		L,
		R,
		z,
		B,
		V
	]), U = j(() => H.wfsDomainLayers.length > 0 ? H.wfsDomainLayers : H.wfsUiLayers, [H.wfsDomainLayers, H.wfsUiLayers]), [W, G] = N(() => ee(s, H)), [K, q] = N(() => c ?? a(H.wfsAttributeFilters));
	A(() => {
		if (n) return e(n, {
			catalog: H,
			visibility: W,
			attributeFilterValues: K,
			popup: u
		});
	}, [
		n,
		u,
		H
	]), A(() => {
		n && o(n, W);
	}, [n, W]), A(() => {
		n && t(n, K);
	}, [n, K]);
	let J = k((e) => {
		let t = H.uiLayers.some((t) => t.id === e) || H.wfsUiLayers.some((t) => t.id === e) || H.wfsDomainLayers.some((t) => t.id === e) || H.annexUiLayers.some((t) => t.id === e);
		G((n) => ({
			...n,
			[e]: t ? !n[e] : n[e]
		}));
	}, [
		H.uiLayers,
		H.wfsUiLayers,
		H.wfsDomainLayers,
		H.annexUiLayers
	]), Y = k((e) => {
		G(e);
	}, []), X = k((e) => {
		q(e);
	}, []), Z = k(() => {
		q(a(H.wfsAttributeFilters)), n && te(n);
	}, [H.wfsAttributeFilters, n]), ne = j(() => [
		...H.uiLayers.filter((e) => W[e.id]).map((e) => e.shortLabel),
		...U.filter((e) => W[e.id]).map((e) => e.shortLabel),
		...H.annexUiLayers.filter((e) => W[e.id]).map((e) => e.shortLabel)
	], [
		H.uiLayers,
		H.annexUiLayers,
		U,
		W
	]);
	return {
		catalog: H,
		uiLayers: H.uiLayers,
		uiWfsLayers: U,
		uiAnnexLayers: H.annexUiLayers,
		visibility: W,
		wfsAttributeFilterValues: K,
		setWfsAttributeFilterValues: X,
		clearWfsAttributeFilterValues: Z,
		toggleLayer: J,
		setVisibility: Y,
		activeLabels: ne
	};
}
//#endregion
//#region src/react/useGeodesyWfsLoading.ts
var oe = 400;
function se(e, t) {
	let n = e.wfsDomainLayers.length > 0 ? e.wfsDomainLayers : e.wfsLayers;
	return n.length !== 0 && n.some((e) => t[e.id]);
}
function ce(e, t) {
	let { catalog: n, visibility: r, showIndicator: i = !0 } = t, a = i && se(n, r), o = M(null), s = M(null), [c, l] = N({
		pendingCount: 0,
		isLoading: !1,
		elapsedMs: 0
	});
	return A(() => {
		if (!e || !a) {
			o.current = null, s.current !== null && (window.clearTimeout(s.current), s.current = null), l({
				pendingCount: 0,
				isLoading: !1,
				elapsedMs: 0
			});
			return;
		}
		let t = f(e, (e) => {
			if (s.current !== null && (window.clearTimeout(s.current), s.current = null), e.isLoading) {
				o.current = Date.now(), l((t) => ({
					...e,
					elapsedMs: t.isLoading ? t.elapsedMs : 0
				}));
				return;
			}
			let t = o.current, n = t === null ? 0 : Date.now() - t, r = Math.max(0, oe - n);
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
	]), A(() => {
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
export { V as GeodesyLayerSwitcher, W as GeodesyPointDetails, G as GeodesyPointTitle, ne as GeodesyWfsAttributeFiltersPanel, B as MapLayerSwitcher, ie as useGeodesyMapClick, ae as useGeodesyOnMap, ce as useGeodesyWfsLoading };
