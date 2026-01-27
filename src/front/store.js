export const initialStore = () => {
  return {
    message: null,
    loggedIn: false,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };
    case "LoggedIn":
      return {
        ...store,
        loggedIn: true,
      };
    case "LoggedOut":
      return {
        ...store,
        loggedIn: false,
      };
    default:
      throw Error("Unknown action.");
  }
}
