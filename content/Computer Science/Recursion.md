### Recursion

In computer science, **recursion** is a method of solving a problem where the solution depends on the solutions to smaller instances of the same problem.

The definition of a recursive function is divided into two parts: 
- One or more **base case**'s, where the function directly provides a solution to the problem.
- One or more **recursive case**'s, where the function breaks down the problem into smaller sub-problems of the same form. And using the solutions to these subproblems to solve the larger problem.
	- Any recursive step must strictly reduce the size of the problem, ensuring that it eventually reaches the base case. Failure to do so results in infinite recursion.

Any recursive function can be rewritten using iteration and an explicit stack data structure if needed. Recursion has the benefit of often resulting in cleaner, more intuitive and readable code, but iteration avoids the memory overhead of function calls, and is generally faster in practice.

### Decrease and Conquer

A **decrease-and-conquer algorithm** recursively reduces the problem into a single smaller instance at each step.  

Example 1: Factorial
```plaintext
function factorial(n):
    // Base case: factorial of 0 or 1 is 1
    if n <= 1
        return 1
        
    // Decrease by a constant: reduce n by 1
    return n * factorial(n - 1)
```

Example 2: Binary Search
```plaintext
function binarySearch(array, target, low, high):
    // Base case 1: search space exhausted, element not found
    if low > high
        return -1

    mid = (low + high) / 2

    // Base case 2: element found at the middle index
    if array[mid] == target
        return mid

    // Decrease by a constant factor: halve the search space
    if array[mid] > target
        return binarySearch(array, target, low, mid - 1)
    else
        return binarySearch(array, target, mid + 1, high)
```

Example 3: Pow (Naive)
```plaintext
function pow(x, n):
	if n == 0:
		return 1
	else if n % 2 == 0:
		return pow(x, n // 2) * pow(x, n // 2)
	else:
		return pow(x, n-1) * x
```

### Divide and Conquer

A **divide-and-conquer algorithm** recursively breaks down the problem into multiple independent sub-problems, which are solved recursively and then merged to form the final answer.

General structure:
1. Divide the problem into subproblems.
2. Conquer: recursively solve each of the subproblems, or solve them directly.
3. Combine the solutions to the subproblems to get the solution to the problem.

> The difference between divide and conquer and decrease and conquer lies in the number of recursive calls, *not* the size of the subproblems relative to the larger problems. The subproblems of both paradigms can differ from the larger problems by a factor, or an absolute amount.

Example 1: Merge Sort
```plaintext
function mergeSort(array)
    // Base case: Arrays with 0 or 1 element are already sorted
    if length(array) <= 1
        return array

    // 1. Divide: Find the midpoint and split the array into two halves
    mid = length(array) / 2
    leftHalf = array[0 ... mid-1]
    rightHalf = array[mid ... end]

    // 2. Conquer: Recursively sort the smaller chunks
    sortedLeft = mergeSort(leftHalf)
    sortedRight = mergeSort(rightHalf)

    // 3. Combine: Merge the sorted halves back into a single sorted array
    return merge(sortedLeft, sortedRight)
```

Example 2: Fibonacci (Naive)
```plaintext
function fibonacci(n):
    // Base cases
    if n == 0 return 0
    if n == 1 return 1

    // Divide into two smaller subproblems and sum their results
    return fibonacci(n - 1) + fibonacci(n - 2)
```

Example 3: Quick sort
```plaintext
function quickSort(array, low, high):
    // Base case: if the segment has 1 or fewer elements, it is sorted
    if low >= high:
	    return

	// 1. Divide: Partition the array around a pivot
	// Elements less than pivot go left, elements greater go right
	pivotIndex = partition(array, low, high)

	// 2. Conquer: Recursively sort the two partitions
	quickSort(array, low, pivotIndex - 1)
	quickSort(array, pivotIndex + 1, high)
```

### Recurrence Relations

