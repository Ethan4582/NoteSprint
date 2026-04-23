const stateManagement = {
  Basic: [
    {
      id: 1,
      question: "What is 'Prop Drilling'?",
      answer: "Prop drilling is the process of passing data through multiple levels of components that do not need the data, just to reach a deeply nested component."
    }
  ],
  Medium: [
    {
      id: 2,
      question: "Explain the 'Redux' data flow.",
      answer: "In Redux, state is managed in a single store. When something happens in the UI, an 'Action' is dispatched. The 'Reducer' receives the action and the current state, and returns a new state. The UI then re-renders based on the new state.",
      code: "const reducer = (state, action) => {\n  switch (action.type) {\n    case 'INCREMENT': return state + 1;\n    default: return state;\n  }\n};"
    }
  ],
  Hard: []
};

export default stateManagement;
