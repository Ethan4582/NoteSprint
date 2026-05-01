const stateManagement = [
  {
    id: 1,
    question: "What is 'Prop Drilling'?",
    answer: "Prop drilling is the process of passing data through multiple levels of components that do not necessarily need the data, simply to reach a deeply nested component that requires it."
  },
  {
    id: 2,
    question: "Explain the Redux data flow architecture.",
    answer: "Redux uses a unidirectional data flow. When an event occurs, an 'Action' is dispatched. A 'Reducer' function takes the current state and the action, then returns a new state. The 'Store' holds this state and notifies the UI to re-render.",
    code: "const reducer = (state, action) => {\n  switch (action.type) {\n    case 'INCREMENT': return state + 1;\n    default: return state;\n  }\n};"
  }
];

export default stateManagement;
