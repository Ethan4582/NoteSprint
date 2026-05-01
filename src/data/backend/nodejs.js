const nodejs = [
  {
    id: 1,
    question: "What is Node.js and how does it work?",
    answer: "Node.js is a JavaScript runtime built on the V8 engine not a language. It allows you to run JavaScript on the server Like we have JVM for Spring. We can run our .js file directly in node environment. We do not need any additional setup."
  },
  {
    id: 2,
    question: "How is Node a runtime environment on the server side? What is V8?",
    answer: "Browser execute code on the client side (Browser has APIs to run JS code) while Node execute code on the server (Node has APIs like File System, HTTP, etc.). Both Browser and Node have V8 engine but Node has additional features like event loop, APIs etc. V8 is a JavaScript engine which is written in C++. It compiles and runs JavaScript code."
  },
  {
    id: 3,
    question: "What is the difference between a Runtime Environment and a Framework?",
    answer: "Runtime environment is a software that provides an environment for a program to run like memory management and I/O operations. Framework is a collection of libraries and tools that helps you to build a web application and it is built on top of runtime environment. Like React is a framework built on top of browser runtime environment. Express is a framework built on top of node runtime environment. In short Runtime environment provides features while framework provides features to build an application."
  },
  {
    id: 4,
    question: "What is the difference between Node.js and Express.js?",
    answer: "NodeJS is a runtime environment while Express.js is a framework. Express.js is built on top of NodeJS. Node.js provides features like file system, http, etc. while Express.js provides features like routing, middleware, etc."
  },
  {
    id: 5,
    question: "What are the differences between Client-Side (Browser) and Server-Side (Node.js)?",
    answer: "Server-Side handles the business logic like database, Authentication, API, etc. While client side handles the UI it has features like DOM Manipulation, Event Handling, etc."
  },
  {
    id: 6,
    question: "What are the 7 main features of Node.js?",
    answer: "1. Fast 2. Asynchronous and non-blocking nature 3. Single Threaded 4. Event Driven 5. Cross-Platform 6. NPM 7. Real-Time Applications"
  },
  {
    id: 7,
    question: "What is Asynchronous Programming?",
    answer: "A task will not wait for another task to complete. It will just move to the next task and will come back to the previous task once it is completed. This is called non-blocking nature of node.js and event will tell the thread the task is completed and execute it first."
  },
  {
    id: 8,
    question: "What are Events, Event Emitter, Event Queue, Event Loop, and Event Driven?",
    answer: "Node.js follows event driven architecture. It has Event Emitter to emit events, Event Queue to queue events, Event Loop to loop through events and Event Driven to drive events. Event Driven architecture is nothing but a way to handle events."
  },
  {
    id: 9,
    question: "What are the disadvantages of Node.js?",
    answer: "1. Single Threaded, 2. Callbacks 3. CPU Intensive Tasks, 4. Heavy Computation like gaming or Image Processing"
  },
  {
    id: 10,
    question: "What are Modules in Node? What is the difference between a function and a module?",
    answer: "Modules in node are nothing but a way to organize our code in a way that we can reuse it. It is a way to break down our code into smaller manageable chunks. Function returns a value (one) while module can export multiple values/functions/classes etc. A module is a broader concept that encapsulates functionality, while a function is a specific set of instructions within that module."
  },
  {
    id: 11,
    question: "How many ways are there to export a module?",
    answer: "1. default export 2. named export 3. direct export",
    image: "/assets/theory/node/11.png"
  },
  {
    id: 12,
    question: "What are the types of modules in Node?",
    answer: "fs, http are built-in modules, local module means created by us and third party modules are installed from npm"
  },
  {
    id: 13,
    question: "What is the difference between a function and an event?",
    answer: "A function is a block of code that performs a specific task. An event is a signal that indicates that something has happened."
  },
  {
    id: 14,
    question: "What are the advantages of using Express.js with Node.js?",
    answer: "1. Routing (Easy to define routes and endpoints) 2. Middleware (Chainable functions that can process requests and responses) 3. Template Engines (Integration with template engines like EJS, Pug, etc.) 4. Error Handling (Efficient error handling middleware) 5. Security (Built-in security features like helmet, rate limiting, etc.) 6. Performance (Lightweight and fast framework) 7. Community (Large and active community with extensive support and resources)"
  },
  {
    id: 15,
    question: "How to create an HTTP Server using Express.js?",
    answer: "To create an HTTP server in Express, you initialize the express application, define your port, and use the 'listen' method to start receiving requests.",
    image: "/assets/theory/node/15.png"
  },
  {
    id: 16,
    question: "What is Middleware in Express.js and when to use them?",
    answer: "Middleware is a function that stands in between request and response and can perform validation, modification, etc. We use them when we need to perform some action before or after the request is processed."
  },
  {
    id: 17,
    question: "What are the types of Middleware?",
    answer: "1. Application-level middleware (app.use()) 2. Router-level middleware (router.use()) 3. Error-handling middleware (err, req, res, next) 4. Built-in middleware (express.json(), express.urlencoded()) 5. Third-party middleware (body-parser, cors, helmet, etc.)"
  },
  {
    id: 18,
    question: "How do you implement middleware in Express.js?",
    answer: "Middleware is implemented by using 'app.use()' for global scope or by passing the middleware function as an argument to specific route handlers.",
    image: "/assets/theory/node/18.png"
  },
  {
    id: 19,
    question: "What is the Request Pipeline in Express?",
    answer: "The request pipeline represents the series of middleware and route handlers that a request passes through from the moment it hits the server until the response is sent back to the client.",
    image: "/assets/theory/node/19.png"
  },
  {
    id: 20,
    question: "What are third-party middlewares? Give some examples.",
    answer: "Third-party middleware is a middleware that is not built by us but installed from npm. Some examples are body-parser, cors, helmet, etc.",
    image: "/assets/theory/node/20.png"
  },
  {
    id: 21,
    question: "What is error handling middleware?",
    answer: "Error handling middleware is a middleware that is used to handle errors in our application. It is a function that takes four arguments req, res, err, next. And we add them at the end if we have multiple middlewares so if the error occurs in any middleware it will skip all the remaining middleware and go to the error handling middleware.",
    code: "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something broke!');\n});"
  },
  {
    id: 22,
    question: "What are the advantages of using middleware in Express.js?",
    answer: "1. Modularity (Divide application into smaller, manageable pieces) 2. Flexibility (Add or remove middleware as needed) 3. Performance (Lightweight and efficient) 4. Security (Implement security measures like authentication and authorization) 5. Error Handling (Handle errors gracefully) 6. Maintainability (Easy to maintain and debug) 7. Code Reusability (Use middleware in multiple applications) 8. Scalability (Easy to scale the application)"
  },
  {
    id: 23,
    question: "What is the difference between middleware and routing in Express?",
    answer: "Routing determines how an application responds to a client request for a specific endpoint (URI). Middleware functions have access to the request and response objects and the next middleware function in the application's request-response cycle.",
    image: "/assets/theory/node/23.png"
  },
  {
    id: 24,
    question: "How to handle Routing in real Express.js applications?",
    answer: "In real applications, routing is handled by separating routes into different files using 'express.Router()' and then importing them into the main app file.",
    image: "/assets/theory/node/24.png"
  },
  {
    id: 25,
    question: "What are Route Parameters in Express.js?",
    answer: "Route parameters are named URL segments that are used to capture the values specified at their position in the URL. They are stored in the 'req.params' object.",
    image: "/assets/theory/node/25.png"
  },
  {
    id: 26,
    question: "What is the difference between app.get() and router.get() methods?",
    answer: "'app.get()' is used to define routes directly on the main application object, while 'router.get()' is used to define routes within a separate router object for better modularity.",
    image: "/assets/theory/node/26.png"
  },
  {
    id: 27,
    question: "How does routing work in real production environments?",
    answer: "Production routing involves deep nesting of routers, separation of concerns between controllers and routes, and often versioning of the API.",
    image: "/assets/theory/node/27.png",
    image2: "/assets/theory/node/28.png"
  },
  {
    id: 28,
    question: "What are the advantages of REST API (Representational State Transfer)?",
    answer: "1. Stateless (each request is independent, easy to scale horizontally.) 2. Uses HTTP standards (simple (GET, POST, etc.), works with any client. 3. Lightweight & fast (typically JSON, less overhead than SOAP.) 4. Decoupled (frontend/backend evolve independently.) 5. Cacheable (improves performance and reduces server load.)",
    image: "/assets/theory/node/28-1.png"
  },
  {
    id: 29,
    question: "What is the difference between REST and SOAP?",
    answer: "REST is an architectural style for designing APIs while SOAP is a protocol. REST uses HTTP protocol while SOAP can use any protocol. REST is lightweight while SOAP is heavy. REST is stateless while SOAP is stateful. REST is cached while SOAP is not cached.",
    image: "/assets/theory/node/29.png"
  },
  {
    id: 30,
    question: "What are HTTP requests and HTTP responses?",
    answer: "HTTP request is a message sent from the client to the server. It contains the request method (GET, POST, etc.), the URL of the resource being requested, and the request headers. HTTP response is a message sent from the server to the client. It contains the response status code, the response headers, and the response body.",
    image: "/assets/theory/node/30.png",
    image2: "/assets/theory/node/31.png"
  },
  {
    id: 31,
    question: "What are GET, POST, DELETE, PUT, and PATCH methods?",
    answer: "GET (retrieve data) - Fetching data from a server. PUT (update or create data) - Modifying existing data or creating it if it doesn't exist. POST (create data) - Adding new data. DELETE (delete data) - Removing data. PATCH (partially update data) - Sending only the specific fields that need to be updated."
  },
  {
    id: 32,
    question: "Explain Idempotent and Non-Idempotent methods.",
    answer: "Idempotency means that performing the same operation multiple times will have the same effect as performing it once. For example, if we send a GET request to a server multiple times, it will return the same data every time. Similarly, if we send a DELETE request to a server multiple times, it will delete the resource only once. Non-idempotent means that performing the same operation multiple times can/will have different effects. For example, if we send a POST request to a server multiple times, it will create a new resource every time.",
    image: "/assets/theory/node/32.png"
  },
  {
    id: 33,
    question: "What is CORS in REST API and how to remove them?",
    answer: "CORS or Cross-Origin Resource Sharing is a security mechanism that allows a web page from one domain to request resources from a different domain. To remove CORS we use cors middleware in express. In production we have to add our domain in access-control-allow-origin header.",
    image: "/assets/theory/node/33.png",
    image2: "/assets/theory/node/33.1.png"
  },
  {
    id: 34,
    question: "What is serialization and deserialization and its types?",
    answer: "Serialization is the process of converting an object into a stream of bytes. Deserialization is the process of converting a stream of bytes into an object.",
    image: "/assets/theory/node/34.png"
  },
  {
    id: 35,
    question: "How to serialize and deserialize an object in Node.js?",
    answer: "In Node.js, we typically use 'JSON.stringify()' for serialization and 'JSON.parse()' for deserialization when working with JSON data.",
    image: "/assets/theory/node/35.png"
  },
  {
    id: 36,
    question: "What is the concept of versioning in REST API?",
    answer: "Versioning in REST API is a way to manage changes to an API over time while maintaining backward compatibility with older versions. Versioning ensures that existing clients continue to work with the API even after updates are made.",
    image: "/assets/theory/node/36.png"
  },
  {
    id: 37,
    question: "What is the typical structure of a Node.js project?",
    answer: "A typical structure involves directories for routes, controllers, models, middleware, and a main entry point like app.js or index.js.",
    image: "/assets/theory/node/37.png"
  },
  {
    id: 38,
    question: "What is authentication and authorization?",
    answer: "Authentication is the process of verifying the identity of a user. Authorization is the process of verifying the permissions of a user."
  },
  {
    id: 39,
    question: "What are the types of Authentication in web development?",
    answer: "1. Basic Authentication (username/password) 2. Token-Based Authentication (JWT) 3. OAuth (third-party login) 4. Session-Based Authentication 5. API Key Authentication"
  },
  {
    id: 40,
    question: "What is the role of hashing and salt in the authentication process?",
    answer: "Hashing is used to store passwords in a way that cannot be decrypted. Salt is a random value that is added to the password before hashing to prevent rainbow table attacks."
  },
  {
    id: 41,
    question: "How can we create a hashed password in Node.js?",
    answer: "We can use libraries like 'bcryptjs' or the built-in 'crypto' module to create hashed passwords securely.",
    image: "/assets/theory/node/41.png",
    image2: "/assets/theory/node/41-1.png"
  },
  {
    id: 42,
    question: "What is Token-based and JWT-based authentication?",
    answer: "In token-based authentication, the server generates a unique token for each user after successful login. This token is then sent to the client, which includes it in every subsequent request to access protected resources. The server verifies the token to ensure the user's identity. JSON Web Token (JWT) is a specific type of token-based authentication that uses JSON objects to securely transmit information between parties. JWTs are digitally signed, ensuring their integrity and authenticity.",
    image: "/assets/theory/node/42.png"
  },
  {
    id: 43,
    question: "What is the Error-first callback pattern?",
    answer: "The idea is that the first parameter of the callback is reserved for an error object, and the second parameter is for the result. This forces the developer to handle failure first, then success.",
    image: "/assets/theory/node/43.png"
  },
  {
    id: 44,
    question: "How to handle errors using Promises?",
    answer: "Errors in Promises can be handled using '.catch()' at the end of a promise chain or by using 'try-catch' blocks when working with async/await.",
    image: "/assets/theory/node/44.png"
  },
  {
    id: 45,
    question: "How to handle errors while using async-await?",
    answer: "We use 'try-catch' blocks to handle errors while using async-await, wrapping the awaited code in the 'try' block and handling errors in the 'catch' block.",
    image: "/assets/theory/node/45.png"
  }
];

export default nodejs;