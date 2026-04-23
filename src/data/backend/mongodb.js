const mongodb = {
  Basic: [
    {
      id: 1,
      question: "What is the difference between SQL and NoSQL?",
      answer: "SQL databases are relational, use structured schema, and are vertically scalable. NoSQL databases (like MongoDB) are non-relational, have dynamic schemas for unstructured data, and are horizontally scalable."
    }
  ],
  Medium: [
    {
      id: 2,
      question: "Explain the concept of 'Indexes' in MongoDB.",
      answer: "Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement.",
      code: "db.collection.createIndex({ \"name\": 1 })"
    }
  ],
  Hard: []
};

export default mongodb;
