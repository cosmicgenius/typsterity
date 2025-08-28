<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TypstRenderer from '$lib/TypstRenderer.svelte';
	import { formulas, type Formula } from '$lib/formulas';
	import { compareFormulasByRendering } from '$lib/formulaValidator';

	let gameStarted = false;
	let gameEnded = false;
	let timeLeft = 180; // 3 minutes
	let currentFormula: Formula | null = null;
	let userInput = '';
	let points = 0;
	let timer: NodeJS.Timeout | null = null;
	let formulaPool: Formula[] = [];
	let currentFormulaIndex = 0;
	let formulaNumber = 1;
	let completedFormulas = 0;
	let showToast = false;
	let autoCheckController: AbortController | null = null;
	let autoCheckTimeout: NodeJS.Timeout | null = null;
	let isAutoChecking = false;
	let typstReady = false;
	let typstInitializing = false;

	function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
		return shuffled;
	}

	function startGame() {
		gameStarted = true;
		gameEnded = false;
		points = 0;
		timeLeft = 180;
		userInput = '';
		currentFormulaIndex = 0;
		formulaNumber = 1;
		completedFormulas = 0;

		// Create a shuffled pool of all formulas
		formulaPool = shuffleArray(formulas);

		loadNextFormula();
		startTimer();
	}

	function startTimer() {
		timer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				endGame();
			}
		}, 1000);
	}

	function endGame() {
		gameStarted = false;
		gameEnded = true;
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		// Cancel any pending auto-check
		cancelAutoCheck();
	}

	function loadNextFormula() {
		if (currentFormulaIndex >= formulaPool.length) {
			// Reshuffle if we've gone through all formulas
			formulaPool = shuffleArray(formulas);
			currentFormulaIndex = 0;
		}

		currentFormula = formulaPool[currentFormulaIndex];
		currentFormulaIndex++;
	}

	function handleCorrectAnswer() {
		if (!currentFormula) return;

		// Award points based on formula length (like TeXnique)
		const pointsEarned = Math.ceil(currentFormula.typst.length / 10);
		points += pointsEarned;
		completedFormulas++;
		console.log(`🎯 Earned ${pointsEarned} points! Total: ${points}`);

		userInput = '';
		loadNextFormula();
		formulaNumber++;
	}

	async function checkAnswer() {
		if (!currentFormula) return;

		// Cancel any pending auto-check since user manually submitted
		cancelAutoCheck();

		try {
			const isMatch = await compareFormulasByRendering(userInput.trim(), currentFormula.typst);

			console.log('Manual check result:', {
				userInput: userInput.trim(),
				target: currentFormula.typst,
				match: isMatch
			});

			if (isMatch) {
				handleCorrectAnswer();
			}
		} catch (error) {
			console.error('Error during manual check:', error);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			event.preventDefault();
			checkAnswer();
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	async function copyResults() {
		const resultsText = `typsterity.xyz | ${completedFormulas} formulas | ${points} points`;

		try {
			await navigator.clipboard.writeText(resultsText);
			console.log('Results copied to clipboard!');

			// Show toast notification
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}


	function cancelAutoCheck() {
		if (autoCheckController) {
			autoCheckController.abort();
			autoCheckController = null;
		}
		if (autoCheckTimeout) {
			clearTimeout(autoCheckTimeout);
			autoCheckTimeout = null;
		}
		isAutoChecking = false;
	}

	function scheduleAutoCheck() {
		// Cancel any pending check
		cancelAutoCheck();

		// Don't auto-check if input is too short
		if (!userInput.trim() || userInput.trim().length < 2) {
			return;
		}

		// Schedule new check with debouncing
		autoCheckTimeout = setTimeout(() => {
			performAutoCheck();
		}, 100); // 100ms debounce
	}

	async function performAutoCheck() {
		if (!currentFormula || !userInput.trim() || isAutoChecking) return;

		try {
			isAutoChecking = true;
			autoCheckController = new AbortController();

			console.log('🤖 Performing auto-check...');
			const isMatch = await compareFormulasByRendering(
				userInput.trim(),
				currentFormula.typst,
				autoCheckController.signal
			);

			// Only proceed if not aborted
			if (!autoCheckController.signal.aborted && isMatch) {
				console.log('🎉 Auto-detected correct answer!');
				handleCorrectAnswer();
			}
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Auto-check error:', error);
			}
		} finally {
			isAutoChecking = false;
			autoCheckController = null;
		}
	}

	// Preload Typst renderer in background
	async function preloadTypst() {
		if (typstReady || typstInitializing) return;

		typstInitializing = true;
		console.log('🚀 Preloading Typst renderer...');

		try {
			// Import and initialize Typst
			const { $typst } = await import('@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs');

			// Configure WASM modules
			$typst.setCompilerInitOptions({
				getModule: () => fetch('/node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm')
			});
			$typst.setRendererInitOptions({
				getModule: () => fetch('/node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm')
			});

			// Test render a simple formula to fully initialize
			const testTemplate = `
#set page(width: auto, height: auto, margin: 5pt)
#set text(size: 14pt)
#set math.equation(numbering: none)
$ x $
			`.trim();

			await $typst.svg({ mainContent: testTemplate });

			typstReady = true;
			console.log('✅ Typst renderer preloaded successfully!');
		} catch (error) {
			console.error('❌ Failed to preload Typst:', error);
		} finally {
			typstInitializing = false;
		}
	}

	// Watch for input changes to trigger auto-check
	$: if (gameStarted && userInput) {
		scheduleAutoCheck();
	}

	onMount(() => {
		// Start preloading Typst in background
		preloadTypst();
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
		cancelAutoCheck();
	});
</script>

<main class="container">
	{#if !gameStarted && !gameEnded}
		<div class="start-page">
			<h1 class="main-title">typsterity</h1>

			<p class="description">Type as many formulas as you can in three minutes.</p>

			<div class="game-modes">
				{#if typstInitializing}
					<p class="loading-text">Loading Typst renderer...</p>
				{:else if !typstReady}
					<p class="error-text">Failed to load Typst renderer. Please refresh the page.</p>
				{/if}
				<button class="btn mode-btn" on:click={startGame} disabled={!typstReady}>Timed Game</button>
			</div>

			<div class="hints">
				<h3>Hints:</h3>
				<ul>
					<li>No $ signs needed</li>
                    <li>All formulas are rendered in display style</li>
                    <li>Use <code>quad (mod n)</code> for modulo (equivalent to LaTeX's <code>\pmod</code>)</li>
                    <li>Use <code>op()</code> custom operators (equivalent to LaTeX's <code>\operatorname</code>)</li>
					<li>Harder formulas are worth more points</li>
                    <li>Refer to the <a href="https://typst.app/docs/reference/symbols/sym/" target="_blank" rel="noopener noreferrer">symbol reference</a> to quickly look up unknown symbols</li>
				</ul>
			</div>
			
			<div class="github-link">
              <a href="https://github.com/cosmicgenius/typsterity" target="_blank" rel="noopener noreferrer">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
              2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27
              2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
              1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  Github
              </a>
			</div>
		</div>
	{/if}

	{#if gameStarted}
		<div class="game-area">
			<h1 class="main-title">typsterity</h1>
			<div class="game-header">
				<div class="header-left">
					<button class="btn skip-btn" on:click={() => { loadNextFormula(); formulaNumber++; }}>Skip This Formula</button>
					<button class="btn end-btn" on:click={endGame}>End Game</button>
				</div>
				<div class="header-center">
					<div class="score"><strong>Score:</strong> {points}</div>
				</div>
				<div class="header-right">
					<div class="timer"><strong>Time:</strong> {formatTime(timeLeft)}</div>
				</div>
			</div>

			{#if currentFormula}
				<div class="formula-header">
					<h3>Formula {formulaNumber}: {currentFormula.title} ({Math.ceil(currentFormula.typst.length / 10)} points)</h3>
				</div>
				<div class="formula-display">
					<h4 class="section-header">Try to create the following formula:</h4>
					<div class="box formula-box">
						<TypstRenderer formula={currentFormula.typst} width={500} height={80} />
					</div>
				</div>
			{/if}

			<div class="user-preview">
				<h4 class="section-header">This is what your output looks like:</h4>
				<div class="box">
					{#if userInput.trim()}
						<TypstRenderer formula={userInput.trim()} width={500} height={60} />
					{:else}
						<div class="empty-preview">Start typing to see your formula rendered...</div>
					{/if}
				</div>
			</div>

			<div class="input-area">
				<div class="input-section">
					<h4 class="section-header">Edit your code here:</h4>
					<textarea
						bind:value={userInput}
						placeholder="Type your Typst formula here... (Ctrl+Enter to submit)"
						on:keydown={handleKeyDown}
						class="formula-input"
					></textarea>
				</div>
			</div>
		</div>
	{/if}

	{#if gameEnded}
		<div class="end-screen">
			<h1 class="main-title">typsterity</h1>
			<h2>Game Over!</h2>
			<div class="final-stats">
                <p class="final-score">
                    You finished {completedFormulas} formulas for a total score of {points}!
                </p>
			</div>
			<button class="btn mode-btn" on:click={() => { gameEnded = false; gameStarted = false; }}>Main Menu</button>
            <div class="share-button-container">
                <button class="btn mode-btn" on:click={copyResults}>Share?</button>
                {#if showToast}
                    <div class="tooltip">Copied!</div>
                {/if}
            </div>
		</div>
	{/if}

</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
        padding: 1rem;
		font-family: 'New Computer Modern', 'Times New Roman', Times, serif;
		background: white;
		min-height: 100vh;
		line-height: 1.6;
		box-sizing: border-box;
	}

	.start-page {
		text-align: center;
		padding: 1rem 0;
		position: relative;
		min-height: calc(100vh - 2rem);
		box-sizing: border-box;
	}

	.main-title {
		font-size: 4rem;
		color: #000;
		margin: 1rem 0 1rem 0;
		font-weight: normal;
		letter-spacing: 0.02em;
		text-align: center;
	}

	.description {
		font-size: 1.2rem;
		color: #000;
		margin: 0 0 1rem 0;
		font-weight: normal;
	}

	.game-modes {
		margin: 2rem 0;
	}

	.btn {
		background: white;
		color: #000;
		border: 2px solid #000;
		font-family: 'New Computer Modern', 'Times New Roman', Times, serif;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:hover:not(:disabled) {
		background: #000;
		color: white;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.mode-btn {
		padding: 0.6rem 1.2rem;
		font-size: 1.1rem;
		margin: 0 1rem;
	}

	.hints {
		text-align: left;
		max-width: 600px;
		margin: 2rem auto 1rem;
	}

	.hints h3 {
		font-size: 1.4rem;
		color: #000;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	.hints ul {
		list-style-type: disc;
		padding-left: 2rem;
	}

	.hints li {
		font-size: 1.1rem;
		color: #000;
		margin: 0.3rem 0;
    }

    .hints code {
        background: #f5f5f5;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Roboto Mono', 'Courier New', monospace;
        font-size: 0.9em;
    }

	.end-screen {
		text-align: center;
		margin: 2rem 0;
	}

	.loading-text {
		color: #3498db;
		font-style: italic;
		margin-bottom: 1rem;
	}

	.error-text {
		color: #e74c3c;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.game-area {
		margin: 0;
	}


	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding: 0;
		background: transparent;
		border-radius: 0;
	}

	.header-left {
		display: flex;
		gap: 1rem;
		flex: 1;
		justify-content: flex-start;
	}

	.header-center {
		flex: 1;
		text-align: center;
	}

	.header-right {
		flex: 1;
		text-align: right;
	}

	.skip-btn, .end-btn {
		padding: 0.4rem 0.8rem;
		font-size: 0.9rem;
	}

	.section-header {
		font-weight: normal;
		margin: 0 0 0.5rem 0;
		color: #000;
		font-size: 1.1rem;
	}

	.formula-header {
		margin-top: 2rem;
		margin-bottom: 0.5rem;
	}

	.formula-header h3 {
		font-size: 1.3rem;
		font-weight: bold;
		color: #000;
		margin: 0;
	}

	.timer {
		font-size: 1rem;
		font-weight: normal;
		color: #000;
	}

	.score {
		font-size: 1rem;
		font-weight: normal;
		color: #000;
	}

	.formula-display {
		margin-bottom: 1rem;
		text-align: left;
	}

	.box {
		border: 2px solid #000;
		background: white;
		border-radius: 3px;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80px;
	}

	.formula-box {
		margin-bottom: 0.5rem;
	}

	.input-area {
		margin-bottom: 1rem;
	}

	.input-section {
		margin-bottom: 1rem;
	}


	.formula-input {
		width: 100%;
		min-height: 100px;
		padding: 0.8rem;
		font-family: 'Roboto Mono', 'Courier New', monospace;
		font-size: 1rem;
		border: 2px solid #000;
		border-radius: 3px;
		resize: vertical;
		margin-bottom: 0.5rem;
		background: #1e1e1e;
		color: #ffffff;
		box-sizing: border-box;
	}

	.formula-input:focus {
		outline: none;
		border-color: #007acc;
	}

	.formula-input::placeholder {
		color: #888;
	}

	.user-preview {
		margin-bottom: 1rem;
	}


	.empty-preview {
		color: #888;
		font-style: italic;
	}

	.final-stats {
		margin: 1rem 0;
	}

	.final-score {
		font-size: 1.2rem;
		font-weight: normal;
		color: #000;
	}

	.github-link {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		padding-bottom: 1rem;
	}

	.github-link a {
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s;
	}

	.github-link a:hover {
		color: #000;
	}

	.share-button-container {
		position: relative;
		display: inline-block;
	}

	.tooltip {
		position: absolute;
		bottom: 125%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 0.5rem 0.8rem;
		border-radius: 4px;
		font-size: 0.9rem;
		white-space: nowrap;
		z-index: 1000;
		animation: fadeInUp 0.3s ease-out;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.6);
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
