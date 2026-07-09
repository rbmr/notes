### Definitions

Let $f(x)$ and $g(x)$ be functions mapping from the set of positive real numbers to the set of non-negative real numbers. In other words: $f, g: \mathbb{R}^+ \rightarrow \mathbb{R}^{\ge 0}$. Then we define the following:

| **Notation & Description**                                                                                                              | **Mathematical Definition**                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Big O ($O$):** Defines an asymptotic **upper bound**. $f(x)$ grows no faster than $g(x)$ up to a constant factor.                     | $f(x) \in O(g(x))$ if and only if there exist a $c > 0$ and an $x_0 > 0$ such that $0 \le f(x) \le c \cdot g(x)$ for all $x \ge x_0$                                  |
| **Big Omega ($\Omega$):** Defines an asymptotic **lower bound**. $f(x)$ grows at least as fast as $g(x)$ up to a constant factor.       | $f(x) \in \Omega(g(x))$ if and only if there exist a $c > 0$ and an $x_0 > 0$ such that $0 \le c \cdot g(x) \le f(x)$ for all $x \ge x_0$                             |
| **Big Theta ($\Theta$):** Defines an asymptotic **tight bound**. $f(x)$ grows at the same rate as $g(x)$ up to constant factors.        | $f(x) \in \Theta(g(x))$ if and only if there exist a $c_1, c_2 > 0$ and an $x_0 > 0$ such that $0 \le c_1 \cdot g(x) \le f(x) \le c_2 \cdot g(x)$ for all $x \ge x_0$ |
| **Small o ($o$):** Defines an asymptotic **upper bound that is strictly not tight**. $f(x)$ grows strictly slower than $g(x)$.          | $f(x) \in o(g(x))$ if and only if for every $c > 0$, there exists an $x_0 > 0$ such that $0 \le f(x) < c \cdot g(x)$ for all $x \ge x_0$                              |
| **Small omega ($\omega$):** Defines an asymptotic **lower bound that is strictly not tight**. $f(x)$ grows strictly faster than $g(x)$. | $f(x) \in \omega(g(x))$ if and only if for every $c > 0$, there exists an $x_0 > 0$ such that $0 \le c \cdot g(x) < f(x)$ for all $x \ge x_0$                         |

### Analogy to Comparison Operators

To intuitively understand asymptotic notation, it is helpful to draw a direct analogy between the growth rates of two functions, $f(x)$ and $g(x)$, and the standard comparison operators for numbers $a$ and $b$:

- $f(x) \in O(g(x))$ is analogous to $a \le b$
- $f(x) \in \Omega(g(x))$ is analogous to $a \ge b$
- $f(x) \in \Theta(g(x))$ is analogous to $a = b$
- $f(x) \in o(g(x))$ is analogous to $a < b$
- $f(x) \in \omega(g(x))$ is analogous to $a > b$

The same properties that hold for the comparison operators for numbers, also hold for the growth rate comparison operators for functions.

### As Limits to Infinity

Let $L=\lim_{ x \to \infty }\frac{f(x)}{g(x)}$, then
- $L = 0 \iff f(x) \in o(g(x))$
- $L = \infty \iff f(x) \in \omega(g(x))$
- $0 < L < \infty \implies f(x) \in \Theta(g(x))$
- $0 \le L < \infty \implies f(x) \in O(g(x))$
- $L > 0 \text{ (incl. }\infty\text{)} \implies f(x) \in \Omega(g(x))$

Note: we use a bi-implication ($\iff$) for $o$ and $\omega$ because their formal definitions are functionally equivalent to the ratio tending toward $0$ or $\infty$, respectively. In contrast, $O$, $\Omega$, and $\Theta$ use a single implication ($\implies$) because these asymptotic bounds can still hold even if the limit fails to exist, such as when a function oscillates between two values.

Example: take the functions $f(x) = 2 + \sin(x)$ and $g(x)=1$, then $f(x) \in \Theta(g(x))$, but $\lim_{x \to \infty} \frac{2 + \sin(x)}{1}$ does not exist because of the sine wave.

### Ordering of Common Functions

To make comparing function growth rates more concise, it is common to use the $\ll$ symbol as a shorthand for small $o$ notation. Specifically, we write 
$$
f(x) \ll g(x) \iff f(x) \in o(g(x))
$$

Let $b > a > 0$, $k > 0$, and $d > c > 1$, then:
$$
1 \ll (\ln x)^k \ll x^a \ll x^b \ll c^x \ll d^x \ll x! \ll x^x
$$

Note: the base of the logarithm does not matter for this ordering. More specifically, $\log_{a}x \in \Theta(\log_{b}x)$ for any two fixed bases $a,b>1$. 
- Reasoning: by the change of base formula ($\log_a x = \frac{\log_b x}{\log_b a}$), $\log_{a}x$ differs from $\log_{b}x$ by a constant factor $\log_b a$ making them asymptotically equivalent.

When combining functions, their asymptotic ordering follows specific mathematical rules that help simplify complex equations:

- **Addition (The Dominant Term Rule):** When adding two functions, the function with the higher growth rate entirely dictates the bounds of the sum.
    - If $f(x) \ll g(x)$, then $f(x) + g(x) \in \Theta(g(x))$.
    - _Example:_ Since $\log x \ll x$, it follows that $x + \log x \in \Theta(x)$.
- **Multiplication (Order Preservation):** Multiplying both sides of an asymptotic inequality by a positive function preserves the relative ordering.
    - If $f(x) \ll g(x)$ and $h(x)$ is a strictly positive function, then $f(x) \cdot h(x) \ll g(x) \cdot h(x)$.
    - _Example:_ Since $\log x \ll x$, multiplying both sides by $x$ gives $x \log x \ll x^2$.

