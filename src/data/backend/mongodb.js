const mongodb = [
  {
    id: 1,
    question: "What is the difference between SQL and NoSQL?",
    answer: "SQL databases are relational, use structured schemas, and are vertically scalable. NoSQL databases (like MongoDB) are non-relational, have dynamic schemas for unstructured data, and are horizontally scalable."
  },
  {
    id: 2,
    question: "Explain the concept of 'Indexes' in MongoDB.",
    answer: "Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan (scanning every document) to find matches. Indexes significantly speed up query performance.",
    code: 'db.collection.createIndex({ "name": 1 })'
  }
];

export default mongodb;
