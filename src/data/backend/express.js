const express = {
  Basic: [
    {
      id: 1,
      question: "What is Middleware in Express?",
      answer: "Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute code, make changes to the request/response, and end the cycle.",
      code: "app.use((req, res, next) => {\n  console.log('Time:', Date.now());\n  next();\n});"
    }
  ],
  Medium: [
    {
      id: 2,
      question: "How do you handle errors in Express?",
      answer: "Error-handling middleware is defined with four arguments instead of three: (err, req, res, next). Express catches all errors that occur while running route handlers and middleware.",
      code: "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something broke!');\n});"
    }
  ],
  Hard: []
};

export default express;
