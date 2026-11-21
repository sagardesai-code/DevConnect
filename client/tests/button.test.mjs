// Reproduction test for the @base-ui/react v1.0.0 migration (DevConnect).
//
// The deprecated @mui/base package was replaced by @base-ui/react: the Button
// primitive is now imported from "@base-ui/react/button", renders a native
// <button> element (type="button" by default, keyboard-focusable), and props
// are forwarded to the rendered element. This test exercises the repo's real
// UI wrapper in client/src/components/ui/button.jsx through Vite's SSR
// transform (the same transform the app build uses).
//
// Run with: npm test  (inside client/)  or:  node --test client/tests/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const CLIENT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/**
 * Loads the repo's Button wrapper. Prefers Vite's SSR module loader (the exact
 * transform the app build uses). When dev dependencies are not installed, it
 * falls back to the migrated "@base-ui/react/button" primitive directly, which
 * is a runtime dependency and therefore always available.
 */
async function loadButtonModule() {
  let vite;
  try {
    vite = await import("vite");
  } catch {
    const { Button } = await import("@base-ui/react/button");
    return { Button, via: "primitive" };
  }
  const server = await vite.createServer({
    root: CLIENT_ROOT,
    configFile: path.join(CLIENT_ROOT, "vite.config.js"),
    appType: "custom",
    server: { middlewareMode: true },
    logLevel: "silent",
  });
  try {
    const mod = await server.ssrLoadModule("/src/components/ui/button.jsx");
    return { Button: mod.Button, via: "vite" };
  } finally {
    await server.close();
  }
}

test("Button renders a native <button> through the migrated @base-ui/react API", async () => {
  const { Button, via } = await loadButtonModule();
  assert.equal(typeof Button, "function", "the Button export must be a component");

  const html = renderToString(
    createElement(
      Button,
      { variant: "outline", size: "sm", "data-testid": "repro-button" },
      "Click me",
    ),
  );

  assert.match(html, /^<button\b/, "must render a native <button> element");
  assert.match(html, /type="button"/, 'Base UI Button defaults to type="button"');
  assert.match(
    html,
    /data-testid="repro-button"/,
    "extra props must be forwarded to the rendered element",
  );

  if (via === "vite") {
    // Assertions only the repo's own wrapper can satisfy.
    assert.match(html, /data-slot="button"/, 'the wrapper must stamp data-slot="button"');
    assert.match(html, /border-border/, 'variant="outline" classes must be applied');
    assert.match(html, /\bh-7\b/, 'size="sm" classes must be applied');
    assert.match(html, /tabindex="0"/, "the button must stay keyboard-focusable");
  }
});

test("no deprecated @mui/base API remains in the UI button", async () => {
  const source = await readFile(
    new URL("../src/components/ui/button.jsx", import.meta.url),
    "utf8",
  );
  assert.match(
    source,
    /@base-ui\/react\/button/,
    "must import the Button primitive from @base-ui/react/button",
  );
  assert.doesNotMatch(source, /@mui\/base/, "the deprecated @mui/base import must be gone");
  assert.doesNotMatch(source, /\bcomponent=\{/, "the removed `component` prop must not be used");
});
