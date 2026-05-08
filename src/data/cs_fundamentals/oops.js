export default [
  {
    id: 1,
    question: "What is OBJECT-ORIENTED PROGRAMMING",
    answer: `Object-Oriented Programming (OOP) is a programming paradigm that organizes code into objects, which represent real-world entities. It allows developers to model complex systems by breaking them down into smaller, manageable pieces. 
<br><br>
Example:
Imagine a car manufacturing company. To produce cars, the company uses a design blueprint. The blueprint defines the structure and functionality of a car (e.g., the number of wheels, type of engine, color, etc.).<br><br>
However, the blueprint itself is not a car—it is only a guide. The actual cars manufactured from this blueprint are like objects, and the blueprint itself is a class. 
🚗📏 `,
  },{
    id: 2,
    question: "What is a Class?",
    answer: "A class is a blueprint for creating objects. It defines the properties (attributes) and behaviors (methods) that the objects will have. Think of it as a template that outlines the structure and capabilities of an object but does not represent any actual instance."
  },{
    id: 3,
    question: "Key Characteristics of a Class",
    answer: `1. Attributes (Properties): These are the variables that define the state of an object. They represent the data or characteristics of the object. <br><br>
2. Methods (Behaviors): These are the functions defined within a class that represent the actions or behaviors an object can perform. <br><br>
3. Constructor: A special method that is automatically called when an object is created (instantiated) from a class. It is used to initialize the object's attributes. <br><br>
4. Encapsulation: The bundling of data (attributes) and the methods that operate on the data within a single unit (the class). This helps in data hiding and protecting the data from unauthorized access. `
  },{
    id: 4,
    question: "What is an Constructor?",
    answer: "A special method used to initialize the attributes of the class when an object is created. 🛠️<br><br>Think of a constructor like setting up a new phone. 📱<br><br>When you buy it, the setup process asks for language, Wi-Fi, and account—this initializes the phone Similarly, a constructor automatically sets initial values for an object when it is created. "
  }
  ,{
    id: 5,
    question: "Difference Between Class and Object",
    image:"/assets/theory/oops/5.png",
      image2:"/assets/theory/oops/5.1.png"
  }
  ,{
    id: 6,
    question: "What is an Object?",
    answer: "An object is an instance of a class. It represents a specific realization of the class blueprint, with its own unique set of data.‍<br>br> In the car analogy, each manufactured car is an object, and it holds specific values for its attributes (e.g., make: \"Toyota\", model: \"Corolla\", year: 2021).‍"
  }
  ,{
    id: 7,
    question: "Why Use Classes and Objects?",
    answer: "1. Reusability: Write a class once and create multiple objects with different data. ♻️2. Modularity:OOP allows you to break a large and complex problem down into smaller and more manageable pieces, or \"objects.\" This makes it easier to write, test, and maintain your code.3. Abstraction: Focus on the essential details of an entity without worrying about the internal workings.4. Scalability: Adding new features is straightforward without affecting existing code. 📈"
  }
  ,{
    id: 8,
    question: "Types of Constructors",
    answer: "1. Default Constructor: Default constructor is the constructor which doesn’t take any argument. It has no parameters.\n2. Parameterized Constructor: A constructor is called Parameterized Constructor when it accepts a specific number of parameters.\n3. Copy Constructor: A copy constructor is a member function which initializes an object using another object of the same class."
  },{
    id: 9,
    question: "Characteristics of the constructor",
    answer: "1. Constructor has the same name as the class itself.<br>2.Constructors don’t have a return type.<br>3. A constructor is automatically called when an object is created.<br>4.It must be placed in the public section of class.<br>5.If we do not specify a constructor, C++ compiler generates a default constructor for object (expects no parameters and has an empty body).<br>6.Constructors can be overloaded.<br>7.Constructor cannot be declared virtual.",
    image:"/assets/theory/oops/9.png"
  },{
    id: 10,
    question: "What is Destructor",
    answer: "A destructor is a special method used to free up memory resources when an object is destroyed. 🧹When you finish using a tool, you put it back in its place. Similarly, when an object is no longer needed, the destructor cleans up the memory it was using. Destructor destroys the class objects created by the constructor.",
  },{
    id: 11,
    question: "haracteristics of the constructor and destructor",
    answer:"1. Destructor is invoked automatically by the compiler when its corresponding constructor goes out of scope and releases the memory space that is no longer required by the program. 2. Destructor neither requires any argument nor returns any value therefore it cannot be overloaded. 3. Destructor cannot be declared as static and const. 4. Destructor should be declared in the public section of the program.",
    code:`#include <iostream>
using namespace std;

int count = 0 ;

class num{
public:
    num(){ // Constructor
        count++;
        cout << "Constructor is called for object number " << count << endl;
    }

    ~num(){ // Destructor
        cout << "Destructor is called for object number " << count << endl;
        count--;
    }
};
    `
  },{
    id:12,
    question: "What is Inheritance and its types?",
    answer: "Inheritance represents an 'is-a' relationship where a subclass inherits properties and behaviors from its parent class. 1. Single Inheritance 2. Multiple Inheritance 3. Multilevel Inheritance 4. Hierarchical Inheritance. 5. Hybrid Inheritance."
  },{
    id:13,
    question: "Explian Single Inheritance ",
    answer: "When a subclass(child) is inherited from a base class is called single inheritance.",
    image:"/assets/theory/oops/13.png"
  },{
    id:14,
    question: "Explian Multilevel Inheritance ",
    answer: "In this type of inheritance, a class is derived from a class which is already derived from another class. In simple words, we can say that a chain of single inheritance forms a multilevel inheritance.",
    image:"/assets/theory/oops/14.png"
  },{
    id:15,
    question: "Explian Multiple Inheritance",
    answer: "In multiple inheritance, a single derived class is inherited from two or more base classes. In simple words, we can say that two or more base classes form a multiple inheritance.",
     image:"/assets/theory/oops/15.png"
  },{
    id:16,
    question: "Explain Hierarchical Inheritance",
    answer: "In this type of inheritance, more than one subclass is inherited from a single base class.",
    image:"/assets/theory/oops/16.png"
  },{
    id:17,
    question: "Explain Hybrid Inheritance",
    answer: "When a combination of single, multiple, and multilevel inheritances forms a hierarchy of classes is called hybrid inheritance.",
    image:"/assets/theory/oops/17.png"
  },{
    id:18,
    question: "What is Encapsulation?",
    answer: "It is the principle of bundling data (variables) and methods (functions) together in a single unit (class) while restricting direct access to the internal data using access modifiers. <br><br> Real-World Terminology: It’s like a capsule or protective box where internal details are hidden and only controlled access is allowed.",
    image:"/assets/theory/oops/18.png"
  },{
    id:19,
    question: "Why do we need Encapsulation ",
    answer: "1. Increased Security of Data: Encapsulation hides the internal data of a class and allows access only through controlled methods (like getters/setters). This prevents unauthorized or accidental modification of data. 2. Access Without Revealing Complexity: Users can interact with an object using simple methods without knowing the internal working. This hides complex implementation details. 3. Reduces Human Errors: Since direct access to data is restricted, developers must use defined methods, which reduces the chance of incorrect data manipulation. 4. Easier to Understand: By organizing data and related methods in one class, the code becomes more structured and easier for developers to read, maintain, and manage."
  },{
    id:20,
    question: "What is Abstraction",
    answer: "Abstraction is the concept of hiding complex implementation details and showing only the essential features of an object. <br><br>Ex- It is like a atm machine it perform a lot of  task but only so limited info to use like input and hide the complexity ",
      image:"/assets/theory/oops/20.png"
  },{
    id:21,
    question: "Why do we need Abstraction",
    answer: "1. Avoids Writing Low-Level Code: Abstraction hides complex internal implementation, so the user only works with simple functions or interfaces without dealing with detailed low-level logic.2. Avoids Code Duplication & Increases Reusability:Common functionality can be written once in an abstract class or interface and reused in multiple classes, reducing repeated code.3. Increases Security: Only necessary features are exposed to the user while internal implementation details remain hidden, which protects sensitive logic and data"
  },{
    id:22,
    question: "What is Polymorphism?",
    answer: "Polymorphism is the ability of a method, object, or function to take many forms and perform different actions based on the context.<br> C++ polymorphism means that a call to a member function will cause a different function to be executed depending on the type of object that invokes the function.<br>Ex- behave like a son in home , behave like student in school , behave lile customer in mall <br>-> the same print() function can display text, numbers, or objects differently.",
  },{
    id:23,
    question: "What is member function and member variable?",
    answer: "Member function is nothing but a function that is defined inside a class.Member variable is nothing but a variable that is defined inside a class.",
  
  },{
    id:24,
    question: "Advantage of Polymorphism",
    answer: "1. Code Reusability: Polymorphism allows one function or method to perform multiple tasks depending on the object or data type, so the same code can be reused instead of writing separate functions. 2. Operator Flexibility: In C++, operators can be overloaded to work with different data types, such as using + to add numbers or combine strings. 3. Saves Time & Simplifies Programs: Since the same function or operator works in multiple situations, it reduces extra code and makes the program shorter and easier to manage"
  },{
    id:25,
    question: "types of Polymorphism",
    answer: "1. Compile-time Polymorphism (Static Polymorphism): 2. Run-time Polymorphism (Dynamic Polymorphism)"
  },{
    id:26,
    question: "What is function overloading?",
    answer: "Function overloading is a compile-time polymorphism technique that allows multiple functions to have the same name but different parameters (either different number of parameters or different types of parameters). The compiler determines which function to call based on the arguments provided during the function call.",
    image:"/assets/theory/oops/26.png"

  },{
    id:27,
    question: "What is Compile time Polymorphism",
    answer: "Compile-time polymorphism is a polymorphism that is, the function call is resolved during the compilation process.<br>We can achieve Compile-time polymorphism by two ways:<br> 1. Function Overloading  2. Operator Overloading"
  },{
    id:28,
    question: "Explain  Compile and Run time",
    answer: "Compile time → when code is being converted to machine code by the compiler; catches syntax/type errors before execution. <br>Run time → when the program is actually executing in memory; errors happen while running.Example: dividing by zero, accessing invalid array index, API failure."  
  },
  ,{
    id:28,
    question: "What is Operator Overloading?",
    answer: "Operator overloading is a compile-time polymorphism technique that allows you to redefine the way operators work with custom data types. It allows you to use operators like +, -, *, /, ==, etc. with your own classes.<br>So a single operator ‘+’, when placed between integer operands, adds them and when placed between string operands, concatenates them",
    image: "/assets/theory/oops/28.png"
  }
  ,{
    id:28,
    question: "What is Runtime Polymorphism",
    answer: "Runtime polymorphism is also known as dynamic polymorphism or late binding. In runtime polymorphism, the function call is resolved at run time. <br> This type of polymorphism is achieved by Function Overriding or Virtual function"
  }
  ,{
    id:29,
    question: "What is Virtual Function",
    answer: "A virtual function is a member function in the base class that we expect to redefine in derived classes When a virtual function is defined in a base class, then in runtime on the basis of type of object assigned to it, the respective class function is called <br> It helps write generic but flexible code. You can use a base class pointer (Payment*) and C++ automatically runs the correct derived class logic (UPI, Card, PayPal) at runtime.So you don’t need lots of if(paymentType == ...) conditions — adding new types becomes easy and existing code stays unchanged.",
    image:"/assets/theory/oops/29.png"
  }
  ,{
    id:30,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  },{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
  ,{
    id:28,
    question: "",
    answer: ""
  }
];
