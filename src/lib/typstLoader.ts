/**
 * Consolidated Typst.ts loader utility
 * Handles proper WASM loading for both dev and production builds
 */

import { writable } from 'svelte/store';

let typstInstance: any = null;
let initPromise: Promise<any> | null = null;

// Reactive stores for UI state
export const isReady = writable(false);
export const isInitializing = writable(true); // Start as true to show loading initially

export async function initializeTypst(): Promise<any> {
	// Return existing instance if already initialized
	if (typstInstance) {
		return typstInstance;
	}

	// Return existing promise if already initializing
	if (initPromise) {
		return initPromise;
	}

	isInitializing.set(true);
	console.log('🚀 Initializing Typst renderer...');

	initPromise = (async () => {
		try {
			console.log('Importing Typst.ts API...');
			const { $typst } = await import('@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs');
			console.log('Typst API imported successfully');

			// Import WASM modules with ?url to get proper asset URLs
			console.log('Importing WASM modules...');
			let compilerWasm, rendererWasm;

			try {
				compilerWasm = await import('@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url');
				console.log('Compiler WASM imported successfully');
				console.log('Compiler WASM URL:', compilerWasm.default);
			} catch (e) {
				console.error('Failed to import compiler WASM:', e);
				throw e;
			}

			try {
				rendererWasm = await import('@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url');
				console.log('Renderer WASM imported successfully');
				console.log('Renderer WASM URL:', rendererWasm.default);
			} catch (e) {
				console.error('Failed to import renderer WASM:', e);
				throw e;
			}

			// Test if we can actually fetch these URLs
			try {
				const compilerResponse = await fetch(compilerWasm.default);
				console.log('Compiler fetch status:', compilerResponse.status);
				if (!compilerResponse.ok) {
					throw new Error(`Compiler WASM fetch failed: ${compilerResponse.status}`);
				}
			} catch (e) {
				console.error('Compiler fetch failed:', e);
				throw e;
			}

			try {
				const rendererResponse = await fetch(rendererWasm.default);
				console.log('Renderer fetch status:', rendererResponse.status);
				if (!rendererResponse.ok) {
					throw new Error(`Renderer WASM fetch failed: ${rendererResponse.status}`);
				}
			} catch (e) {
				console.error('Renderer fetch failed:', e);
				throw e;
			}

			// Configure Typst with proper WASM modules
			console.log('Configuring Typst...');
			try {
				$typst.setCompilerInitOptions({
					getModule: () => fetch(compilerWasm.default)
				});
			} catch (e) {
				if (e.message && e.message.includes('already')) {
					console.log('Compiler already initialized, skipping...');
				} else {
					throw e;
				}
			}

			try {
				$typst.setRendererInitOptions({
					getModule: () => fetch(rendererWasm.default)
				});
			} catch (e) {
				if (e.message && e.message.includes('already')) {
					console.log('Renderer already initialized, skipping...');
				} else {
					throw e;
				}
			}

			// Test render to ensure everything is working
			console.log('Testing Typst initialization...');
			const testTemplate = `
#set page(width: auto, height: auto, margin: 5pt)
#set text(size: 14pt)
#set math.equation(numbering: none)
$ x $
			`.trim();

			await $typst.svg({ mainContent: testTemplate });
			console.log('Test render successful');

			typstInstance = $typst;
			isReady.set(true);
			console.log('✅ Typst renderer initialized successfully!');

			return typstInstance;
		} catch (error) {
			console.error('❌ Failed to initialize Typst renderer:', error);
			// Reset state on failure so retry is possible
			initPromise = null;
			isInitializing.set(false);
			throw error;
		} finally {
			isInitializing.set(false);
		}
	})();

	return initPromise;
}

export function getTypstInstance(): any | null {
	return typstInstance;
}
