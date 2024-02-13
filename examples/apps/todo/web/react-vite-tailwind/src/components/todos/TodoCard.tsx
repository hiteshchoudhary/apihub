import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteTodoApi, toggleTodoStatusApi } from "../../api";
import { useTodo } from "../../context/TodoContext";
import { TodoInterface } from "../../interfaces/todo";
import { classNames, requestHandler } from "../../utils";
import DetailAndEditModal from "./DetailAndEditModal";

const TodoCard = ({ todo }: { todo: TodoInterface }) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { changeTodo, todos } = useTodo();

  const [isEditModal, setIsEditModal] = useState<boolean>(false);

  const toggleTodoStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const result = todos.map((_todo) =>
      _todo._id === todo._id
        ? { ..._todo, isComplete: !_todo.isComplete }
        : _todo
    );

    changeTodo(result);

    await requestHandler(
      async () => await toggleTodoStatusApi(todo._id),
      null,
      (res) => {
        const { data } = res;

        const result = todos?.map((_todo) =>
          _todo._id === data._id
            ? { ..._todo, isComplete: data.isComplete }
            : _todo
        );

        changeTodo(result);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  const deleteTodoHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await requestHandler(
      async () => await deleteTodoApi(todo._id),
      setDeleteLoading,
      (res) => {
        const { data } = res;

        const result = todos?.filter(
          (todo) => todo._id !== data.deletedTodo._id
        );

        changeTodo(result);

        toast.success(res.message);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  return (
    <>
      {isEditModal && (
        <DetailAndEditModal onClose={() => setIsEditModal(false)} todo={todo} />
      )}
      <div
        role="button"
        onClick={() => setIsEditModal(true)}
        className="flex border-[1.5px] border-t-0 border-white cursor-default w-full items-center  py-3 px-3"
      >
        <button
          onClick={toggleTodoStatus}
          className={classNames(
            "p-1 border-[1px] rounded-sm w-5 h-5 md:w-6 md:h-6 flex items-center justify-center",
            todo.isComplete ? "bg-green-600 text-white" : "bg-black text-black"
          )}
        >
          <FaCheck className="text-xs" />
        </button>

        <div className="flex flex-col  justify-center ml-4 mr-4">
          <p
            className={classNames(
              "text-base md:text-lg flex items-center gap-4",
              todo.isComplete ? " opacity-50" : ""
            )}
          >
            <span
              className={classNames(
                "line-clamp-1",
                todo.isComplete ? "line-through" : ""
              )}
            >
              {todo.title}
            </span>
            <span className="hidden sm:block md:text-base text-gray-400 ">
              ( {moment(todo.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
              ago )
            </span>
          </p>
          <p
            className={classNames(
              "opacity-75 text-xs sm:text-sm md:text-base line-clamp-1",
              todo.isComplete ? "hidden" : ""
            )}
          >
            {todo.description.substring(0, 50)}
            {todo.description.length > 50 ? "..." : ""}
          </p>
        </div>

        <div className="ml-auto flex flex-shrink-0 gap-2">
          <button
            onClick={deleteTodoHandler}
            disabled={deleteLoading}
            className="bg-red-500 p-2 md:p-3 md:text-lg  rounded-md"
          >
            {deleteLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <MdDelete />
            )}
          </button>

          <button
            onClick={() => setIsEditModal(true)}
            className="bg-purple-500 p-2 md:p-3 md:text-lg rounded-md"
          >
            <MdEdit />
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoCard;
