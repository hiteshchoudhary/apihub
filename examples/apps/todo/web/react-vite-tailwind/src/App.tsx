import { FaCirclePlus } from "react-icons/fa6";
import { SlDrawer } from "react-icons/sl";
import Button from "./components/Button";
import Header from "./components/Header";

import { useState } from "react";
import CreateTodoModal from "./components/todos/CreateTodoModal";
import TodoCard from "./components/todos/TodoCard";
import { useTodo } from "./context/TodoContext";
import { classNames } from "./utils";
import Loader from "./components/Loader";
import TabsHeader from "./components/todos/TabsHeader";

function App() {
  const { todos, fetchLoading } = useTodo();

  const [createTodoModal, setCreateTodoModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("all");
  // TODO: Implement todo search with debouncing
  const [query] = useState(""); // for searching (coming soon)

  const closeCreateTodoModal = () => {
    setCreateTodoModal(false);
  };
  const openCreateTodoModal = () => {
    setCreateTodoModal(true);
  };

  return (
    <>
      <Header openTodoModal={openCreateTodoModal} />

      {createTodoModal && <CreateTodoModal onClose={closeCreateTodoModal} />}

      {todos && todos.length > 0 ? (
        <div className={classNames("flex flex-col items-center p-3 ")}>
          <TabsHeader
            openCreateTodoModal={openCreateTodoModal}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            query={query}
          />

          <div className=" w-full max-w-[800px] flex flex-col overflow-auto h-[calc(100vh-300px)] border-t-2">
            {fetchLoading ? (
              <Loader />
            ) : (
              <>
                {todos?.map((todo) => <TodoCard key={todo._id} todo={todo} />)}
              </>
            )}
          </div>
        </div>
      ) : selectedOption === "all" ? (
        <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center px-4 text-center">
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
      ) : (
        <div className={classNames("flex flex-col items-center p-3 ")}>
          <TabsHeader
            openCreateTodoModal={openCreateTodoModal}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            query={query}
          />

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-white">
            <SlDrawer className=" text-4xl md:text-6xl" />
            <h1 className="text-2xl font-extrabold md:text-4xl">
              No {selectedOption} todos found?
            </h1>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
