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
				// Award points based on formula length (like TeXnique)
				const pointsEarned = Math.ceil(currentFormula.typst.length / 10);
				points += pointsEarned;
				console.log(`🎯 Earned ${pointsEarned} points! Total: ${points}`);
				
				userInput = '';
				loadNextFormula();
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
				// Award points based on formula length (like TeXnique)
				const pointsEarned = Math.ceil(currentFormula.typst.length / 10);
				points += pointsEarned;
				console.log(`🎯 Auto-earned ${pointsEarned} points! Total: ${points}`);
				
				userInput = '';
				loadNextFormula();
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
	<header>
		<h1>Typsterity</h1>
		<p>A Typst speed-typesetting game. How many formulas can you recreate in three minutes?</p>
	</header>

	{#if !gameStarted && !gameEnded}
		<div class="start-screen">
			{#if typstInitializing}
				<p class="loading-text">Loading Typst renderer...</p>
				<button class="start-btn" disabled>Start Game</button>
			{:else if !typstReady}
				<p class="error-text">Failed to load Typst renderer. Please refresh the page.</p>
				<button class="start-btn" disabled>Start Game</button>
			{:else}
				<button class="start-btn" on:click={startGame}>Start Game</button>
			{/if}
		</div>
	{/if}

	{#if gameStarted}
		<div class="game-area">
			<div class="game-header">
				<div class="timer">Time: {formatTime(timeLeft)}</div>
				<div class="stats">
					<div class="score">Points: {points}</div>
				</div>
			</div>

			{#if currentFormula}
				<div class="formula-display">
					<h3>Recreate this formula:</h3>
					<div class="formula-container">
						<TypstRenderer formula={currentFormula.typst} width={500} height={80} />
						<div class="formula-info">
							<span class="difficulty difficulty-{currentFormula.difficulty}">{currentFormula.difficulty}</span>
							<span class="category">{currentFormula.category}</span>
						</div>
					</div>
				</div>
			{/if}

			<div class="input-area">
				<div class="input-section">
					<h4>Your formula:</h4>
					<textarea 
						bind:value={userInput}
						placeholder="Type your Typst formula here... (Ctrl+Enter to submit)"
						on:keydown={handleKeyDown}
						class="formula-input"
					></textarea>
					{#if userInput.trim()}
						<div class="user-preview">
							<h5>Your formula rendered:</h5>
							<TypstRenderer formula={userInput.trim()} width={400} height={60} />
						</div>
					{/if}
				</div>
				<button class="submit-btn" on:click={checkAnswer}>Submit (Ctrl+Enter)</button>
			</div>
		</div>
	{/if}

	{#if gameEnded}
		<div class="end-screen">
			<h2>Game Over!</h2>
			<div class="final-stats">
				<p class="final-score">Final Points: {points}</p>
			</div>
			<button class="start-btn" on:click={startGame}>Play Again</button>
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 3rem;
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.start-screen, .end-screen {
		text-align: center;
		margin: 2rem 0;
	}

	.start-btn {
		background: #3498db;
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		border-radius: 5px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.start-btn:hover:not(:disabled) {
		background: #2980b9;
	}

	.start-btn:disabled {
		background: #95a5a6;
		cursor: not-allowed;
		opacity: 0.6;
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
		margin: 2rem 0;
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1rem;
		background: #ecf0f1;
		border-radius: 5px;
	}

	.timer {
		font-size: 1.4rem;
		font-weight: bold;
		color: #e74c3c;
	}

	.stats {
		display: flex;
		gap: 2rem;
	}

	.score, .accuracy {
		font-size: 1.2rem;
		font-weight: bold;
	}

	.formula-display {
		margin-bottom: 2rem;
		text-align: center;
	}

	.formula-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.formula-info {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.difficulty {
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-size: 0.8rem;
		font-weight: bold;
		text-transform: uppercase;
	}

	.difficulty-easy {
		background: #2ecc71;
		color: white;
	}

	.difficulty-medium {
		background: #f39c12;
		color: white;
	}

	.difficulty-hard {
		background: #e74c3c;
		color: white;
	}

	.category {
		background: #3498db;
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-size: 0.8rem;
	}

	.input-area {
		margin-bottom: 2rem;
	}

	.input-section {
		margin-bottom: 1rem;
	}

	.input-section h4 {
		margin: 0 0 0.5rem 0;
		color: #2c3e50;
		font-size: 1.1rem;
	}

	.formula-input {
		width: 100%;
		min-height: 120px;
		padding: 1rem;
		font-family: 'Courier New', monospace;
		font-size: 1rem;
		border: 2px solid #dee2e6;
		border-radius: 5px;
		resize: vertical;
		margin-bottom: 1rem;
	}

	.formula-input:focus {
		outline: none;
		border-color: #3498db;
	}

	.user-preview {
		margin-top: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 5px;
	}

	.user-preview h5 {
		margin: 0 0 0.5rem 0;
		color: #495057;
		font-size: 0.9rem;
	}

	.submit-btn {
		background: #27ae60;
		color: white;
		border: none;
		padding: 0.7rem 1.5rem;
		font-size: 1rem;
		border-radius: 5px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.submit-btn:hover {
		background: #229954;
	}

	.final-stats {
		margin: 1rem 0;
	}

	.final-score {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2c3e50;
	}

	.final-accuracy, .attempts {
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}
</style>
