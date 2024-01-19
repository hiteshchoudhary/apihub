import React, { createContext, useContext, useEffect, useState } from "react";
import { TodoInterface } from "../interfaces/todo";
import { requestHandler } from "../utils";
import { createTodoApi, getAllTodos, getFilteredTodoApi } from "../api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

// Create a context to manage todos
const TodoContext = createContext<{
  todos: TodoInterface[];
  loading: boolean;
  createLoading: boolean;
  fetchLoading: boolean;
  changeTodo: (_todo: TodoInterface[]) => void;
  createTodo: (title: string, description: string) => Promise<void>;
  getFilteredTodos: (
    query: string,
    isComplete: boolean | null
  ) => Promise<void>;
}>({
  todos: [],
  loading: false,
  createLoading: false,
  fetchLoading: false,
  createTodo: async () => {},
  changeTodo: () => {},
  getFilteredTodos: async () => {},
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
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  // function to create todo
  const createTodo = async (title: string, description: string) => {
    await requestHandler(
      async () => await createTodoApi(title, description),
      setCreateloading,
      (res) => {
        const data = res.data;
        setTodos([data, ...todos]);
        toast.success(res.message);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  // change todos
  const changeTodo = (_todos: TodoInterface[]) => {
    setTodos(_todos);
  };

  const getFilteredTodos = async (
    query: string = "",
    isComplete: boolean | null
  ) => {
    await requestHandler(
      async () => await getFilteredTodoApi(query, isComplete),
      setFetchLoading,
      (res) => {
        const { data } = res;
        setTodos(data);
        console.log(data);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  useEffect(() => {
    // fetching todos on page refresh

    (async () => {
      await requestHandler(
        async () => await getAllTodos(),
        setLoading,
        (res) => {
          const { data } = res;
          setTodos(data);
        },
        (error) => {
          toast.error(error);
        }
      );
    })();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        createLoading,
        createTodo,
        changeTodo,
        loading,
        fetchLoading,
        getFilteredTodos,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center text-2xl h-[100vh]">
          <Loader />
        </div>
      ) : (
        children
      )}
    </TodoContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { TodoContext, TodoProvider, useTodo };
