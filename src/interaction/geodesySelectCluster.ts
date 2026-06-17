import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import { easeOut } from 'ol/easing';
import { listen, unlistenByKey } from 'ol/events';
import Point from 'ol/geom/Point';
import SelectCluster, { type Options as SelectClusterOptions } from 'ol-ext/interaction/SelectCluster';
// @ts-expect-error ol-ext util sans typings
import getVectorContext from 'ol-ext/util/getVectorContext.js';
// @ts-expect-error ol-ext util sans typings
import getVectorContextStyle from 'ol-ext/util/getVectorContextStyle.js';
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';
import CircleStyle from 'ol/style/Circle';
import Style, { type StyleLike } from 'ol/style/Style';

export interface GeodesySelectClusterOptions extends SelectClusterOptions {
  /** Durée d’éclatement au clic (ms) — indépendante du zoom AnimatedCluster. */
  explosionAnimationDuration?: number;
}

interface GeodesySelectClusterInternals {
  listenerKey_?: EventsKey;
  overlayLayer_: import('ol/layer/Vector').default;
}

type ClusterRenderEvent = {
  vectorContext?: import('ol/render/canvas/Immediate').default;
  frameState: { time: number; animate?: boolean };
  context: CanvasRenderingContext2D;
  inversePixelTransform: number[];
};

function resolveFeatureStyles(
  styleFn: (feature: Feature, resolution: number) => StyleLike,
  feature: Feature,
  resolution: number,
): Style[] {
  const style = styleFn(feature, resolution);
  if (!style) {
    return [];
  }

  if (Array.isArray(style)) {
    return style as Style[];
  }

  if (typeof style === 'function') {
    return [];
  }

  return [style as Style];
}

/**
 * SelectCluster corrigé pour OpenLayers 10 :
 * - durée d’éclatement explicite ({@link explosionAnimationDuration}) ;
 * - ol-ext itère `style.length` — si le style est un objet Style, l’animation ne dessine rien.
 */
export class GeodesySelectCluster extends SelectCluster {
  private readonly explosionDurationMs: number;

  constructor(options: GeodesySelectClusterOptions = {}) {
    const explosionDurationMs =
      options.explosionAnimationDuration ?? options.animationDuration ?? 500;

    super({
      ...options,
      // ol-ext utilise `|| 500` : forcer une valeur explicite (y compris 0).
      animationDuration: explosionDurationMs,
    });

    this.explosionDurationMs = explosionDurationMs;
  }

  // @ts-expect-error signature runtime ol-ext : (center, features[]) ≠ typings @types/ol-ext
  animateCluster_(center: Coordinate, features: Feature<Geometry>[]): void {
    const internals = this as unknown as GeodesySelectClusterInternals;

    if (internals.listenerKey_) {
      unlistenByKey(internals.listenerKey_);
    }

    if (!features.length) {
      return;
    }

    const layerStyle = internals.overlayLayer_.getStyle();
    const styleFn =
      typeof layerStyle === 'function'
        ? layerStyle
        : () => layerStyle as StyleLike;

    const duration = Math.max(0, this.explosionDurationMs);
    const map = this.getMap();
    if (!map) {
      return;
    }

    if (duration === 0) {
      internals.overlayLayer_.getSource()?.addFeatures(features);
      internals.overlayLayer_.changed();
      return;
    }

    const resolution = map.getView().getResolution() ?? 1;
    let animationStart: number | null = null;

    const animate = (event: ClusterRenderEvent) => {
      if (animationStart === null) {
        animationStart = event.frameState.time;
      }

      const vectorContext = event.vectorContext ?? getVectorContext(event);
      const progress = easeOut((event.frameState.time - animationStart) / duration);

      for (const clusterFeature of features) {
        if (!clusterFeature.get('features')) {
          continue;
        }

        const geometry = clusterFeature.getGeometry();
        if (!(geometry instanceof Point)) {
          continue;
        }

        const target = geometry.getCoordinates();
        const animatedFeature = new Feature(
          new Point([
            center[0] + progress * (target[0] - center[0]),
            center[1] + progress * (target[1] - center[1]),
          ]),
        );

        const styles = resolveFeatureStyles(
          styleFn as (feature: Feature, resolution: number) => StyleLike,
          clusterFeature,
          resolution,
        );

        for (const clusterStyle of styles) {
          vectorContext.drawFeature(
            animatedFeature,
            getVectorContextStyle(event, clusterStyle),
          );
        }
      }

      if (progress >= 1) {
        if (internals.listenerKey_) {
          unlistenByKey(internals.listenerKey_);
        }
        internals.overlayLayer_.getSource()?.addFeatures(features);
        internals.overlayLayer_.changed();
        return;
      }

      event.frameState.animate = true;
    };

    internals.listenerKey_ = listen(
      internals.overlayLayer_,
      'postrender',
      animate as unknown as Parameters<typeof listen>[2],
    );

    const ghost = new Feature(new Point(map.getView().getCenter() ?? center));
    ghost.setStyle(new Style({ image: new CircleStyle({ radius: 0.1 }) }));
    internals.overlayLayer_.getSource()?.addFeature(ghost);
  }
}
