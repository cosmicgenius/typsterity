export interface Formula {
    title: string;
	typst: string;
}

export const formulas: Formula[] = [
    // Taken from TeXnique
    {
        title: "Quadratic Formula",
        typst: String.raw`x = frac(-b plus.minus sqrt(b^2-4a c), 2a)`
    },
    {
        title: "Pythagorean Theorem",
        typst: String.raw`c = sqrt(a^2+b^2)`
    },
    {
        title: "Sum of first n Squares",
        typst: String.raw`sum_(i=1)^n i^2 = frac(n(n+1)(2n+1), 6)`
    },
    {
        title: "Law of Cosines",
        typst: String.raw`c^2 = a^2 + b^2 - 2a b cos angle C`
    },
    {
        title: "Legendre's formula",
        typst: String.raw`nu_p(n!) = sum_(i = 1)^(infinity) floor(frac(n, p^i))`
    },
    {
        title: "Euler's Identity",
        typst: String.raw`e^(pi i) + 1 = 0`
    },
    {
        title: "Euler's Lesser-Known Identity",
        typst: String.raw`ceil(e) - floor(pi) = 0`
    },
    {
        title: "Normal Distribution",
        typst: String.raw`Phi(x) = frac(1, sigma sqrt(2pi)) e^(-frac((x - mu)^2, 2sigma^2))`
    },
    {
        title: "Fourier Transform",
        typst: String.raw`hat(f)(omega) = integral_(-infinity)^infinity f(x) e^(-2pi i x omega) dif x`
    },
    {
        title: "Wave Equation",
        typst: String.raw`frac(diff^2 u, diff t^2) = c^2 frac(diff^2 u, diff x^2)`
    },
    {
        title: "Navier-Stokes Equation",
        typst: String.raw`rho (frac(diff bold(v), diff t) + bold(v) dot.op nabla bold(v)) = -nabla p + nabla dot.op bold(T) + bold(f)`
    },
    // Schrodinger equation removed due to no hbar
    {
        title: "Black-Scholes Equation",
        typst: String.raw`frac(diff V, diff t) + frac(1, 2) sigma^2 S^2 frac(diff^2V, diff S^2) + r S frac(diff V, diff S) - r V = 0`
    },
    {
        title: "Relativity",
        typst: String.raw`E=m c^2`
    },
    {
        title: "Chaos Theory",
        typst: String.raw`x_(t+1) = k x_t (1 - x_t)`
    },
    {
        title: "Definition of the Derivative",
        typst: String.raw`frac(dif f, dif x) = lim_(h arrow 0) frac(f(x + h) - f(x), h)`
    },
    {
        title: "Euler's Formula for Polyhedra",
        typst: String.raw`V - E + F = 2`
    },
    {
        title: "Gravitation",
        typst: String.raw`F = frac(G m_1 m_2, d^2)`
    },
    {
        title: "AM-GM",
        typst: String.raw`frac(x_1 + x_2 + dots.c + x_n, n) >= root(n, x_1 dot.op x_2 dots.c x_n)`
    },
    {
        title: "Stirling's Approximation",
        typst: String.raw`n! approx sqrt(2pi n) (frac(n, e))^n`
    },
    {
        title: "Stokes' Theorem",
        typst: String.raw`integral.double_S nabla times bold(F) dot.op dif bold(S) = integral.cont_Gamma bold(F) dot.op dif bold(Gamma)`
    },
    {
        title: "Divergence Theorem",
        typst: String.raw`integral.triple_V (nabla dot.op bold(F)) dif V = integral.surf_S (bold(F) dot.op bold(n)) dif S`
    },
    {
        title: "Cauchy-Schwarz Inequality",
        typst: String.raw`|angle.l bold(u), bold(v) angle.r|^2 <= angle.l bold(u), bold(u) angle.r dot.op angle.l bold(v), bold(v) angle.r`
    },
    {
        title: "Area of a Circle",
        typst: String.raw`A = pi r^2`
    },
    {
        title: "Definition of τ",
        typst: String.raw`tau = 2pi`
    },
    {
        title: "Sophie Germain Identity",
        typst: String.raw`a^4 + 4b^4 = (a^2 + 2a b + 2b^2)(a^2 -2a b + 2b^2)`
    },
    {
        title: "Pascal's Identity",
        typst: String.raw`binom(n, k) = binom(n-1, k) + binom(n-1, k-1)`
    },
    {
        title: "Hockey-stick Identity",
        typst: String.raw`sum_(i=r)^n binom(i, r) = binom(n+1, r+1)`
    },
    {
        title: "Vandermonde's Identity",
        typst: String.raw`binom(m + n, r) = sum_(k = 0)^r binom(m, k) binom(n, r-k)`
    },
    {
        title: "Combinations",
        typst: String.raw`binom(n, k) = frac(n!, k!(n-k)!)`
    },
    {
        title: "Heine's Identity",
        typst: String.raw`frac(1, sqrt(z - cos psi)) = frac(sqrt(2), pi) sum_(m = -infinity)^infinity Q_(m - 1/2)(z) e^(i m psi)`
    },
    {
        title: "Binomial identity",
        typst: String.raw`(x + y)^n = sum_(k=0)^n binom(n, k) x^(n-k) y^k`
    },
    {
        title: "Hermite's Identity",
        typst: String.raw`sum_(k=0)^(n-1) floor(x + frac(k, n)) = floor(n x)`
    },
    {
        title: "Matrix Determinant Lemma",
        typst: String.raw`det(bold(A) + bold(u) bold(v)^T) = (1 + bold(v)^T bold(A)^(-1) bold(u)) det(bold(A))`
    },
    {
        title: "Euler Product of the Riemann-Zeta function",
        typst: String.raw`zeta(s) = sum_(n=1)^infinity frac(1, n^s) = product_(p in bb(P)) frac(1, 1 - p^(-s))`
    },
    {
        title: "Irrationality of the Square Root of 2",
        typst: String.raw`sqrt(2) in.not bb(Q)`
    },
    {
        title: "Heron's Formula",
        typst: String.raw`[triangle A B C] = sqrt(s(s-a)(s-b)(s-c))`
    },
    // Heisenberg's Uncertainty Principle removed due to no hbar
    {
        title: "Continued Fraction for π/2",
        typst: String.raw`frac(pi, 2) = 1 + frac(1, 1 + frac(1, frac(1, 2) + frac(1, frac(1, 3) + frac(1, frac(1, 4) + dots.down))))`
    },
    {
        title: "Sophomore's Dream",
        typst: String.raw`integral_0^1 x^(-x) dif x = sum_(n=1)^infinity n^(-n)`
    },
    {
        title: "Identity involving π and e",
        typst: String.raw`product_(n=2)^infinity e (1 - frac(1, n^2))^(n^2) = frac(pi, e sqrt(e))`
    },
    {
        title: "Representation of the Golden Ratio",
        typst: String.raw`phi = sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + dots.down))))`
    },
    {
        title: "The Sum of all Positive Integers",
        typst: String.raw`sum_(n = 1)^infinity n = -frac(1, 12)`
    },
    {
        title: "Inverse of a complex number",
        typst: String.raw`z^(-1) = frac(overline(z), abs(z)^2), forall z != 0`
    },
    {
        title: "Definition of Convolution",
        typst: String.raw`(f * g)(t) = integral_(-infinity)^infinity f(tau) g(t - tau) dif tau`
    },
    {
        title: "Definition of the Kronecker Delta function",
        typst: String.raw`delta_(i,j) = cases(0 "if" i != j, 1 "if" i = j)`
    },
    {
        title: "Bayes' Theorem",
        typst: String.raw`P(A | B) = frac(P(B|A)P(A), P(B))`
    },
    {
        title: "Probability Density Function of the Student's t-distribution",
        typst: String.raw`f(t) = frac(Gamma(frac(nu + 1, 2)), sqrt(nu pi) Gamma(frac(nu, 2))) (1 + frac(t^2, nu))^(-frac(nu + 1, 2))`
    },
    {
        title: "De Morgan's laws",
        typst: String.raw`not (P and Q) tack.r (not P) or (not Q)`
    },
    {
        title: "Principle of Inclusion-Exclusion",
        typst: String.raw`abs(A union B) = abs(A) + abs(B) - abs(A sect B)`
    },
    {
        title: "General Principle of Inclusion-Exclusion",
        typst: String.raw`abs(union.big_(i = 1)^n A_i) = sum_(emptyset != J subset {1, dots, n}) (-1)^(abs(J) + 1) abs(sect.big_(j in J) A_j)`
    },
    {
        title: "Determinant of a 2×2 matrix",
        typst: String.raw`det mat(a, b; c, d) = a d - b c`
    },
    {
        title: "Sawtooth Function",
        typst: String.raw`S(x) = cases(x - floor(x) - 1/2 "if" x in bb(R) without bb(Z), 0 "if" x in bb(Z))`
    },
    {
        title: "Definition of Graham's Number",
        typst: String.raw`g_n = cases(3 arrow.t arrow.t arrow.t arrow.t 3 "if" n = 1, 3 arrow.t^(g_(n-1)) 3 "if" n >= 2, n in bb(N))`
    },
    {
        title: "Burnside's Lemma",
        typst: String.raw`abs(X \/ G) = frac(1, abs(G)) sum_(g in G) abs(X^g)`
    },
    {
        title: "Continuum Hypothesis",
        typst: String.raw`alef_0 = abs(bb(N)), frak(c) = abs(bb(R)) \ not exists A : alef_0 < abs(A) < frak(c)`
    },
    {
        title: "Spectral Decomposition",
        typst: String.raw`A = mat(|, |, , |; bold(v)_1, bold(v)_2, dots.c, bold(v)_n; |, |, , |) mat(lambda_1, , , ; , lambda_2, , ; , , dots.down, ; , , , lambda_n) mat(|, |, , |; bold(v)_1, bold(v)_2, dots.c, bold(v)_n; |, |, , |)^(-1)`
    },
    {
        title: "Pythagorean Identity",
        typst: String.raw`sin^2 theta + cos^2 theta = 1`
    },
    {
        title: "Double Angle for sin",
        typst: String.raw`sin(2theta) = 2sin(theta)cos(theta)`
    },
    {
        title: "Double Angle for cos",
        typst: String.raw`cos(2theta) = cos^2(theta) - sin^2(theta)`
    },
    {
        title: "Fermat's Last Theorem",
        typst: String.raw`not exists {x,y,z,n} in bb(N), n > 2 : x^n + y^n = z^n`
    },
    {
        title: "Fermat's Little Theorem",
        typst: String.raw`a^p equiv a quad (mod p)`
    },
    {
        title: "Euler's Theorem",
        typst: String.raw`gcd(a, n) = 1 ==> a^(phi(n)) equiv 1 quad (mod n)`
    },
    {
        title: "QM-AM-GM-HM Inequality over 3 variables",
        typst: String.raw`sqrt(frac(a^2 + b^2 + c^2, 3)) >= frac(a + b + c, 3) >= root(3, a b c) >= frac(3, frac(1, a) + frac(1, b) + frac(1, c))`
    },
    {
        title: "Extended Law of Sines",
        typst: String.raw`frac(a, sin angle A) = frac(b, sin angle B) = frac(c, sin angle C) = 2R`
    },
    {
        title: "Integration by Parts",
        typst: String.raw`integral u dif v = u v - integral v dif u`
    },
    {
        title: "Definition of Perfect Numbers",
        typst: String.raw`{n : sum_(d | n)^(d<n) d = n}`
    },
    {
        title: "Gaussian Integral",
        typst: String.raw`integral_(-infinity)^infinity e^(-x^2) dif x = sqrt(integral_(-infinity)^infinity integral_(-infinity)^infinity e^(-x^2 - y^2) dif x dif y) = sqrt(integral_0^(2pi) integral_0^infinity e^(-r^2)r dif r dif theta) = sqrt(pi)`
    },
    {
        title: "Definition of an Integral",
        typst: String.raw`integral_a^b f(x) dif x = lim_(k arrow infinity) ((b-a) sum_(i = 1)^k frac(f(a + i frac(b-a, k)), k))`
    },
    {
        title: "Quantum Fourier transform",
        typst: String.raw`|x angle.r |-> frac(1, sqrt(N)) sum_(k = 0)^(N-1) omega_x^k |k angle.r`
    },
    {
        title: "Recursive definition of the Hadamard transform",
        typst: String.raw`H_m = cases(1 "if" m = 0, frac(1, sqrt(2)) mat(H_(m-1), H_(m-1); H_(m-1), -H_(m-1)) "if" m > 0)`
    },
    // Wigner Transform of the Density Matrix removed due to no hbar
    {
        title: "Imaginary numbers",
        typst: String.raw`i^2 = -1`
    },
    {
        title: "Sum of Cubes",
        typst: String.raw`a^3 + b^3 = (a+b)(a^2 - a b + b^2)`
    },
    {
        title: "RSA Decryption Algorithm",
        typst: String.raw`m = c^(e^(-1) mod phi(n)) mod n`
    },
    {
        title: "Contraposition",
        typst: String.raw`(p ==> q) <==> (not q ==> not p)`
    },
    {
        title: "Equation of a spring",
        typst: String.raw`m dot.double(x) = -k x`
    },
    {
        title: "Sum of reciprocals of partial sums of ℕ",
        typst: String.raw`sum_(i = 2)^infinity frac(1, sum_(j = 1)^i j) = 1`
    },
    {
        title: "Binet's Formula",
        typst: String.raw`F_n = frac(1, sqrt(5)) (phi^n - frac((-1)^n, phi^n))`
    },
    {
        title: "Sum of first n Cubes",
        typst: String.raw`sum_(k = 0)^n k^3 = (sum_(k = 0)^n k)^2`
    },
    {
        title: "The Basel Problem",
        typst: String.raw`sum_(n = 1)^infinity frac(1, n^2) = frac(pi^2, 6)`
    },
    {
        title: "Root Mean Square",
        typst: String.raw`f_("rms") = sqrt(frac(1, T_2 - T_1) integral_(T_1)^(T_2) [f(t)]^2 dif t)`
    },
    {
        title: "The Harmonic Series",
        typst: String.raw`sum^infinity_(n=1) frac(1, n) = infinity`
    },
    {
        title: "Tupper's Self-Referential Formula",
        typst: String.raw`frac(1, 2) < floor(mod(floor(frac(y, 17)) 2^(-17 floor(x) - mod(floor(y), 17)), 2))`
    },
    {
        title: "Hölder's Inequality",
        typst: String.raw`(sum_(i = 1)^n a_i)^p (sum_(i = 1)^n b_i)^q >= (sum_(i = 1)^n root(p+q, a_i^p b_i^q))^(p+q)`
    },
    {
        title: "Rearrangement Inequality",
        typst: String.raw`a_1 <= a_2 <= dots.c <= a_n, b_1 <= b_2 <= dots.c <= b_n ==> sum_(i=1)^n a_i b_i >= sum_(i=1)^n a_(sigma(i)) b_i >= sum_(i=1)^n a_(n+1-i) b_i`
    },
    {
        title: "Power Mean",
        typst: String.raw`M_r (x_1,x_2,dots,x_n) = cases((frac(1, n) sum_(i=1)^n x_i^r)^(1\/r) "if" r != 0, root(n, product_(i=1)^n x_i) "if" r = 0)`
    },
    {
        title: "Law of Tangents",
        typst: String.raw`frac(a-b, a+b) = frac(tan(frac(angle A - angle B, 2)), tan(frac(angle A + angle B, 2)))`
    },
    {
        title: "Euler's Arctangent Identity",
        typst: String.raw`tan^(-1)(frac(1, x)) = tan^(-1)(frac(1, x+y)) + tan^(-1)(frac(y, x^2 + x y + 1))`
    },
    {
        title: "The Dirichlet Convolution",
        typst: String.raw`(f * g)(n) = sum_(d | n) f(d) g(frac(n, d))`
    },
    {
        title: "Sum of a Row of Pascal's Triangle",
        typst: String.raw`binom(n, 0) + binom(n, 1) + binom(n, 2) + dots.c + binom(n, n) = 2^n`
    },
    {
        title: "Alternating Harmonic Series",
        typst: String.raw`1 - frac(1, 2) + frac(1, 3) - frac(1, 4) + frac(1, 5) - dots.c = ln 2`
    },
    {
        title: "Definitions of Catalan's Constant",
        typst: String.raw`G = beta(2) = sum_(k=0)^infinity frac((-1)^k, (2k+1)^2) = integral.double_([0,1]^2) frac(dif x dif y, 1 + x^2 y^2)`
    },
    {
        title: "Series Representation of Apéry's Constant",
        typst: String.raw`zeta(3) = frac(5, 2) sum_(n=1)^infinity frac((-1)^(n-1), n^3 binom(2n, n))`
    },
    {
        title: "Definition of the Euler-Mascheroni Constant",
        typst: String.raw`gamma = lim_(n arrow infinity) (sum_(k=1)^n frac(1, k) - ln n) = integral_1^infinity (frac(1, floor(x)) - frac(1, x)) dif x`
    },
    {
        title: "Mertens' theorem",
        typst: String.raw`product_(p in bb(P))^n (1-frac(1, p)) tilde frac(e^(-gamma), log n)`
    },
    {
        title: "Green's First Identity",
        typst: String.raw`integral_Omega (psi Delta phi + nabla psi dot.op nabla phi) dif V = integral.surf_(diff Omega) psi(nabla phi dot.op bold(n)) dif S`
    },
    {
        title: "Cauchy-Riemann Equations",
        typst: String.raw`frac(diff u, diff x) = frac(diff v, diff y), frac(diff u, diff y) = -frac(diff v, diff x)`
    },
    {
        title: "Cauchy's Integral Formula",
        typst: String.raw`f(z_0) = frac(1, 2pi i) integral.cont_Gamma frac(f(z), z-z_0) dif z`
    },
    {
        title: "Cauchy's Differentiation Formula",
        typst: String.raw`f^((k))(z_0) = frac(k!, 2pi i) integral.cont_Gamma frac(f(z), (z-z_0)^(k+1)) dif z`
    },
    {
        title: "Functional Equation for the Riemann-Zeta Function",
        typst: String.raw`pi^(-s\/2) Gamma(frac(s, 2)) zeta(s) = pi^(-(1-s)\/2) Gamma(frac(1-s, 2)) zeta(1-s)`
    },
    {
        title: "Well-ordering Principle",
        typst: String.raw`forall M (M subset bb(N) and M != emptyset ==> exists m_0 [m_0 in M and forall n (n in M ==> m <= n)])`
    },
    {
        title: "Asymptotic Formula for the Dirichlet Divisor Function",
        typst: String.raw`sum_(n <= x) tau(n) = x log x + (2gamma -1)x + O(sqrt(x))`
    },
    {
        title: "Prime Number Theorem",
        typst: String.raw`pi(x) tilde frac(x, log x)`
    },
    {
        title: "Cumulative Distribution Function of the Gaussian Distribution",
        typst: String.raw`Phi(x) = frac(1, sqrt(2pi)) integral_(-infinity)^x e^(-t^2\/2) dif t`
    },
    {
        title: "Chernoff Bound",
        typst: String.raw`bb(P)(X >= t) <= frac(bb(E)[e^(lambda X)], e^(lambda t))`
    },
    {
        title: "Union Bound",
        typst: String.raw`bb(P)(union.big_(i=1)^n X_i) <= sum_(i=1)^n bb(P)(X_i)`
    },
    {
        title: "Law of Total Probability",
        typst: String.raw`bb(P)(A) = sum_(i=1)^n bb(P)(A| B_i) bb(P)(B_i)`
    },
    {
        title: "Linear Least Squares Estimator",
        typst: String.raw`L[X|Y] = bb(E)[X] + frac("cov"(X,Y), "var"(Y)) (Y-bb(E)[Y])`
    },
    {
        title: "Rademacher Complexity",
        typst: String.raw`cal(R)_n (cal(F)) = bb(E)_epsilon [sup_(f in cal(F)) frac(1, n) sum_(i=1)^n epsilon_i f(x_i)]`
    },
    {
        title: "Definition of the Dilogarithm",
        typst: String.raw`"Li"_2 (z) = -integral_0^z frac(log(1-t), t) dif t, z in bb(C)`
    },
    {
        title: "Leibniz's Determinant Formula",
        typst: String.raw`det(A) = sum_(sigma in S_n) epsilon(sigma) product_(i=1)^n A_(i,sigma(i))`
    },
    {
        title: "Euler-Lagrange Equations",
        typst: String.raw`frac(diff L, diff q_i) = frac(dif, dif t) frac(diff L, diff dot(q)_i)`
    },
    {
        title: "Definition of the Euler Totient Function",
        typst: String.raw`phi(n) = abs({k in bb(N)_(<=n) | gcd(k,n)=1}) = n product_(p|n) (1-frac(1, p))`
    },
    {
        title: "Sum of Divisors",
        typst: String.raw`sigma(n) = sum_(d|n) d = product_(p^a || n) (frac(p^(a+1)-1, p-1))`
    },
    {
        title: "Einstein Field Equations",
        typst: String.raw`G_(mu nu) + Lambda g_(mu nu) = frac(8pi G, c^4) T_(mu nu)`
    },
    {
        title: "Second Fundamental Theorem of Calculus",
        typst: String.raw`integral_a^b f(x) dif x = [F(x)]_a^b = F(b)-F(a)`
    },
    {
        title: "Abel's Summation Formula",
        typst: String.raw`sum_(x < n <= y) a(n) f(n) = A(y) f(y) - A(x) f(x) - integral_x^y A(t) f'(t) dif t`
    },
    {
        title: "Lagrange's Theorem",
        typst: String.raw`(G:H) = frac(abs(G), abs(H))`
    },
    {
        title: "Catalan Numbers",
        typst: String.raw`C_n = sum_(k=1)^(n-1) C_k C_(n-k-1) = frac(1, n+1) binom(2n, n)`
    },
    {
        title: "Ising Model Hamiltonian",
        typst: String.raw`H(sigma) = -sum_(angle.l i,j angle.r) J_(i j) sigma_i sigma_j - mu sum_j h_j sigma_j`
    },
    {
        title: "Borwein Integral",
        typst: String.raw`integral_0^infinity frac(sin(x), x) frac(sin(x\/3), x\/3) dots.c frac(sin(x\/13), x\/13) dif x = frac(pi, 2)`
    },
    {
        title: "Wigner Semicircle Distribution",
        typst: String.raw`f(x) = cases(frac(2, pi R^2) sqrt(R^2-x^2) "if" -R <= x <= R, 0 "if" abs(x) > R)`
    },
    {
        title: "Parseval Gutzmer Formula",
        typst: String.raw`f(z) = sum_(k=0)^infinity a_k z^k ==> frac(1, 2pi) integral_0^(2pi) abs(f(r e^(i theta)))^2 dif theta = sum_(k=0)^infinity abs(a_k r^k)^2`
    },
    {
        title: "Fubini's Theorem",
        typst: String.raw`integral_X (integral_Y f(x,y) dif y) dif x = integral_Y (integral_X f(x,y) dif x) dif y = integral_(X times Y) f(x,y) dif (x,y)`
    },
    {
        title: "Coarea Formula",
        typst: String.raw`integral_Omega g(x) abs(nabla u(x)) d x = integral_RR (integral_(u^(-1)(t)) g(x) d H_(n-1)(x)) d t`
    },
    {
        title: "Equation of a Torus",
        typst: String.raw`(sqrt(x^2 + y^2) - R)^2 + z^2 = r^2`
    },
    {
        title: "Ampère-Maxwell law",
        typst: String.raw`nabla times bold(B) = mu_0 (bold(J) + epsilon_0 (diff bold(E))/(diff t))`
    },
    {
        title: "Gauss's Flux Theorem (differential form)",
        typst: String.raw`nabla dot bold(E) = rho / epsilon_0`
    },
    {
        title: "Gauss's law for Magnetism",
        typst: String.raw`nabla dot bold(B) = 0`
    },
    {
        title: "Maxwell–Faraday equation",
        typst: String.raw`nabla times bold(E) = - (diff bold(B))/(diff t)`
    },
    {
        title: "Eigenvalue Formula",
        typst: String.raw`det(bold(A) - lambda bold(I)) = 0`
    },
    {
        title: "Collatz Function",
        typst: String.raw`f(n) = cases(n/2 "if" n equiv 0 space (mod 2), 3n + 1 "if" n equiv 1 space (mod 2))`
    },
    {
        title: "Gamma Function",
        typst: String.raw`Gamma(z) = integral_0^infinity x^(z - 1) e^(-x) d x`
    },
    {
        title: "Laplace Transform",
        typst: String.raw`cal(L)(f)(s) = integral_0^infinity f(t) e^(-s t) d t`
    },
    {
        title: "Taylor Series",
        typst: String.raw`f(x) = sum_(n = 0)^infinity (f^((n))(a))/(n!) (x - a)^n`
    },
    {
        title: "Quaternion Multiplication Formula",
        typst: String.raw`bold(i)^2 = bold(j)^2 = bold(k)^2 = bold(i) bold(j) bold(k) = -1`
    },
    {
        title: "General Solution to First-Order Linear Differential Equations",
        typst: String.raw`y = e^(-integral P(x) d x) integral Q(x) e^(integral P(x) d x) d x + C e^(-integral P(x) d x)`
    },
    {
        title: "Fibonacci Binomial Coefficients Identity",
        typst: String.raw`F_(n+1) = binom(n, 0) + binom(n-1, 1) + binom(n-2, 2) + dots + binom(n - floor(n/2), floor(n/2))`
    },
    {
        title: "Bellman Optimality Equation",
        typst: String.raw`V^(pi star)(s) = max_a { R(s,a) + gamma sum_(s') P(s'|s,a) V^(pi star)(s') }`
    },
    {
        title: "Definition of a Well-founded Relation",
        typst: String.raw`(forall S subset.eq X) [S != emptyset => (exists m in S) (forall s in S) not(s R m)]`
    },
    {
        title: "Estimation Lemma",
        typst: String.raw`abs(integral_gamma f(z) d z) <= L(gamma) sup_gamma abs(f)`
    },
    {
        title: "Chaitin's Constant",
        typst: String.raw`Omega_F = sum_(p in P_F) 2^(-abs(p))`
    },
    {
        title: "Cauchy's Differentiation Formula",
        typst: String.raw`f^((n))(a) = (n!)/(2 pi i) integral.cont_gamma (f(z))/((z-a)^(n+1)) d z`
    },
    {
        title: "Defintion of the Quasi-Stationary Distribution",
        typst: String.raw`forall B in cal(B)(cal(X)^a), forall t >= 0, P_nu(Y_t in B, T > t) = nu(B) P_nu(T>t)`
    },
    {
        title: "Addition of Sound Levels in Decibels",
        typst: String.raw`L_(a b) = 10 log_10 (10^(L_a/10) + 10^(L_b/10))`
    },
    {
        title: "Fast-Growing Hierarchy",
        typst: String.raw`f_alpha(n) = cases(n+1 "if" alpha=0, f_beta(n) "if" alpha = beta+1, f_(alpha[n])(n) "else")`
    },
    {
        title: "Feigenbaum-Cvitanović Functional Equation",
        typst: String.raw`g(g(x)) = - 1/alpha g(alpha x)`
    },
    {
        title: "Dirac Equation",
        typst: String.raw`i h-bar gamma^mu diff_mu psi - m c psi = 0`
    },
    {
        title: "Feynman's Trick",
        typst: String.raw`integral_0^pi ln(1-2 alpha cos x + alpha^2) d x = 2 pi ln abs(alpha)`
    },
    {
        title: "Lorentz Factor",
        typst: String.raw`gamma = 1 / sqrt(1 - v^2/c^2)`
    },
    {
        title: "Time Dilation",
        typst: String.raw`Delta t = (Delta t_0) / sqrt(1 - v^2/c^2)`
    },
    {
        title: "Gauss's Flux Theorem (integral form)",
        typst: String.raw`integral.surf_S bold(E) dot d bold(A) = Q / epsilon_0`
    },
    {
        title: "Doppler Effect",
        typst: String.raw`f_o / f_s = lambda_s / lambda_o = (v plus.minus v_o) / (v minus.plus v_s)`
    },
    {
        title: "Bernoulli's Equation",
        typst: String.raw`P_1 + rho.alt g y_1 + 1/2 rho.alt v_1^2 = P_2 + rho.alt g y_2 + 1/2 rho.alt v_2^2`
    },
    {
        title: "Relation between Kp and Kc",
        typst: String.raw`K_p = K_c (R T)^(Delta n)`
    },
    {
        title: "Van der Waals Equation",
        typst: String.raw`(P + a n^2/V^2) (V - n b) = n R T`
    },
    {
        title: "Maxwell-Boltzmann Distribution",
        typst: String.raw`f(v) = 4 pi v^2 ( m / (2 pi k T) )^(3/2) e^(-(m v^2)/(2 k_B T))`
    },
    {
        title: "Cayley-Hamilton Theorem",
        typst: String.raw`p(lambda) = det(lambda bold(I)_n - bold(A)) => p(bold(A)) = 0`
    },
    {
        title: "Chudnovsky's Formula for pi",
        typst: String.raw`1/pi = 12 sum_(k=0)^infinity ((-1)^k (6k)! (545140134k + 13591409))/((3k)!(k!)^3 (640320)^(3k + 3/2))`
    },
    {
        title: "Residue Theorem",
        typst: String.raw`1 / (2 pi i) integral.cont_gamma f(z) d z = sum_(p " pole") bold(I)(gamma, p) op("Res") (f, p)`
    },
    {
        title: "Center of Mass",
        typst: String.raw`bold(R) = 1/M integral.triple_Q rho(bold(r)) bold(r) d V`
    },
    {
        title: "The Fundamental Group of the Circle",
        typst: String.raw`pi_1(S^1) approx.eq ZZ`
    },
    {
        title: "Definition of the Operator Norm on a Finite Dimensional Banach Space.",
        typst: String.raw`{ norm(T(x))' / norm(x) : x != 0, x in X } equiv { norm(T(x))' : norm(x) = 1, x in X }`
    },
    {
        title: "Green's Theorem",
        typst: String.raw`integral.cont_C (L d x + M d y) = integral.double_D ( (diff M)/(diff x) - (diff L)/(diff y) ) d x d y`
    },
    {
        title: "Portfolio Variance",
        typst: String.raw`sigma_z^2 = (sum_(i=1)^n w_i^2 sigma_i^2) + 2 ( sum_(i=1)^(n-1) sum_(j = i+1)^n w_i w_j sigma_(i, j) )`
    },
    {
        title: "Newton's Method",
        typst: String.raw`x_(n+1) = x_n - (f(x_n))/(f'(x_n))`
    },
    {
        title: "Shannon Entropy",
        typst: String.raw`H(X) = - sum_(i=1)^n P(x_i) log_2 P(x_i)`
    },
    {
        title: "Pinsker's inequality",
        typst: String.raw`norm(mu - nu)_"TV" <= sqrt(2 D_"KL"(mu | nu))`
    },
    {
        title: "Sackur-Tetrode equation",
        typst: String.raw`S / (k_B N) = ln[ V/N ( (4 pi m)/(3 h^2) U/N )^(3/2) ] + 5/2`
    },
    {
        title: "Condtional Entropy",
        typst: String.raw`H(Y|X) = -sum_(x in cal(X), y in cal(Y)) p(x,y) log((p(x,y))/(p(x)))`
    },
    {
        title: "Force-Potential Relation",
        typst: String.raw`bold(F) = -(diff U)/(diff x) hat(bold(i)) - (diff U)/(diff y) hat(bold(j)) - (diff U)/(diff z) hat(bold(k)) = -vec(nabla)(U)`
    },
    {
        title: "Beta Function",
        typst: String.raw`B(x,y) = integral_0^1 t^(x-1) (1-t)^(y-1) d t`
    },
    {
        title: "Moist Adiabatic Lapse Rate",
        typst: String.raw`Gamma_"w" = -(d T)/(d z) = g ( (1 + (H_"v" r)/(R_"sd" T)) / (c_"pd" + (H_"v"^2 r)/(R_"sw" T^2)) )`
    },
    {
        title: "Cardano's Formula",
        typst: String.raw`root(3, -q/2 + sqrt(q^2/4 + p^3/27)) + root(3, -q/2 - sqrt(q^2/4 + p^3/27))`
    },
    {
        title: "General Cubic Formula",
        typst: String.raw`C = root(3, (Delta_1 plus.minus sqrt(Delta_1^2 - 4 Delta_0^3))/2)`
    },
    {
        title: "Riemann Zeta Function",
        typst: String.raw`zeta(s) = 1/(Gamma(s)) integral_0^infinity (x^(s-1))/(e^x - 1) d x`
    },
    {
        title: "Tangent Sum of Angles Formula",
        typst: String.raw`tan(alpha plus.minus beta) = (tan(alpha) plus.minus tan(beta)) / (1 minus.plus tan(alpha) tan(beta))`
    },
    {
        title: "Inner Product of Continuous Complex Valued Functions",
        typst: String.raw`angle(f, g) = integral_0^(2pi) f(t) overline(g(t)) d t`
    },
    {
        title: "Definition of a Psuedorandom Generator",
        typst: String.raw`abs( Pr_(x <- {0,1}^k) [cal(A) (G(x)) = 1] - Pr_(x <- {0,1}^(p(k))) [cal(A) (x) = 1] ) < mu(k)`
    },
    {
        title: "Generalized Stokes' theorem",
        typst: String.raw`integral_(delta M) omega = integral_M d omega`
    },
    {
        title: "Cartan's magic formula",
        typst: String.raw`cal(L)_X = d compose iota_X + iota_X compose d`
    }
];

