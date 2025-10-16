"use strict";

// node_modules/trpc-electron/dist/main.mjs
var import_electron = require("electron");
var w = (r) => {
  throw TypeError(r);
};
var L = (r, e, t) => e.has(r) || w("Cannot " + t);
var E = (r, e, t) => (L(r, e, "read from private field"), t ? t.call(r) : e.get(r));
var g = (r, e, t) => (L(r, e, "access private method"), t);
var D = "trpc-electron";
var z;
var K;
(z = Symbol).dispose ?? (z.dispose = Symbol());
(K = Symbol).asyncDispose ?? (K.asyncDispose = Symbol());
var Oe = Symbol();
var q;
var X;
var ee;
var re;
var te;
var se;
typeof window > "u" || "Deno" in window || // eslint-disable-next-line @typescript-eslint/dot-notation
((X = (q = globalThis.process) == null ? void 0 : q.env) == null ? void 0 : X.NODE_ENV) === "test" || (re = (ee = globalThis.process) == null ? void 0 : ee.env) != null && re.JEST_WORKER_ID || (se = (te = globalThis.process) == null ? void 0 : te.env) != null && se.VITEST_WORKER_ID;
var ne;
ne = Symbol.toStringTag;
var y;
var _;
var p;
var k;
var oe;
y = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakSet(), k = function({
  webContentsId: e,
  frameRoutingId: t
}) {
  for (const [s, n] of E(this, _).entries())
    s.startsWith(`${e}-${t ?? ""}`) && (n.abort(), E(this, _).delete(s));
}, oe = function(e) {
  const t = e.webContents.id;
  e.webContents.on("did-start-navigation", ({ isSameDocument: s, frame: n }) => {
    s || g(this, p, k).call(this, {
      webContentsId: t,
      frameRoutingId: n.routingId
    });
  }), e.webContents.on("destroyed", () => {
    this.detachWindow(e, t);
  });
};
var Qe = () => {
  const r = {
    sendMessage: (e) => import_electron.ipcRenderer.send(D, e),
    onMessage: (e) => import_electron.ipcRenderer.on(D, (t, s) => e(s))
  };
  import_electron.contextBridge.exposeInMainWorld("electronTRPC", r);
};

// electron/preload.ts
process.once("loaded", () => {
  Qe();
});
