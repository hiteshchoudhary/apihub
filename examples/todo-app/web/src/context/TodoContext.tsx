import React, { createContext, useContext, useEffect, useState } from "react";
import { TodoInterface } from "../interfaces/todo";
import { LocalStorage, requestHandler } from "../utils";
import { createTodoApi, getAllTodos } from "../api";
import toast from "react-hot-toast";

// Create a context to manage todos
const TodoContext = createContext<{
  todos: TodoInterface[];
  loading: boolean;
  createLoading: boolean;
  changeTodo: (_todo: TodoInterface[]) => void;
  createTodo: (title: string, description: string) => Promise<void>;
}>({
  todos: [],
  loading: false,
  createLoading: false,
  createTodo: async () => {},
  changeTodo: () => {},
});

// Create a hook to access the todos and related functions
const useTodo = () => useContext(TodoContext);

// Create a component that provides todos
const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [createLoading, setCreateloading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // function to create todo
  const createTodo = async (title: string, description: string) => {
    await requestHandler(
      async () => await createTodoApi(title, description),
      setCreateloading,
      (res) => {
        const data = res.data;
        setTodos([...todos, data]);
        LocalStorage.set("todos", [...todos, data]);
        toast.success(res.message);
      },
      (error) => {
        // console.log(error);
        toast.error(error);
      }
    );
  };

  // change todos
  const changeTodo = (_todos: TodoInterface[]) => {
    setTodos(_todos);
  };

  useEffect(() => {
    // checking if todos already exists in localstorage
    const _todos = LocalStorage.get("todos");
    setTodos(_todos);

    // if todos not in localstorage, fetch them from Database
    if (!_todos) {
      (async () => {
        await requestHandler(
          async () => await getAllTodos(),
          setLoading,
          (res) => {
            const { data } = res;
            LocalStorage.set("todos", data);
            setTodos(data);
          },
          (error) => {
            console.log(error);
            toast.error(error);
          }
        );
      })();
    }
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        createLoading,
        createTodo,
        changeTodo,
        loading,
      }}
    >
      {loading ? "Loading" : children}
    </TodoContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { TodoContext, TodoProvider, useTodo };
