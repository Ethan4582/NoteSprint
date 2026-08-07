const ai = [
  {
    id: 1,
    question: "What is the difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data."
  }, {
    id: 2,
    question: "What is LLM Quantization?",
    answer: "The model itself have gaint weight, parameter adjusted during training to give expexted correct output and this number need to be stored somewhere and this requires space <br> Ex- Llama-3.1-70B open model [ let say if a each number takes 2 byte then it will take 140GB to store the model RAM  we cannot fit this on normal person system. This is what quatization solves by making gaint model smaller , cheaper and sometime faster.<br> General terms: <br> 1. Number format : how many bits are we using to store the number same number of parameter each number is store with less precision [  FP16 , ßFl6 , FP8 , INT8 ,TNT4]  higher → lower. <br> 2. Qauntization Method :[ GPTQ , AWQ ]  how to convert model to smaller without distroying the ouput [ becase we cannot expect we make the number smaller the output will be the same] . <br> - AWQ : looks for which wight matter more and presierve them and quatize the less important . <br> - GPTQ: <br> 3. File format: [GGUF]  the format this files are store really ex- llama.cpp that can be used to run the model easily <br> Who should Quantize Model:** Model provider , Inference Team , Deployment  <br> Tradeoff: They way you Quantize the model it effect the quailty if the output of model it need to check by the team [ this complete depend whaeather we have optmized the hardware and the software while Quantization the model and also while running the model ]."
  }
];
export default ai;
