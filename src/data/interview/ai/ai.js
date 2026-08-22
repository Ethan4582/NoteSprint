const ai = [
  {
    "id": 1,
    "question": "What is the difference between supervised and unsupervised learning?",
    "answer": "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data."
  },
  {
    "id": 2,
    "question": "What is LLM Quantization?",
    "answer": "LLMs have billions of weights and parameters adjusted during training. Storing these weights requires significant memory. For example, Llama-3.1-70B in FP16 (2 bytes per parameter) requires ~140GB RAM just to load.<br><br>Quantization reduces memory footprint and computational cost by representing weights with lower precision (e.g., FP16 → FP8/INT8/INT4), making models smaller, cheaper, and faster.<br><br><strong>Key Concepts:</strong><br>1. <strong>Number Formats:</strong> Precision levels used to store weights (FP16, BF16, FP8, INT8, INT4). Lower precision requires less memory.<br>2. <strong>Quantization Methods:</strong><br>- <strong>AWQ (Activation-aware Weight Quantization):</strong> Identifies and preserves important weights while quantizing less important ones.<br>- <strong>GPTQ:</strong> One-shot post-training quantization based on second-order error information.<br>3. <strong>File Formats:</strong> Formats like GGUF used by runtimes such as llama.cpp for efficient CPU/GPU execution.<br><br><strong>Trade-off:</strong> Lower precision can cause slight degradation in output quality; testing is required to balance size vs. accuracy based on hardware and software optimizations."
  },
  {
    "id": 3,
    "question": "How does prompt caching work in AI model requests, and why do tasks like coding get cheaper due to cache hits?",
    "answer": "When you send a request, the model processes every token in your prompt — that processing is what you're billed for.<br><br>Prompt caching works by saving the computed state (the key-value attention cache) for a portion of your prompt after the first request. On subsequent requests, if that same prefix is sent again, the model skips recomputing it and reads the saved state directly. Those tokens are billed at ~10% of normal input cost. The cache is keyed on exact token sequence — one token difference in the prefix means a miss.<br><br><strong>Why coding tasks benefit most:</strong><br><br>A typical coding request looks like:<br>[System prompt — 1,000 tokens] ← stable<br>[Codebase — 10,000 tokens] ← stable<br>[User message — 30 tokens] ← changes every request<br><br>After the first request, the 11,000-token prefix is cached. Every follow-up pays full price on only 30 tokens instead of 11,030. Anything with a large, stable context — coding assistants, long-document Q&A — benefits the most for this reason.<br><br>One caveat: the cache has a TTL (e.g., 5 minutes on Anthropic's API, refreshed on each hit).",
    "image": "theory/ai/1.png"
  },
  {
    "id": 4,
    "question": "Why exact token match matters in Cache hits?",
    "answer": "The simplest way to think of the transformer attention cache (KV cache) is a big table where the model stores intermediate results for each token. For a cache hit to occur, the new input must produce the exact same keys and values as a previous input. This requires the token IDs to match byte-for-byte from the start of the prompt.<br><br>Even a single-character difference in your input can result in completely different token IDs, invalidating the cache. For example, adding a space or changing capitalization may change the tokenization, leading to a cache miss. This is why prompt caching is effective for fixed or repetitive inputs — like system prompts, code snippets, or previous conversation turns — where the token sequence is identical.<br><br>Think of it like this:<br>[System prompt] ← identical every single request<br>[Codebase/context] ← identical every single request<br>[User message] ← changes every request"
  }
];

export default ai;
