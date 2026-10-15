/** Minimal typing for Electron's <webview> tag; the renderer has no electron types and only the archive viewer uses it. */
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ApostrophiWebviewElement extends HTMLElement {
  src: string;
  getWebContentsId(): number;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      webview: DetailedHTMLProps<
        HTMLAttributes<ApostrophiWebviewElement> & {
          src?: string;
          partition?: string;
        },
        ApostrophiWebviewElement
      >;
    }
  }
}
