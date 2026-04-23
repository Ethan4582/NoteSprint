const typescript = {
  Basic: [
    {
      id: 1,
      question: "What are the advantages of TypeScript over JavaScript?",
      answer: "TypeScript provides static typing, better tooling (IDE support), catch errors at compile-time, and supports interfaces and decorators."
    }
  ],
  Medium: [
    {
      id: 2,
      question: "What is an Interface in TypeScript?",
      answer: "An interface defines the syntax that any entity must adhere to. It acts as a contract for defining the structure of an object.",
      code: "interface User {\n  name: string;\n  id: number;\n  email?: string; // Optional field\n}"
    }
  ],
  Hard: []
};

export default typescript;
