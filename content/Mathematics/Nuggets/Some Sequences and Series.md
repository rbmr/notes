### Geometric Series

- A geometric sequence is an ordered list of non-zero numbers where you get from one term to the next by multiplying by a common ratio $r$.
    - $a, ar, ar^2, ar^3, \dots$
- A finite geometric series is the sum of the first $n$ terms of a geometric sequence.
    - Definition: $S_n = a + ar + ar^2 + \dots + ar^{n-1}$
    - Rule: $S_n = a \frac{1 - r^n}{1 -r}$ for $r \neq 1$
    - Derivation:
        - $S_n = a + ar + ar^2 + \dots + ar^{n-1}$
        - $rS_n = ar + ar^2 + ar^3 + \dots + ar^n$
        - $S_n - rSn  =  a - ar^n$
        - $S_n(1-r) = a(1-r^n)$
        - $S_n = a \frac{1 - r^n}{1 -r}$  for $r \neq 1$
- An infinite geometric series is the sum of all terms of a geometric sequence.
    - Definition: $S_\infty = a + ar + ar^2 + ar^3 + \cdots$
    - Rule: The series only has a finite sum if the common ratio is close to zero.
        - If $|r| < 1$ the series converges. $S_\infty = \frac{a}{1 - r}$
        - If $|r| \geq 1$ the series diverges. The sum goes to infinity, or oscillates indefinitely.
    - Derivation: Trivial given $S_\infty = \lim_{n\to \infty} S_n$

### Harmonic Series

- A **p-sequence** is an ordered list of numbers where each term is a constant $c$ divided by its position index $k$ raised to a fixed power $p$.
	- $\frac{c}{1^p}, \frac{c}{2^p}, \frac{c}{3^p}, \frac{c}{4^p}, \dots$
- An **infinite p-series** (also called a hyperharmonic series) is the sum of all terms of a p-sequence.
	- Definition: $S_\infty = \sum_{k=1}^\infty \frac{c}{k^p} = c \left( \frac{1}{1^p} + \frac{1}{2^p} + \frac{1}{3^p} + \cdots \right)$
	- Rule: The series only has a finite sum if the denominator grows fast enough to shrink the terms rapidly.
        - If $p > 1$, the series converges to a finite number.
		- If $p \leq 1$, the series diverges. The sum goes to infinity.
    - The specific case where $p=1$ is famously known as the **Harmonic Series**.
    - Derivation: We can determine if the discrete sum converges by comparing it to the continuous area under the curve using the **Integral Test**. If the integral of $f(x) = \frac{1}{x^p}$ from $1$ to $\infty$ is finite, the series converges. If it is infinite, the series diverges.
	    - Evaluate the integral for $p \neq 1$:
		    $$
			\int_1^\infty x^{-p} dx = \left[ \frac{x^{1-p}}{1-p} \right]_1^\infty
			$$
		- If $p > 1$: The exponent $(1-p)$ is a negative number, the term becomes $\frac{1}{x^{p-1}}$. As $x \to \infty$, the fraction goes to $0$. The area evaluates to a finite number, so the series converges.
		- If $p < 1$: The exponent $(1-p)$ is a positive number. As $x \to \infty$, $x$ raised to a positive power grows to $\infty$. The area is infinite, so the series diverges.
		- If $p = 1$: We use a different integral rule: $\int_1^\infty x^{-1} dx = \int_1^\infty \frac{1}{x} dx = \left[ \ln(x) \right]_1^\infty$. Since $\ln(\infty) = \infty$, the area is infinite, and the series diverges.

### Fibonacci Sequence

- The **Fibonacci sequence** is an ordered list of numbers where each term is the sum of the two preceding terms.
    - $0, 1, 1, 2, 3, 5, 8, 13, 21, \dots$
    - Defined recursively by:
	    - Recursive case: $F_n = F_{n-1} + F_{n-2}$ for $n \ge 2$
	    - Base case: $F_0 = 0$, and $F_1 = 1$.
- One can determine $F_{n}$ directly using Binet's formula, which is $F_n = \frac{\phi^n - \psi^n}{\sqrt{5}}$, where $\phi = \frac{1+\sqrt{5}}{2}$ and $\psi = \frac{1-\sqrt{5}}{2}$. Proof is not included.
- A **finite Fibonacci series** is the sum of the first $n$ terms of the sequence.
    - Definition: $S_n = F_0 + F_1 + F_2 + \dots + F_n$
    - Rule: $S_n = F_{n+2} - 1$
    - Derivation (Telescoping sum):
        - Rewrite the recurrence as $F_{k-2} = F_k - F_{k-1}$, this gives:
	        - $F_0 = F_2 - F_1$
	        - $F_1 = F_3 - F_2$
	        - $F_2 = F_4 - F_3$
	        - $\dots$
	        - $F_n = F_{n+2} - F_{n+1}$
        - If you add all these equations vertically, everything on the right side cancels out (telescopes) diagonally, leaving only $F_{n+2} - F_1$. Since $F_1 = 1$, the sum is $F_{n+2} - 1$.
- Trivially, the infinite Fibonacci series does not converge.

### Arithmetic Sequence

- An **arithmetic sequence** (specifically the natural numbers) is a list where each term increases by a constant difference.
	- $a, a+d, a+2d, a+3d, \dots$
	- Definition: $a_n = a + (n-1)d$
- The ordered sequence of natural numbers is an arithmetic sequence:
    - $1, 2, 3, 4, 5, 6, \dots$
    - Definition: $a_n = n$
- The sum of the first $n$ natural numbers is defined as follows:
    - Definition: $S_n = 1 + 2 + 3 + \dots + n$
    - Rule: $S_n = \frac{n(n+1)}{2}$
    - Derivation (Gauss's Trick):
        - $S_n = 1 + 2 + 3 + \dots + (n-1) + n$
        - $S_n = n + (n-1) + (n-2) + \dots + 2 + 1$
        - $2S_n = (n+1) + (n+1) + (n+1) + \dots + (n+1) + (n+1)$
        - $2S_n = n(n+1)$
        - $S_n = \frac{n(n+1)}{2}$
- The sum of the first $n$ elements of an arithmetic sequence is then equal to:
	- Definition: $S_{n}= a + (a+d) + (a+2d) + (a+3d) + \dots + (a+(n-1)d)$
	- Rule: $S_n = \frac{n}{2}(2a + (n-1)d)$ _or_ $S_n = \frac{n}{2}(a + a_n)$
	- Derivation:
		- $S_n = a + (a+d) + (a+2d) + (a+3d) + \dots + (a+(n-1)d)$
		- $S_n = \underbrace{(a + a + a + \dots + a)}_{n \text{ times}} + (d + 2d + 3d + \dots + (n-1)d)$
		- $S_n = na + d \cdot (1 + 2 + 3 + \dots + (n-1))$
		- $S_n = na + d \cdot \frac{n(n-1)}{2}$
		- $S_n = \frac{2na + dn(n-1)}{2}$
		- $S_n = \frac{n}{2}(2a + (n-1)d)$
- Trivially, the infinite Arithmetic series do not converge for $d \neq 0$.