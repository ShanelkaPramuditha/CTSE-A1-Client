/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  /** Backend API root including version path, e.g. `http://localhost:3000/api/v1` */
  readonly PUBLIC_API_BASE_URL?: string;
  /** @deprecated Prefer `PUBLIC_API_BASE_URL` */
  readonly PUBLIC_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
