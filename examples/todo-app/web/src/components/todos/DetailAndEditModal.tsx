import React, { useEffect, useRef, useState } from "react";
import ModalContainer from "../ModalContainer";
import { RxCross2 } from "react-icons/rx";
import Input from "../Input";
import Button from "../Button";
import { MdEdit } from "react-icons/md";
import { requestHandler } from "../../utils";
import { TodoInterface } from "../../interfaces/todo";
import { editTodo } from "../../api";
import toast from "react-hot-toast";
import { useTodo } from "../../context/TodoContext";

const DetailAndEditModal: React.FC<{
  onClose: () => void;
  todo: TodoInterface;
}> = ({ onClose, todo }) => {
  const { todos, changeTodo } = useTodo();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (title.length < 1) {
      toast.error("Please Enter Valid Title !");
      return;
    }

    if (description.length < 1) {
      toast.error("Please Enter Valid Description !");
      return;
    }

    await requestHandler(
      async () => await editTodo(todo._id, { title, description }),
      setEditLoading,
      (res) => {
        const { data } = res;

        const result = todos?.map((todo) =>
          todo._id === data._id ? { ...data } : todo
        );
        changeTodo(result);
        toast.success(res.message);
        onClose();
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  useEffect(() => {
    setTitle(todo.title), setDescription(todo.description);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <ModalContainer>
      <div className="relative border-[1px] bg-zinc-950 bg-opacity-95  border-white/75 flex flex-col items-center p-5 rounded-lg w-[95%] max-w-xl">
        <div
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-2 text-2xl p-2 transition-all rounded-md hover:bg-white hover:text-black"
        >
          <RxCross2 />
        </div>
        <h1 className="text-xl pb-2 border-b-2 sm:text-3xl md:text-4xl my-4 mb-8">
          {isEditing ? "Edit the task" : "Task Details"}
        </h1>

        {isEditing ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter a Todo..."
            />
            <textarea
              className="bg-transparent rounded-xl focus:border-purple-500 outline-none border-[1px] px-5 py-3 text-base md:text-lg border-white"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter its Description..."
              rows={6}
            />

            <div className="mt-10 flex justify-around gap-4">
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onClose();
                }}
                severity="primary"
                className="bg-red-600 w-[40%] text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-[40%]"
                severity="primary"
                loading={editLoading}
              >
                <MdEdit />
                Edit
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 w-full max-h-[75vh]">
            <h1 className="rounded-xl outline-none border-[1px] px-5 py-3 text-base md:text-lg border-white">
              {todo.title}
            </h1>

            <p className="rounded-xl overflow-auto outline-none border-[1px] px-5 py-3 text-base md:text-lg border-white">
              {todo.description}
            </p>

            <Button
              onClick={() => {
                setIsEditing(true);
              }}
              className="mt-10 mx-auto max-w-[400px]"
              fullWidth={true}
              severity="primary"
              loading={editLoading}
            >
              <MdEdit />
              Edit
            </Button>
          </div>
        )}
      </div>
    </ModalContainer>
  );
};

export default DetailAndEditModal;
