const express = [
  {
    id: 1,
    question: "What is Express.js and what are its features?",
    answer: "Express.js is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for web and mobile applications, including simplified routing, middleware support."
  },{
    id:2,
    question:"How would set up express server",
    code:`
const express = require('express'); 
require("dotenv").config();
const app= express(); 
app.use(express.json());

app.get('/',(req, res)=>{
   res.send(console.log("hi there"))
})

app.get('/api', (req, res) => {
  res.json({ message: 'This is the API route.' });
});

app.get('/api/:id', (req, res)=>{
   const {id} = req.params;
   res.json({messge: id});
})

const PORT=process.env.PORT || 3000;
app.listen(PORT , ()=>{
   console.log(\`listen to port ${3000}\`);
})
    `
  },
  {
    id:3,
    question:"Difference between GET and POST method.",
    answer:"1. GET is used to retrieve data from a resource and should not cause side effects; POST is used to send data to the server to create or update resources 2. In GET, data is sent as query parameters in the URL with size limits; in POST, data is sent in the request body and can handle larger amounts. 3. GET parameters are visible in the URL (less secure for sensitive data); POST parameters are not visible in the URL (more secure). 4. GET requests can be cached, bookmarked, and are idempotent; POST requests are not cached, cannot be bookmarked, and are not idempotent. Use GET for fetching data (e.g., reading posts, searching, API calls) and POST for submitting data (e.g., forms, file uploads, payments).."
  },{
    id:4,
    question:"How to handle POST request",
    answer:"Before handling POST requests, it's important to include middleware to parse the incoming data. Express provides built-in middleware for handling JSON and form data like app.use(express.json());",
    code:`
    const express = require('express'); 
require("dotenv").config();
const app= express(); 
app.use(express.json());

const store=[];

app.post('/content', (req, res)=>{
    const newcontent= req.body.content;
    if(!newcontent){
      return res.status(400).json({error:"Add valide content"});
    }

    store.push(newcontent);
    res.status(201).json({ message: 'Content added successfully' ,data: store });
  
})
const PORT=process.env.PORT || 3000;
app.listen(PORT , ()=>{
   console.log("listen to port ",PORT);
})
  `
  },
  {
    id:5,
    question:"How to handle errors in Express.js?",
    answer:""
  }
 
];

export default express;
