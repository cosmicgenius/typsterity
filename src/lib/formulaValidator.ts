import html2canvas from 'html2canvas';
import pixelmatch from 'pixelmatch';

export async function compareFormulasByRendering(userFormula: string, targetFormula: string, signal?: AbortSignal): Promise<boolean> {
	const startTime = performance.now();
	console.log('🔍 Starting visual comparison...');
	console.log('📝 Input formulas:', { user: userFormula, target: targetFormula });

	try {
		// Check if already aborted
		if (signal?.aborted) {
			throw new Error('AbortError');
		}

		// Import Typst renderer
		const importStart = performance.now();
		console.log('⚡ Importing Typst renderer...');
		const { $typst } = await import('@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs');
		const importEnd = performance.now();
		console.log(`✅ Typst renderer imported (${(importEnd - importStart).toFixed(2)}ms)`);

		// Check if aborted after import
		if (signal?.aborted) {
			throw new Error('AbortError');
		}

		// Clean formulas (remove any dollar signs from user input)
		const userClean = userFormula.replace(/^\$|\$$/g, '').trim();
		const targetClean = targetFormula.replace(/^\$|\$$/g, '').trim();
		console.log('🔧 Cleaned formulas:', { user: userClean, target: targetClean });

		// Render both formulas to SVG with compact page settings and display math
		const compactTemplate = (formula: string) => `
#set page(width: auto, height: auto, margin: 5pt)
#set text(size: 14pt)
#set math.equation(numbering: none)
$ ${formula} $
		`.trim();

		const userRenderStart = performance.now();
		console.log('🎨 Rendering user formula to SVG...');
		const userSvg = await $typst.svg({ mainContent: compactTemplate(userClean) });
		const userRenderEnd = performance.now();
		console.log(`✅ User SVG rendered (${(userRenderEnd - userRenderStart).toFixed(2)}ms), length: ${userSvg.length}`);

		// Check if aborted after user render
		if (signal?.aborted) {
			throw new Error('AbortError');
		}

		const targetRenderStart = performance.now();
		console.log('🎨 Rendering target formula to SVG...');
		const targetSvg = await $typst.svg({ mainContent: compactTemplate(targetClean) });
		const targetRenderEnd = performance.now();
		console.log(`✅ Target SVG rendered (${(targetRenderEnd - targetRenderStart).toFixed(2)}ms), length: ${targetSvg.length}`);

		// Check if aborted after target render
		if (signal?.aborted) {
			throw new Error('AbortError');
		}

		// Ultra-fast check: if SVGs are identical strings, they're definitely the same
		const stringCompareStart = performance.now();
		if (userSvg === targetSvg) {
			const stringCompareEnd = performance.now();
			console.log(`✅ MATCH! SVGs are identical strings (${(stringCompareEnd - stringCompareStart).toFixed(2)}ms) - skipping all other comparisons`);
			return true;
		}
		const stringCompareEnd = performance.now();
		console.log(`📝 SVG strings differ (${(stringCompareEnd - stringCompareStart).toFixed(2)}ms) - proceeding to visual comparison`);

		// Quick size comparison before expensive canvas conversion
		const svgSizeStart = performance.now();

		// Extract SVG dimensions from the SVG strings
		const userSvgMatch = userSvg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
		const targetSvgMatch = targetSvg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);

		if (userSvgMatch && targetSvgMatch) {
			const userWidth = parseFloat(userSvgMatch[1]);
			const userHeight = parseFloat(userSvgMatch[2]);
			const targetWidth = parseFloat(targetSvgMatch[1]);
			const targetHeight = parseFloat(targetSvgMatch[2]);

			console.log('📏 SVG dimensions:', {
				user: { w: userWidth, h: userHeight },
				target: { w: targetWidth, h: targetHeight }
			});

			// Quick size check - if dimensions are different, no need for pixel comparison
			if (Math.abs(userWidth - targetWidth) > 0.1 || Math.abs(userHeight - targetHeight) > 0.1) {
				const svgSizeEnd = performance.now();
				console.log(`❌ Different SVG dimensions (${(svgSizeEnd - svgSizeStart).toFixed(2)}ms) - skipping expensive canvas comparison`);
				return false;
			}
		}

		const svgSizeEnd = performance.now();
		console.log(`✅ SVG dimensions match (${(svgSizeEnd - svgSizeStart).toFixed(2)}ms)`);

		// Log SVG content for debugging (first 200 chars)
		console.log('📄 User SVG preview:', userSvg.substring(0, 200) + '...');
		console.log('📄 Target SVG preview:', targetSvg.substring(0, 200) + '...');

		// Create temporary DOM elements to render
		const domStart = performance.now();
		console.log('🏗️ Creating DOM elements...');
		const userDiv = document.createElement('div');
		const targetDiv = document.createElement('div');

		userDiv.innerHTML = userSvg;
		targetDiv.innerHTML = targetSvg;

		// Style for compact rendering
		userDiv.style.position = 'absolute';
		userDiv.style.left = '-9999px';
		userDiv.style.top = '0px';
		userDiv.style.background = 'white';
		userDiv.style.display = 'inline-block';
		userDiv.style.width = 'fit-content';
		userDiv.style.height = 'fit-content';
		userDiv.style.padding = '10px';

		targetDiv.style.position = 'absolute';
		targetDiv.style.left = '-9999px';
		targetDiv.style.top = '0px';
		targetDiv.style.background = 'white';
		targetDiv.style.display = 'inline-block';
		targetDiv.style.width = 'fit-content';
		targetDiv.style.height = 'fit-content';
		targetDiv.style.padding = '10px';

		document.body.appendChild(userDiv);
		document.body.appendChild(targetDiv);
		const domEnd = performance.now();
		console.log(`✅ DOM elements created and added (${(domEnd - domStart).toFixed(2)}ms)`);

		try {
			// Convert to canvas for pixel comparison
			const userCanvasStart = performance.now();
			console.log('🖼️ Converting user div to canvas...');
			const userCanvas = await html2canvas(userDiv, {
				backgroundColor: 'white',
				scale: 1,
				logging: false
			});
			const userCanvasEnd = performance.now();
			console.log(`✅ User canvas created (${(userCanvasEnd - userCanvasStart).toFixed(2)}ms):`, { w: userCanvas.width, h: userCanvas.height });

			const targetCanvasStart = performance.now();
			console.log('🖼️ Converting target div to canvas...');
			const targetCanvas = await html2canvas(targetDiv, {
				backgroundColor: 'white',
				scale: 1,
				logging: false
			});
			const targetCanvasEnd = performance.now();
			console.log(`✅ Target canvas created (${(targetCanvasEnd - targetCanvasStart).toFixed(2)}ms):`, { w: targetCanvas.width, h: targetCanvas.height });

			// Check dimensions first
			if (userCanvas.width !== targetCanvas.width || userCanvas.height !== targetCanvas.height) {
				console.log('❌ Different dimensions:', {
					user: { w: userCanvas.width, h: userCanvas.height },
					target: { w: targetCanvas.width, h: targetCanvas.height }
				});
				return false;
			}
			console.log('✅ Dimensions match');

			// Get image data
			const imageDataStart = performance.now();
			console.log('📊 Getting image data...');
			const userCtx = userCanvas.getContext('2d');
			const targetCtx = targetCanvas.getContext('2d');

			if (!userCtx || !targetCtx) {
				console.log('❌ Failed to get canvas contexts');
				return false;
			}

			const userData = userCtx.getImageData(0, 0, userCanvas.width, userCanvas.height);
			const targetData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
			const imageDataEnd = performance.now();
			console.log(`✅ Image data extracted (${(imageDataEnd - imageDataStart).toFixed(2)}ms)`);

			// Final abort check before expensive pixel comparison
			if (signal?.aborted) {
				throw new Error('AbortError');
			}

			// Compare pixels
			const pixelCompareStart = performance.now();
			console.log('🔬 Comparing pixels...');
			const diff = pixelmatch(
				userData.data,
				targetData.data,
				null,
				userCanvas.width,
				userCanvas.height,
				{ threshold: 0.1 }
			);
			const pixelCompareEnd = performance.now();

			console.log(`🎯 Pixel difference result: ${diff} (${(pixelCompareEnd - pixelCompareStart).toFixed(2)}ms)`);
			console.log(diff === 0 ? '✅ MATCH! Formulas are identical' : '❌ NO MATCH - formulas differ');

			// For debugging, let's also log some pixel data
			const samplePixels = Math.min(10, userData.data.length / 4);
			console.log('🔍 Sample pixel data (first', samplePixels, 'pixels):');
			for (let i = 0; i < samplePixels; i++) {
				const idx = i * 4;
				console.log(`Pixel ${i}:`, {
					user: [userData.data[idx], userData.data[idx+1], userData.data[idx+2], userData.data[idx+3]],
					target: [targetData.data[idx], targetData.data[idx+1], targetData.data[idx+2], targetData.data[idx+3]]
				});
			}

			return diff === 0;
		} finally {
			// Cleanup
			const cleanupStart = performance.now();
			console.log('🧹 Cleaning up DOM elements...');
			document.body.removeChild(userDiv);
			document.body.removeChild(targetDiv);
			const cleanupEnd = performance.now();
			console.log(`✅ Cleanup complete (${(cleanupEnd - cleanupStart).toFixed(2)}ms)`);
		}

		const totalTime = performance.now() - startTime;
		console.log(`🏁 Total comparison time: ${totalTime.toFixed(2)}ms`);

	} catch (error) {
		const totalTime = performance.now() - startTime;
		console.error(`💥 Error in visual comparison after ${totalTime.toFixed(2)}ms:`, error);
		console.error('Stack trace:', error.stack);
		return false;
	}
}
