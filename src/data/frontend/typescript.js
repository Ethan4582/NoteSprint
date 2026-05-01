const typescript = [
  {
    id: 1,
    question: "What are the primary advantages of TypeScript over JavaScript?",
    answer: "TypeScript offers static typing, which allows for catching errors at compile-time rather than runtime. It also provides superior IDE support (autocomplete, refactoring) and advanced features like interfaces and decorators."
  },
  {
    id: 2,
    question: "What is an Interface in TypeScript?",
    answer: "An interface defines a contract for the structure of an object, specifying the types of its properties and methods. It ensures that any object implementing the interface adheres to the defined structure.",
    code: "interface User {\n  name: string;\n  id: number;\n  email?: string; // Optional property\n}"
  }
];

export default typescript;
