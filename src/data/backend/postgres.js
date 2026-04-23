const postgres = {
  Basic: [
    {
      id: 1,
      question: "What is a Primary Key in PostgreSQL?",
      answer: "A primary key is a column or a group of columns used to uniquely identify a row in a table. It cannot contain null values and must be unique across the table."
    }
  ],
  Medium: [
    {
      id: 2,
      question: "What is a 'JOIN' and what are its types?",
      answer: "A JOIN clause is used to combine rows from two or more tables, based on a related column between them. Types include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
      code: "SELECT users.name, orders.amount\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;"
    }
  ],
  Hard: []
};

export default postgres;
