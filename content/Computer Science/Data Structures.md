The following is an overview of a bunch some common data structures in Computer Science. We distinguish between interfaces (what operations are provided, and what they should do), and the implementation (how these operations are implemented, and how fast the operations run).

### Fixed Array

A **fixed array** is a contiguous block of memory allocated to hold a fixed number of elements of the same type. 
- Reading/Writing at a given index is $O(1)$. 
- Rescaling generally is only possible through creating a new fixed array, and copying over all the elements, which is $O(n)$ for $n$ elements.

###  Stacks, (double-ended) queues, and lists

We consider the following operations:
- `addFirst`, `addLast`, `add(index)`: to add an item at the start, end, or a specific position of the collection.
- `removeFirst`, `removeLast`, `remove(index)`: to remove an item from the start, end, or a specific position of the collection.
- `getFirst`, `getLast`, `get(index)`: to retrieve an item from the start, end, or a specific position of the collection.

Given these operations, we define 4 basic collections

| Interface   | Primary Operations                   | Access Pattern             |
| ----------- | ------------------------------------ | -------------------------- |
| **Stack**   | `addLast`, `removeLast`, `getLast`   | Last in, First Out (LIFO)  |
| **Queue**   | `addLast`, `removeFirst`, `getFirst` | First in, First Out (FIFO) |
| **Dequeue** | `add/remove/get` for Last & First    | Double Ended               |
| **List**    | `add/remove/get` for any index.      | Positional (Random)        |

### ArrayList, CircularArray, LinkedLists

To implement a list using an array (an **array list**), we keep track of the `capacity` (the maximum number of elements in the array), and the `size` (the number of elements currently in the list). `get(i)`, `addLast`, and `removeLast` can be implemented as $O(1)$ operations, however, inserting or removing at any other index $i$ requires shifting all subsequent elements, resulting in a time complexity of $O(n-i)$.

To allow for for insertions and removals at the start of the array, we use a **circular array**. This requires keeping track of the `start` index, and rolling around the indices using modulo arithmetic. Consequently, retrieval `get(i)` remains $O(1)$, but adding from both the first and last positions becomes $O(1)$. For insertions and deletions at an arbitrary index, we optimize the shifting by shifting whichever half is shorter. This reduces the time complexity to $O(\min(i,n-1))$.

Arrays are limited by their initial capacity, we can solve this by **dynamically resizing** the array when the `size` exceeds the `capacity`. Resizing itself requires allocating a new array and copying all elements, which is an $O(n)$ process. By ensuring the size of the resized array is a factor multiple of the size of the original array (usually a factor of 2), the cost of an insertion remains constant on average (this is called the *amortized cost*). Consequently, dynamically resizing arrays maintains the same time complexities as their fixed counterparts. In practice, any (circular) list built on an array comes with dynamic resizing as it creates very little overhead even if the resizing is never used.

Suppose however we are building an application where we frequently concatenate or split lists. With arrays these operations require copying over all elements (and likely resizing) which takes $O(n)$ time. **Linked Lists** solve this by abandoning contiguous memory. Instead they are built from independent **nodes** in different parts of memory, where each node contains some data, and references (pointers) to adjacent nodes. A **singly linked list** contain references in only one direction (pointing to the next node), and **doubly linked lists** contain references in both directions (pointing to the previous and next nodes). Splitting or concatenating linked lists only requires updating a few references rather than copying all the data over. 

An overview of the time complexities of these data structures is as follows:
- The collection's size is denoted using $n$.
- If a second collection is involved, its size is denoted by $m$.
- Item indices are denoted by $i$.
- Operations with an amortized cost are denoted by $*$.

