import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface Props {
  onClose: () => void;
  createHandler: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => void;
  isCreateLoading: boolean;
}

const CreateTodoModal = ({
  onClose,

  createHandler,
  isCreateLoading,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const create = (e: any) => {
    e.preventDefault();
    createHandler({ title, description });
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-screen flex justify-center backdrop-blur-sm items-center z-20 ">
        <div className="flex flex-col gap-3 w-[80%] items-start bg-black bg-opacity-70 p-4">
          <h1 className="bold text-center w-full text-xl text-[#a7a7a7] font-semibold mb-5">
            Details And Edit
          </h1>

          <div className="flex flex-col gap-3 mb-4 w-full">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              value={title}
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              className="px-2 py-2 rounded-lg bg-[#1d1d1d] outline-none border-b-2 w-full focus:border-b-purple-800"
            />
          </div>

          <div className="flex flex-col gap-3 w-full mb-4">
            <label htmlFor="description">Description</label>

            <textarea
              value={description}
              className="w-full bg-[#1d1d1d] rounded-lg p-3 outline-none border-2 border-transparent focus:border-purple-800"
              id="description"
              cols={100}
              rows={10}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="w-full flex justify-around">
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              disabled={isCreateLoading}
              className="px-3 py-2 bg-slate-800 rounded-md hover:bg-slate-900 "
            >
              Cancel
            </button>

            <button
              disabled={isCreateLoading}
              onClick={create}
              className="px-3 py-2 bg-purple-800 rounded-md hover:bg-purple-900 "
            >
              {isCreateLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTodoModal;
