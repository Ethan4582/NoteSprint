const lld = {
  Theory: [
    {
      id: 1,
      question: "What is LLD Design?",
      answer: "LLD or Low-Level Design is a phase in software development that focuses on the detailed design of a system. It involves breaking down a system into smaller, more manageable components and designing the interactions between them. Design of a particular module is done in LLD like Auth, Database schema, API design etc."
    },
    {
      id: 2,
      question: "What is HLD Design?",
      answer: "HLD or High-Level Design is a phase in software development that focuses on the architectural design of a system. It involves breaking down a system into smaller, more manageable components and designing the interactions between them. High-level Design of the whole system is done in HLD."
    },
    {
      id: 3,
      question: "Why is LLD important?",
      answer: "1. Avoid rework [removes unnecessary code repetition, duplication, and reduces bugs], 2. Improve collaboration [developers can work on different modules in parallel], 3. Promote scalability, 4. Encourage best practices [new developers can easily understand and work on the code]."
    },
    {
      id: 4,
      question: "How is LLD Different From HLD?",
      answer: `High-Level Design (HLD) focuses on the overall architecture of the system. For instance, in a movie ticket booking system, HLD would outline the main components like the user interface (where users select movies and seats), the backend services (handling booking requests, seat availability, and notifications), and the database (storing movie schedules, user data, and bookings). <br><br> It would also define how these components interact—like the flow of data between the user interface, backend, and third-party payment gateways <br><br> \${image("assets/lld/1.png")}<br><br> Low-Level Design (LLD), on the other hand, dives into the specifics of implementing individual features. For example, it defines how the booking process works—detailing the step-by-step flow from when a user selects a movie and showtime to when a ticket is successfully booked. 🎬📅<br><br> It specifies how data is validated (e.g., ensuring selected seats are available and payment details are correct), algorithms for locking seats (to prevent double booking), and how the booking information is stored in the database (schema). 💾🔒<br><br> LLD also describes the flow of data, such as how a booking confirmation is generated and sent to the user via email or SMS. 📧📱 It’s like creating blueprints for each transaction in the system, covering the smallest details to ensure reliability and precision. 🎯`
    }
  ],
  Coding: []
};

export default lld;
