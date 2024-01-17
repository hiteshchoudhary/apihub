import Button from "./components/Button";
import { FaCirclePlus } from "react-icons/fa6";
import { SlDrawer } from "react-icons/sl";
import Header from "./components/Header";

import { useTodo } from "./context/TodoContext";
import { useState } from "react";
import CreateTodoModal from "./components/todos/CreateTodoModal";
import Options from "./components/Options";
import TodoCard from "./components/todos/TodoCard";
import { classNames } from "./utils";

function App() {
  const { todos } = useTodo();

  const [createTodoModal, setCreateTodoModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("all");

  const closeCreateTodoModal = () => {
    setCreateTodoModal(false);
  };
  const openCreateTodoModal = () => {
    setCreateTodoModal(true);
  };

  const optionsList = [
    {
      title: "All Todos",
      slug: "all",
      count: todos.length,
    },
    {
      title: "Pending",
      slug: "pending",
      count: todos.filter((todo) => !todo.isComplete).length,
    },
    {
      title: "Completed",
      slug: "completed",
      count: todos.filter((todo) => todo.isComplete).length,
    },
  ];

  return (
    <>
      <Header openTodoModal={openCreateTodoModal} />

      {createTodoModal && <CreateTodoModal onClose={closeCreateTodoModal} />}

      {todos.length > 0 ? (
        <div className={classNames("flex flex-col items-center p-3 ")}>
          <div className=" w-full px-3 mt-10">
            <Button
              onClick={openCreateTodoModal}
              severity="primary"
              className="mx-auto w-full max-w-[500px]"
            >
              <FaCirclePlus />
              Create a new task
            </Button>
          </div>

          <div className="w-full flex justify-around max-w-[600px] gap-4 my-6">
            {optionsList.map((option) => (
              <Options
                isActive={selectedOption === option.slug}
                key={option.slug}
                title={option.title}
                count={option.count}
                onClick={() => {
                  setSelectedOption(option.slug);
                }}
              />
            ))}
          </div>

          <div className=" w-full max-w-[800px] flex flex-col overflow-auto h-[calc(100vh-300px)] border-t-2">
            {todos
              .filter((todo) =>
                selectedOption === "pending"
                  ? !todo.isComplete
                  : selectedOption === "completed"
                  ? todo.isComplete
                  : true
              )
              .map((todo) => (
                <TodoCard key={todo._id} todo={todo} />
              ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-4 text-white">
            <SlDrawer className=" text-6xl md:text-8xl" />
            <h1 className="text-4xl font-extrabold md:text-6xl">
              No todos found?
            </h1>
            <p className="max-w-sm text-xs text-gray-200 md:text-sm">
              No todo has been added till now. Click the below button to create
              a new task.
            </p>
          </div>
          <Button
            onClick={openCreateTodoModal}
            severity="primary"
            className="font-bold mt-14"
          >
            <FaCirclePlus />
            Create a new task
          </Button>
        </div>
      )}
    </>
  );
}

export default App;
