/**
 * Minimal ambient declarations for the Workers-only globals this worker uses.
 *
 * @cloudflare/workers-types is installed, but adding it to tsconfig's `types`
 * redefines Request/Response/fetch globally and collides with the DOM lib the
 * client code compiles against. Declaring just the surface we touch keeps both
 * halves of the repo type-checking under one tsconfig.
 */
interface HTMLRewriterElement {
  setInnerContent(content: string, options?: { html?: boolean }): void;
  setAttribute(name: string, value: string): void;
  append(content: string, options?: { html?: boolean }): void;
  remove(): void;
}

interface HTMLRewriterElementHandler {
  element?(element: HTMLRewriterElement): void;
}

declare class HTMLRewriter {
  on(selector: string, handler: HTMLRewriterElementHandler): HTMLRewriter;
  transform(response: Response): Response;
}
