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
	}
});
