# On-Demand Container Partitioning: How We Made Distributed ML More Efficient

**July 2025** | *Giovanni Bartolomeo*

---

Our paper [*On-Demand Container Partitioning for Distributed ML*](https://www.usenix.org/conference/atc25/presentation/bartolomeo) was accepted at **USENIX ATC '25**, and in this post I want to share the intuition and motivation behind the work in a more accessible way than a typical academic paper allows.

## The Problem: The "Layer Cake" Bottleneck
Traditional containers use a layered filesystem. Think of it like a stack of pancakes: if you want to change the flavor of the bottom pancake, you have to peel off and remake every single one on top of it.

In the world of ML, this is a nightmare because:
- Retraining is constant: Every time you update model weights, you’re essentially rebuilding the whole container.
- Distributed ML is messy: If you want to split a model to run across three different devices (split computing), you often have to build three separate, bulky images.
- Storage is scarce: At the "edge" (like on a smart camera or a sensor), we don't have the luxury of infinite storage or high-speed bandwidth to keep downloading massive new images.

## Enter 2DFS: Thinking in Two Dimensions
With 2DFS we decided it was time for a structural upgrade. Instead of a vertical stack of layers, 2DFS introduces a two-dimensional grid.

By using a new layer type called `2dfs.field`, this filesystem decouples the model's weights and partitions from the rest of the container environment.

## Why is this a game-changer?
- Independent Updates: You can swap out the model weights without touching the OS or the Python libraries. It’s like being able to slide a single drawer out of a cabinet rather than rebuilding the whole house.
- On-Demand Partitioning: Need to split your model to fit a smaller device? 2DFS can partition images on the fly with almost zero overhead.
- Smart Caching: It only updates what actually changed, making it perfect for limited-bandwidth environments.

## The Numbers Don't Lie
We tested 2DFS against 14 real-world ML models, and the results are, frankly, staggering:
- 56x faster build times on average.
- 25x better caching efficiency.
- 120x faster builds for specific massive models like EfficientNet-V2L.

## Does it play well with others?
The best part? You don't have to throw away your current tools. 2DFS is fully OCI-compliant. That’s tech-speak for "it works with your existing container registries and runtimes." It’s a seamless upgrade that fits right into your current MLOps workflow.

> While it was built with ML in mind, 2DFS is useful for any distributed computing task that involves large files or frequent updates.

## Try It Yourself

The code is available at [github.com/2DFS](https://github.com/2DFS). 

## Our cool poster 
Before you leave, check the cool poster we presented at EuroSys! First we built a container with a large computer vision model with 2DFS and then with traditional Docker build. No need to time it, 2DFS is visibly faster!
![https://www.oakestra.io/blog/oakestra-shines-at-acm-eurosys--asplos-2025/poster-working.m4v](https://www.oakestra.io/blog/oakestra-shines-at-acm-eurosys--asplos-2025/poster-working.m4v)

---

*Have questions or want to collaborate? [Drop me an email](mailto:giovanni.bartolomeo@tum.de).*
