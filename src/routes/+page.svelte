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
	let problemNumber = 1;
	let completedProblems = 0;
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
		problemNumber = 1;
		completedProblems = 0;
		
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
		completedProblems++;
		console.log(`🎯 Earned ${pointsEarned} points! Total: ${points}`);
		
		userInput = '';
		loadNextFormula();
		problemNumber++;
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
					<li>Use <code>frac(a, b)</code> for fractions</li>
					<li>Use <code>sqrt(x)</code> for square roots</li>
					<li>Use <code>sum_(i=1)^n</code> for summations</li>
					<li>Use <code>integral_a^b</code> for integrals</li>
					<li>Harder problems are worth more points</li>
				</ul>
			</div>
		</div>
	{/if}

	{#if gameStarted}
		<div class="game-area">
			<h1 class="main-title">typsterity</h1>
			<div class="game-header">
				<div class="header-left">
					<button class="btn skip-btn" on:click={() => { loadNextFormula(); problemNumber++; }}>Skip This Problem</button>
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
				<div class="problem-header">
					<h3>Problem {problemNumber}: {currentFormula.category} ({Math.ceil(currentFormula.typst.length / 10)} points)</h3>
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
				<p class="final-score">You finished {completedProblems} problems for a total score of {points}</p>
			</div>
			<button class="btn mode-btn" on:click={() => { gameEnded = false; gameStarted = false; }}>Main Menu</button>
		</div>
	{/if}
</main>

<style>
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

	.problem-header {
		margin-top: 2rem;
		margin-bottom: 0.5rem;
	}

	.problem-header h3 {
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

	.stats {
		display: flex;
		gap: 2rem;
	}

	.score, .accuracy {
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

	.formula-info {
		display: flex;
		gap: 0.5rem;
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
		font-size: 1.2rem;
		font-weight: normal;
		color: #000;
	}

	.final-accuracy, .attempts {
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}
</style>
