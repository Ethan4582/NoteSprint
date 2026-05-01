const postgresql = [
  {
    id: 1,
    question: "What is a Primary Key in PostgreSQL?",
    answer: "A primary key is a column or group of columns used to uniquely identify a row in a table. It must be unique and cannot contain null values."
  },
  {
    id: 2,
    question: "What is a 'JOIN' and what are the common types?",
    answer: "A JOIN clause combines rows from two or more tables based on a related column. Common types include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
    code: "SELECT users.name, orders.amount\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;"
  }
];

export default postgresql;
