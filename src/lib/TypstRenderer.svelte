<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeTypst, getTypstInstance } from './typstLoader';

	export let formula: string = '';
	export let width: number = 400;
	export let height: number = 200;

	let svgElement: HTMLDivElement;
	let typstInstance: any = null;
	let isLoading = true;
	let error: string = '';

	onMount(async () => {
		try {
			typstInstance = await initializeTypst();
			isLoading = false;
			if (formula) {
				await renderFormula();
			}
		} catch (err) {
			console.error('Failed to initialize Typst renderer:', err);
			error = `Failed to load Typst renderer: ${err.message}`;
			isLoading = false;
		}
	});

	async function renderFormula() {
		if (!typstInstance || !svgElement || !formula) return;

		try {
			error = '';
			// Clear previous content
			svgElement.innerHTML = '';

			// Use compact template for rendering with display math
			const formulaClean = formula.replace(/^\$|\$$/g, '').trim();
			const compactTemplate = `
#set page(width: auto, height: auto, margin: 5pt)
#set text(size: 18pt)
#set math.equation(numbering: none)
$ ${formulaClean} $
			`.trim();

			// Render the formula using Typst.ts to SVG
			const svgResult = await typstInstance.svg({
				mainContent: compactTemplate
			});

			// Insert the SVG into the container
			svgElement.innerHTML = svgResult;

		} catch (err) {
			console.error('Failed to render formula with Typst:', err);
			error = 'Failed to render formula';
			svgElement.innerHTML = '';
		}
	}

	// Re-render when formula changes
	$: if (typstInstance && formula && !isLoading) {
		renderFormula();
	}
</script>

<div
	bind:this={svgElement}
	class="typst-container"
	style="width: {width}px; min-height: {height}px;"
>
	{#if isLoading}
		<div class="loading">Loading Typst renderer...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if !formula}
		<div class="placeholder">No formula to render</div>
	{/if}
</div>

<style>
	.typst-container {
		border: none;
		background: transparent;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		box-sizing: border-box;
	}

	.typst-container :global(svg) {
		max-width: 100%;
		max-height: 100%;
		height: auto;
	}

	.loading, .error, .placeholder {
		color: #666;
		font-style: italic;
		text-align: center;
	}

	.error {
		color: #e74c3c;
		font-weight: bold;
	}
</style>
