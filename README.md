# spell-cast-vencord


shitty cheat for spell cast. i spent way too much time on this


# [demo](https://www.youtube.com/watch?v=9S24Pyffes4)


you need to remove all csp and also disable websecurity for this to work.

src\main\patcher.ts Line 71
```diff
  class BrowserWindow extends electron.BrowserWindow {
        constructor(options: BrowserWindowConstructorOptions) {
+            if (!options.webPreferences) options.webPreferences = {};
+            options.webPreferences.webSecurity = false;
            if (options?.webPreferences?.preload && options.title) {
```
