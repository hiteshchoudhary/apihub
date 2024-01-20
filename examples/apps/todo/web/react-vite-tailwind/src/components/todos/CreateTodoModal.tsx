import { useState } from "react";
import Button from "../Button";
import ModalContainer from "../ModalContainer";
import Input from "../Input";
import { FaCirclePlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useTodo } from "../../context/TodoContext";
import toast from "react-hot-toast";

const CreateTodoModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { createLoading, createTodo } = useTodo();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.length < 1) {
      toast.error("Please Enter Valid Title !");
      return;
    }

    if (description.length < 1) {
      toast.error("Please Enter Valid Description !");
      return;
    }

    await createTodo(title, description);

    onClose();
  };

  return (
    <ModalContainer>
      <div className="relative border-[1px] bg-zinc-900 bg-opacity-95  border-white/75 flex flex-col items-center p-5 rounded-lg w-[95%] max-w-xl">
        <div
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-2 text-2xl p-2 transition-all rounded-md hover:bg-white hover:text-black"
        >
          <RxCross2 />
        </div>
        <h1 className="text-xl pb-2 border-b-2 sm:text-3xl md:text-4xl my-4 mb-8">
          Create A New Task
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Enter a task..."
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
          <Button
            type="submit"
            className="mt-10 mx-auto max-w-[400px]"
            fullWidth={true}
            severity="primary"
            loading={createLoading}
          >
            <FaCirclePlus />
            Add
          </Button>
        </form>
      </div>
    </ModalContainer>
  );
};

export default CreateTodoModal;
