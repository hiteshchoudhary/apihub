import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TodoItemInterface } from "./interfaces/todo";
import { handleRequest } from "./utils";
import { createTodo, deleteTodo, getTodos } from "./utils/api";
import TodoCard from "./components/TodoCard";
import Loader from "./components/Loader";
import CreateTodoModal from "./components/CreateTodoModal";

function App() {
  const [todos, setTodos] = useState<TodoItemInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const getTodoshandler = async () => {
    handleRequest(
      async () => await getTodos(),
      setLoading,
      (res) => {
        const { data } = res;
        setTodos(data);
      },
      (errorMessage) => {
        toast.error(errorMessage);
      }
    );
  };

  const createHandler = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    handleRequest(
      async () => await createTodo({ title, description }),
      setIsCreateLoading,
      (res) => {
        const { message } = res;
        getTodoshandler();
        toast.success(message);
        setIsCreateModal(false);
      },
      (errorMessage) => {
        toast.error(errorMessage);
        setIsCreateModal(false);
      }
    );
  };

  const handleDelete = async (todoId: string) => {
    handleRequest(
      async () => await deleteTodo(todoId),
      null,
      (res) => {
        const { message } = res;
        getTodoshandler();
        toast.success(message);
      },
      (errorMessage) => {
        toast.error(errorMessage);
      }
    );
  };

  useEffect(() => {
    getTodoshandler();
  }, []);

  return (
    <>
      {isCreateModal && (
        <CreateTodoModal
          createHandler={createHandler}
          isCreateLoading={isCreateLoading}
          onClose={() => setIsCreateModal(false)}
        />
      )}
      <div className="w-full h-screen flex flex-col  justify-center items-center">
        <button
          onClick={() => setIsCreateModal(true)}
          className="bg-purple-700 px-3 py-2 rounded-lg my-4 "
        >
          + Create
        </button>

        <div className="flex flex-col gap-3 overflow-y-auto  max-h-[60%]  ">
          {loading ? (
            <Loader />
          ) : (
            <>
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <TodoCard
                    todo={todo}
                    key={todo._id}
                    handleDelete={handleDelete}
                    getTodoshandler={getTodoshandler}
                  />
                ))
              ) : (
                <h1>No Todos</h1>
              )}
            </>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
