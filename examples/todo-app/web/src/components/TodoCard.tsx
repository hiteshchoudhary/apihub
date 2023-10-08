import { TodoItemInterface } from "../interfaces/todo";
import { AiOutlineDelete } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useState } from "react";
import { handleRequest } from "../utils";
import { editTodo, toggleCheck } from "../utils/api";
import toast from "react-hot-toast";
import DetailAndEditModal from "./DetailAndEditModal";

interface Props {
  todo: TodoItemInterface;
  key: string;
  handleDelete: (todoId: string) => void;
  getTodoshandler: () => void;
}

const TodoCard = ({ todo, handleDelete, getTodoshandler }: Props) => {
  const { isComplete, description, title } = todo;
  const [checked, setChecked] = useState(false);
  const [toggleLoading, setToggleloading] = useState(false);
  const [isEditLoading, setIsEdittLoading] = useState(false);

  const [isModal, setIsModal] = useState(false);

  const EditHandler = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    handleRequest(
      async () => await editTodo(todo._id, { title, description }),
      setIsEdittLoading,
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

  const handleToggleCheck = async (e: any) => {
    e.stopPropagation();
    handleRequest(
      async () => await toggleCheck(todo._id),
      setToggleloading,
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

  return (
    <>
      {isModal && (
        <DetailAndEditModal
          onClose={() => setIsModal(false)}
          _description={description}
          _title={title}
          Edithandler={EditHandler}
          isEditLoading={isEditLoading}
        />
      )}
      <div
        role="button"
        onClick={() => setIsModal(true)}
        className=" hover:cursor-pointer group relative flex justify-start items-center mt-2 mx-3 p-3 bg-zinc-800 rounded-lg"
      >
        {isComplete && (
          <div className="h-[4px]  bg-slate-400 w-full  opacity-70 absolute left-0" />
        )}

        <div className="flex-1">
          <p className="flex-1 p-2">{title}</p>
        </div>

        <div
          onClick={handleToggleCheck}
          className={` z-10 hidden group-hover:block p-1 ${
            isComplete
              ? "bg-black bg-opacity-100"
              : "bg-purple-500 opacity-70 w-5 h-5 border-1 "
          } rounded-sm  m-4`}
        >
          {isComplete && <TiTick className="text-green-600 text-xl" />}
        </div>
        <button
          className="z-10 hidden group-hover:block text-xl bg-red-700 text-white hover:bg-red-800 p-2 rounded-md  hover:text-white "
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(todo._id);
          }}
        >
          <AiOutlineDelete />
        </button>
      </div>
    </>
  );
};

export default TodoCard;
