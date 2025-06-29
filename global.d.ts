/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  import React from 'react';

  const SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '@cypress/grep/src/plugin' {
  const plugin: any;
  export default plugin;
}

declare const __NODE_ENV__: 'production' | 'development';
declare const __API_URL__: string;
