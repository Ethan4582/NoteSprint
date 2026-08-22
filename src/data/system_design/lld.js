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
    }, {
      id: 5,
      question: "What is DRY Principle?",
      answer: "DRY (Don't Repeat Yourself) means avoiding duplicate code, logic, or data by creating reusable functions, classes, or modules. <br><br> Why DRY? <br> 1. Less Duplication → Write once, use everywhere. 2. Better Readability → Cleaner and easier-to-understand code. 3. Fewer Bugs → Changes are made in one place only.  4. Better Reusability → Components can be reused across the application. 5. Easier Maintenance → Simpler to update and scale. <br><br> Example: Instead of writing the same validation logic in multiple files, create a single validateUser() function and reuse it."
    }, {
      id: 6,
      question: "What is KISS Principle?",
      answer: "KISS (Keep It Simple, Stupid) means designing systems to be as simple as possible, avoiding unnecessary complexity. <br><br> Why KISS? <br> 1. Less Complexity → Easier to understand and maintain. 2. Fewer Bugs → Simple code has fewer places for bugs to hide. 3. Faster Development → Simple designs are quicker to implement. 4. Better Performance → Simpler code usually runs faster. 5. Easier Debugging → Troubleshooting is straightforward. <br><br> Example: Instead of using a complex framework for a simple task, use a basic function or class."
    }, {
      id: 7,
      question: "What is YAGNI Principle?",
      answer: "YAGNI (You Ain't Gonna Need This) means avoiding adding functionality until it's actually needed, rather than anticipating future requirements. <br><br> Why YAGNI? <br> 1. Less Complexity → Avoids over-engineering. 2. Faster Development → Focus on current requirements only. 3. Better Design → Simpler designs are easier to maintain. 4. Reduced Waste → Prevents building unnecessary features. 5. Flexibility → Easier to adapt to changes. <br><br> Example: Don't add caching or authentication until there's a real need, rather than implementing them speculatively."
    }, {
      id: 8,
      question: "What is Single Responsibility Principle? ",
      answer: "A class should have only one reason to change. <br><br> Why SRP? <br> 1. Better Maintainability → Changes are isolated to a single class. 2. Improved Readability → Code becomes easier to understand. 3. Reduced Complexity → Simpler, focused classes. 4. Easier Testing → Each class can be tested independently. 5. Better Reusability → Focused classes are easier to reuse. <br><br> Example: Instead of a User class handling authentication, email sending, and logging, create separate AuthService, EmailService, and Logger classes."
    }, {
      id: 9,
      question: "What is Open/Closed Principle?",
      answer: "This principle states that Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification which means you should be able to extend a class behavior, without modifying it. <br><br> Why OCP? <br> 1. Better Maintainability → Changes are isolated to a single class. 2. Improved Readability → Code becomes easier to understand. 3. Reduced Complexity → Simpler, focused classes. 4. Easier Testing → Each class can be tested independently. 5. Better Reusability → Focused classes are easier to reuse. <br><br> Example: Instead of having one class for user management, authentication, and notifications, create separate classes for each functionality .<br><br> Use when: New features/types will be added frequently. Extend behavior without modifying existing code.<br><br> \${image(\"assets/lld/2.png\")} ",

    }, {
      id: 10,
      question: "What is Liskov Substitution Principle ?",
      answer: "This principle ensures that any class that is the child of a parent class should be usable in place of its parent without any unexpected behaviour.<br><br>Why it matters?<br> 1.Ensures reliable polymorphism. <br> 2.Makes code easier to extend and maintain. <br> 3.Prevents subclasses from breaking parent class behavior.<br><br>Example:\${image(\"assets/lld/3.png\")}"
    }, {
      id: 11,
      question: "What is Interface Segregation Principle ?",
      answer: "This principle states that clients should not be forced to depend upon interfaces that they do not use. In simple terms, it means that instead of having one large interface, it should be broken down into smaller, more specific interfaces so that each interface is only responsible for one particular functionality.<br></br> An interface is basically a contract that says what a class must do, but not how it does it. <br> ISP- Don't force a class to implement methods it doesn't need.<br><br>Why it matters?<br> 1.Ensures reliable polymorphism. <br> 2.Makes code easier to extend and maintain. <br> 3.Prevents subclasses from breaking parent class behavior.<br><br>Example:\${image(\"assets/lld/4.png\")}"
    }, {
      id: 12,
      question: "What is Dependency Inversion Principle? ",
      answer: "It suggests that classes should rely on abstractions (e.g., interfaces or abstract classes) rather than concrete implementations.\nThis allows for more flexible and decoupled code, making it easier to change implementations without affecting other parts of the codebase.<br><br>Why it matters?<br> 1.Promotes decoupled architecture.<br> 2.Facilitates testing and maintainability.<br><br> Example : \${image(\"assets/lld/5.png\")} \${image(\"assets/lld/6.png\")}"

    }, {
      id: 13,
      question: "",
      answer: ""
    }, {
      id: 10,
      question:"",
      answer: ""
    }, {
      id: 10,
      question:"",
      answer: ""
    }, {
      id: 10,
      question:"",
      answer: ""
    }

  ],
  Coding: []
};

export default lld;

