export interface Formula {
	typst: string;
	difficulty: 'easy' | 'medium' | 'hard';
	category: string;
}

export const formulas: Formula[] = [
	// Easy formulas
	{
		typst: 'x^2',
		difficulty: 'easy',
		category: 'basic'
	},
	{
		typst: 'a + b = c',
		difficulty: 'easy',
		category: 'basic'
	},
	{
		typst: 'y = m x + b',
		difficulty: 'easy',
		category: 'algebra'
	},
	{
		typst: 'x^2 + y^2 = r^2',
		difficulty: 'easy',
		category: 'geometry'
	},
	{
		typst: 'f(x) = x^3',
		difficulty: 'easy',
		category: 'functions'
	},
	{
		typst: 'sin(theta) = y/r',
		difficulty: 'easy',
		category: 'trigonometry'
	},

	// Medium formulas
	{
		typst: 'x = frac(-b plus.minus sqrt(b^2 - 4a c), 2a)',
		difficulty: 'medium',
		category: 'algebra'
	},
	{
		typst: 'integral_0^infinity e^(-x^2) d x = frac(sqrt(pi), 2)',
		difficulty: 'medium',
		category: 'calculus'
	},
	{
		typst: 'sum_(n=1)^infinity frac(1, n^2) = frac(pi^2, 6)',
		difficulty: 'medium',
		category: 'series'
	},
	{
		typst: 'lim_(x -> 0) frac(sin x, x) = 1',
		difficulty: 'medium',
		category: 'limits'
	},
	{
		typst: 'nabla times bold(F) = (frac(partial R, partial y) - frac(partial Q, partial z)) bold(i)',
		difficulty: 'medium',
		category: 'vector calculus'
	},
	{
		typst: 'e^(i pi) + 1 = 0',
		difficulty: 'medium',
		category: 'complex analysis'
	},

	// Hard formulas
	{
		typst: 'mat(a, b; c, d) mat(x; y) = mat(a x + b y; c x + d y)',
		difficulty: 'hard',
		category: 'linear algebra'
	},
	{
		typst: 'P(A|B) = frac(P(B|A) P(A), P(B))',
		difficulty: 'hard',
		category: 'probability'
	},
	{
		typst: 'frac(partial^2 u, partial t^2) = c^2 nabla^2 u',
		difficulty: 'hard',
		category: 'differential equations'
	},
	{
		typst: 'Gamma(n) = integral_0^infinity t^(n-1) e^(-t) d t',
		difficulty: 'hard',
		category: 'special functions'
	},
	{
		typst: 'cases(x + y = 1, 2x - y = 4, x^2 + y^2 = 5)',
		difficulty: 'hard',
		category: 'systems'
	},
	{
		typst: 'binom(n, k) = frac(n!, k!(n-k)!)',
		difficulty: 'hard',
		category: 'combinatorics'
	}
];

export function getRandomFormula(difficulty?: 'easy' | 'medium' | 'hard'): Formula {
	let availableFormulas = formulas;

	if (difficulty) {
		availableFormulas = formulas.filter(f => f.difficulty === difficulty);
	}

	const randomIndex = Math.floor(Math.random() * availableFormulas.length);
	return availableFormulas[randomIndex];
}

export function getFormulasByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Formula[] {
	return formulas.filter(f => f.difficulty === difficulty);
}