When analyzing recursive algorithms we often express their time complexity as a **recurrence relation** $T(n)$. Where $T(n)$ defines the time required to solve a problem of size $n$ in terms of the time required to solve its smaller subproblems, plus the non-recursive work.

For example: Merge Sort's time complexity can be expressed as $T(n)=2T\left( \frac{n}{2} \right)+O(n)$

We want to find an asymptotic bound on the time complexity of a recursive function using the recurrence relation. 

#### 1. Recursion Tree Method

The **Recursion Tree Method** offers a intuitive visual understanding for determining the time complexity.
1. Construct a tree, where each node represents the cost of solving a single sub-problem. 
2. Expand the tree level by level.
3. Calculate the total cost at each level. 
4. Sum the costs across all levels to get the total time complexity.

#### 2. Master Theorem

The **Master Theorem** offers a direct solution for recurrence relations of the following form: 
$$
T(n) = aT\left( \frac{n}{b} \right) + f(n)
$$
Where:
- $a \geq 1$ is the number of recursive calls
- $b > 1$ is the factor by which the problem is reduced in each recursive calls
- $f(n)$ is the cost of the work done outside the recursive calls (the divide and combine steps).

To use the Master Theorem, you compare the work done at the leaves of the recursion tree, to the work done at the root.

Case 1: The Leaves Dominate
- Condition: $f(n) = O(n^c)$ where $c < \log_{b}a$
- Result: $T(n)= \Theta(n^{\log_{b}a})$

Case 2: The Work is Evenly Distributed
- Condition: $f(n) = \Theta(n^{\log_{b}a}\log^kn)$ for $k \geq 0$
- Result: $T(n) = \Theta(n^{\log_{b}a}\log^{k+1}n)$

Case 3: The Root Dominates
- Condition: $f(n) = \Omega(n^c)$ where $c > \log_b a$ 
- Regularity condition: $a f\left( \frac{n}{b} \right) \leq k f(n)$ for some constant $k < 1$ and sufficiently large $n$. 
- Result: $T(n) = \Theta(f(n)$

#### Characteristic Equations

(TODO: define characteristic equations, their use case, how to solve them, and their validity)

(TODO: also add sections for substitution method, and the akra-bazzi method)

### Dynamic Programming

**Dynamic Programming** (often abbreviated as DP) is an optimization technique used when a problem can be broken down into smaller, *overlapping* subproblems. Because the subproblems overlap, we can solve these subproblems only once, and store the result for future reference.

(TODO: explain the difference between DP via memoization (top-down), and bottom-up DP. )

Example 1: Pow
```plaintext
def pow(x, n):
	if n == 0:
		return 1
	else if n % 2 == 0:
		temp = pow(x, n // 2)
		return temp * temp
	else:
		return pow(x, n-1) * x
```

Example 2: Fibonacci
```plaintext
function fibonacci(n)
    // Handle edge cases
    if n == 0 return 0
    if n == 1 return 1
	
	// Solve the simplest subproblems first
    prev = 0
    current = 1
    
    // Use stored results to build solutions to larger subproblems
    for i from 2 to n (inclusive)
        current, prev = current + prev, current

    return current
```

Example 3: Knapsack (Top-down)
```
function knapsack(...):
	// TODO: provide pseudocode
```

Example 4: Knapsack (Bottom-up)
```
function knapsack(...):
	// TODO: provide pseudocode
```

### Branch and Bound

**Branch-and-Bound** (**B&B**) is a method for solving optimization problems by breaking them down into smaller subproblems, and using a bounding function to eliminate subproblems that cannot contain the optimal solution.

General Process:
1. Branch (Divide): Divide the problem space into two or more smaller, mutually exclusive subproblems (representing child nodes in a search tree).
2. Bound: Calculate an optimistic estimate of the best possible solution that can be found within each subproblem.
3. Prune: Keep track of the best valid solution found globally. If the subproblem's bound is worse than or equal to the current global best, discard (prune) that subproblem and all its potential children.