| **Implementation**           | **add(i)**          | **remove(i)**     | **get(i)**        | **concat(other)** | **split(i)**      |
| ---------------------------- | ------------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| **Fixed Array**              | $O(n-i)$            | $O(n-i)$          | $O(1)$            | $O(m)$            | $O(n-i)$          |
| **Fixed Circular Array**     | $O(\min(i, n-i))$   | $O(\min(i, n-i))$ | $O(1)$            | $O(m)$            | $O(\min(i, n-i))$            |
| **Resizable Array**          | $O(n-i)^*$          | $O(n-i)$          | $O(1)$            | $O(m)$            | $O(n-i)$            |
| **Resizable Circular Array** | $O(\min(i, n-i))^*$ | $O(\min(i, n-i))$ | $O(1)$            | $O(m)$            | $O(\min(i, n-i))$            |
| **Singly Linked List**       | $O(i)$              | $O(i)$            | $O(i)$            | $O(1)$            | $O(i)$            |
| **Doubly Linked List**       | $O(\min(i, n-i))$   | $O(\min(i, n-i))$ | $O(\min(i, n-i))$ | $O(1)$            | $O(\min(i, n-i))$ |

Regardless of the underlying implementation, all of these collections keep an internal count and can provide their `size` (or `capacity`, if applicable) in $O(1)$ time.

It is also important to remember that Big-O notation hides constant factors. In general, due to memory locality, CPU caching and structural overhead, if the theoretical time complexities are equal the real world performance hierarchy is:
- fixed > dynamic arrays
- linear > circular arrays
- array lists > linked lists

### Maps, and (Sorted) Sets

TODO: 
- explain maps (relying on equality, and are generally unordered)
- explain sets as maps without values
- explain ordered sets (relying on <)
- explain we might allow duplicate values in ordered sets

### HashMaps, TreeMaps

TODO: 
- explain the idea behind hashing (equal inputs, ensure equal hashes, but unequal inputs do not guarantee unequal hashes, but we try to do so as much as possible, dont go into detail too much on specific algorithms)
- defined a hash map as a map built on an array that determines index based on the hash, and re-scales if too many collisions occur. 
- explain hashdos, and that the hash can be designed to prevent this but this comes at slight computational cost for every hash
- define mathematical concept behind balanced search trees briefly
- define tree maps as sorted sets using a balanced search tree (usually binary search tree), still allows fast (log n) insert get and remove set operations, but also maintains order.
- define these maps have an equivalent set implementation
- note that frequently, one will want to find and then insert/overwrite, and that one can use entries to only have to hash and index once.

### Priority Queues and Heaps

TODO:
- explain priority queues as queues where order is based on some property, only has operator get min, pop min, and insert (max is analogous, but you cannot have both at the same time). 
- explain mathematical concept behind heaps briefly
- explain binary heaps using a resizable array as an implementation

### Priority Queues vs Sorted Sets

TODO:
- explain difference between priority queues and sorted sets, as former maintaining partial order, and the other maintaining full order
- add a table comparing the time complexities between the two methods, rows are the methods, columns is binheap vs treeset. 
- Note that heap is generally more efficient when complexities are the same, as it does not really require re-balancing.

### Union-Find

TODO:
- use case: maintaining a collection of sets, and combining them efficiently, and answering the question "which set does this element belong to".
- methods: (1) add an element belonging to its own set, (2) find some indicator of the set an element belongs to, (3) union, as merging two sets
- implementation: we maintain a forest (collection of trees) where each tree represents a set, find is implement as finding the root element, and union is implemented as attaching the root of one tree to another.
- optimizations: path compression, union by rank (or size) 
- note that the tree is implemented using a single resizable array where every element of the array references to the index of its parent and the root references to itself.
- note that union find is not generally used to list the elements of a specific set, not the count of elements (reference only point to the root, not back)
- final time complexities

### Conclusion

TODO:
- To determine which data structure is appropriate for your use cases, consider exactly the operations you will need first, and in what frequency or order, and then find (and combine) the data structures to suit your needs. 
- You may also define an interface first, rely on that in your implementation, and benchmark your implementation using different underlying data structures.

### References

- The time complexities of the implementations are based on the Rust documentation https://doc.rust-lang.org/std/collections/index.html.