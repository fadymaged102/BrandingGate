"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";

/** Renders nothing if WebGL is unavailable or the scene throws, so the page's fallback shows. */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

/** False during SSR and hydration; true afterwards when the browser can draw WebGL. */
export const useWebGL = () => useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
