import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			'@myriaddreamin/typst.ts',
			'@myriaddreamin/typst-ts-renderer',
			'@myriaddreamin/typst-ts-web-compiler'
		]
	},
	server: {
		fs: {
			allow: ['..']
		}
	},
	assetsInclude: [
		'**/typst_ts_web_compiler_bg.wasm',
		'**/typst_ts_renderer_bg.wasm'
	]
});
