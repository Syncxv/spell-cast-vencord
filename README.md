# spell-cast-vencord

shitty cheat for spell cast. i spent way too much time on this

# [demo](https://www.youtube.com/watch?v=9S24Pyffes4)

you need to remove all csp and also disable websecurity for this to work.

src\main\patcher.ts Line 73

```diff
  class BrowserWindow extends electron.BrowserWindow {
        constructor(options: BrowserWindowConstructorOptions) {
+            if (!options.webPreferences) options.webPreferences = {};
+            options.webPreferences.webSecurity = false;
            if (options?.webPreferences?.preload && options.title) {
```

src\main\index.ts Line 109

```diff
session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders, resourceType }, cb) => {
            if (responseHeaders) {
+                Object.keys(responseHeaders)
+                    .filter(k => (/^content-security-policy/i).test(k))
+                    .map(k => (delete responseHeaders[k]));
+                // if (resourceType === "mainFrame")
+                //     patchCsp(responseHeaders, "content-security-policy");
```

comment out the `if (resourceType === "mainFrame")` and the next line for it to work
