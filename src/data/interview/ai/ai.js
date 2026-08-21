const ai = [
  {
    id: 1,
    question: "What is the difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data."
  }, {
    id: 2,
    question: "What is LLM Quantization?",
    answer: "The model itself have gaint weight, parameter adjusted during training to give expexted correct output and this number need to be stored somewhere and this requires space <br> Ex- Llama-3.1-70B open model [ let say if a each number takes 2 byte then it will take 140GB to store the model RAM  we cannot fit this on normal person system. This is what quatization solves by making gaint model smaller , cheaper and sometime faster.<br> General terms: <br> 1. Number format : how many bits are we using to store the number same number of parameter each number is store with less precision [  FP16 , ßFl6 , FP8 , INT8 ,TNT4]  higher → lower. <br> 2. Qauntization Method :[ GPTQ , AWQ ]  how to convert model to smaller without distroying the ouput [ becase we cannot expect we make the number smaller the output will be the same] . <br> - AWQ : looks for which wight matter more and presierve them and quatize the less important . <br> - GPTQ: <br> 3. File format: [GGUF]  the format this files are store really ex- llama.cpp that can be used to run the model easily <br> Who should Quantize Model:** Model provider , Inference Team , Deployment  <br> Tradeoff: They way you Quantize the model it effect the quailty if the output of model it need to check by the team [ this complete depend whaeather we have optmized the hardware and the software while Quantization the model and also while running the model ]."
  },
{
  id:3, 
  question:"How does prompt caching work in AI model requests, and why do tasks like coding get cheaper due to cache hits?",
  answer:"When you send a request, the model processes every token in your prompt — that processing is what you're billed for.<br><br>Prompt caching works by saving the computed state (the key-value attention cache) for a portion of your prompt after the first request. On subsequent requests, if that same prefix is sent again, the model skips recomputing it and reads the saved state directly.Those tokens are billed at ~10% of normal input cost.The cache is keyed on exact token sequence — one token difference in the prefix means a miss.

Why coding tasks benefit most:

A typical coding request looks like:

[System prompt — 1,000 tokens]   ← stable
[Codebase — 10,000 tokens]       ← stable
[User message — 30 tokens]       ← changes every request

After the first request, the 11,000-token prefix is cached. Every follow-up pays full price on only 30 tokens instead of 11,030. Anything with a large, stable context — coding assistants, long-document Q&A — benefits the most for this reason.

One caveat: the cache has a TTL (5 minutes on Anthropic's API, refreshed on each hit).",
  image:"theory/ai/1.png"
},{
  id:4, 
  question:"Why exact token match matters in Cache hits?",
  answer:"The simplest way to think of the transformer attention cache (KV cache) is a big table where the model stores intermediate results for each token. For a cache hit to occur, the new input must produce the exact same keys and values as a previous input. This requires the token IDs to match byte-for-byte from the start of the prompt. \n\n Even a single-character difference in your input can result in completely different token IDs, invalidating the cache. For example, adding a space or changing capitalization may change the tokenization, leading to a cache miss. This is why prompt caching is effective for fixed or repetitive inputs — like system prompts, code snippets, or previous conversation turns — where the token sequence is identical. Example-cached part is the prefix — not the whole prompt.

Think of it like this:

[System prompt]        ← this is identical every single request
[Codebase/context]     ← this is identical every single request
[User message]         ← this changes every request"
},{
  id:5, 
  question:"",
  answer:""
},{
  id:6, 
  question:"",
  answer:""
},{
  id:7, 
  question:"",
  answer:""
},{
  id:8, 
  question:"",
  answer:""
},{
  id:9, 
  question:"",
  answer:""
},{
  id:10, 
  question:"",
  answer:""
},{
  id:11, 
  question:"",
  answer:""
},{
  id:12, 
  question:"",
  answer:""
},{
  id:13, 
  question:"",
  answer:""
},{
  id:14, 
  question:"",
  answer:""
},{
  id:15, 
  question:"",
  answer:""
},{
  id:16, 
  question:"",
  answer:""
},{
  id:17, 
  question:"",
  answer:""
},{
  id:18, 
  question:"",
  answer:""
},{
  id:19, 
  question:"",
  answer:""
},{
  id:20, 
  question:"",
  answer:""
},{
  id:21, 
  question:"",
  answer:""
},{
  id:22, 
  question:"",
  answer:""
},{
  id:23, 
  question:"",
  answer:""
},{
  id:24, 
  question:"",
  answer:""
},{
  id:25, 
  question:"",
  answer:""
},
];
export default ai;
