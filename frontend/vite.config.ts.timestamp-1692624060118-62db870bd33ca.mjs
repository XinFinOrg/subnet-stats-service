// vite.config.ts
import { defineConfig } from "file:///Users/Jerome/hashlab/subnet-stats-service/frontend/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///Users/Jerome/hashlab/subnet-stats-service/frontend/node_modules/vite-plugin-node-polyfills/dist/index.js";
import react from "file:///Users/Jerome/hashlab/subnet-stats-service/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/Jerome/hashlab/subnet-stats-service/frontend/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        "fs"
        // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        // can also be 'build', 'dev', or false
        global: true,
        process: true
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true
    }),
    react(),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvSmVyb21lL2hhc2hsYWIvc3VibmV0LXN0YXRzLXNlcnZpY2UvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9KZXJvbWUvaGFzaGxhYi9zdWJuZXQtc3RhdHMtc2VydmljZS9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvSmVyb21lL2hhc2hsYWIvc3VibmV0LXN0YXRzLXNlcnZpY2UvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtcG9seWZpbGxzJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLycsXG4gIHBsdWdpbnM6IFtcbiAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgIC8vIFRvIGV4Y2x1ZGUgc3BlY2lmaWMgcG9seWZpbGxzLCBhZGQgdGhlbSB0byB0aGlzIGxpc3QuXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdmcycsIC8vIEV4Y2x1ZGVzIHRoZSBwb2x5ZmlsbCBmb3IgYGZzYCBhbmQgYG5vZGU6ZnNgLlxuICAgICAgXSxcbiAgICAgIC8vIFdoZXRoZXIgdG8gcG9seWZpbGwgc3BlY2lmaWMgZ2xvYmFscy5cbiAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgQnVmZmVyOiB0cnVlLCAvLyBjYW4gYWxzbyBiZSAnYnVpbGQnLCAnZGV2Jywgb3IgZmFsc2VcbiAgICAgICAgZ2xvYmFsOiB0cnVlLFxuICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIC8vIFdoZXRoZXIgdG8gcG9seWZpbGwgYG5vZGU6YCBwcm90b2NvbCBpbXBvcnRzLlxuICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxuICAgIH0pLFxuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpXG4gIF0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxTQUFTLG9CQUFvQjtBQUN4VyxTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFHMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBO0FBQUEsTUFFWixTQUFTO0FBQUEsUUFDUDtBQUFBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDUCxRQUFRO0FBQUE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUE7QUFBQSxNQUVBLGlCQUFpQjtBQUFBLElBQ25CLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
