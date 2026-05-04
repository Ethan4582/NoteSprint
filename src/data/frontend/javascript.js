export default [
  {
    id: 1,
    question: "Key Characteristics of Promises?",
    answer: "1. Promises are used to handle asynchronous operations like fetching data from a server, reading files, or running timers. 2. A promise has three states: pending (initial state before completion), fulfilled/resolved (successful completion with a result), and rejected (failure with an error reason). 3. Promises support chaining using the then method, allowing sequential execution of asynchronous operations in a readable way. 4. Promises provide built-in error handling through the catch method, which helps manage and propagate errors in asynchronous code.",
  },
  { 
    id: 2,
    question: "Why Do We Need Promises",
    answer: "1. Promises help avoid callback hell (callback pyramids), making code more readable and maintainable by reducing deeply nested callbacks. 2. They allow sequential execution of asynchronous operations in a clean way, improving overall code readability. 3. They simplify error handling by using a centralized catch block for a sequence of async operations. 4. They support Promise.all, which enables parallel execution of multiple async tasks and waits for all to complete.",
    image: "assets/theory/js/2.png"
  },
  {
    id: 3,
    question: "Give Example Of Promises",
    code: `
      const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve('Operation succeeded!');
          reject('Operation failed!');
        }, 1000);
    });
    `,
  },

  {
    id: 4,
    question: "What is Promise Chaining?",
    answer: "Promise chaining allows you to execute a sequence of asynchronous operations in a specific order. Each promise can return another promise, enabling a chain of dependent operations.",
    code:`
     successfulPromise
  .then((result) => {
    console.log(result); // Output: Operation succeeded!
    return 'New value';
  })
  .then((newValue) => {
    console.log(newValue); // Output: New value
  })
  .catch((error) => {
    console.error(error);
  });
    `
  },

  {
    id: 5,
    question: "Example of Promise All",
    answer: "Promise.all waits for all promises to resolve. If any promise rejects, the entire Promise.all rejects immediately.",
    code:`
      const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve) => setTimeout(resolve, 100, 3));

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values); // Output: [1, 2, 3]
  })
  .catch((error) => {
    console.error(error);
  });
    `
  },

  {
    id: 6,
    question: "",
    answer: "",
  },


  {
    id: 2,
    question: "",
    answer: "",
  },

  
];
