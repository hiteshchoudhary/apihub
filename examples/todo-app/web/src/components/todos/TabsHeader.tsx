import { FaCirclePlus } from "react-icons/fa6";
import Button from "../Button";
import Options from "../Options";
import { useTodo } from "../../context/TodoContext";

const TabsHeader = ({
  openCreateTodoModal,
  selectedOption,
  setSelectedOption,
  query,
}: {
  openCreateTodoModal: () => void;
  selectedOption: string;
  setSelectedOption: (slectedOption: string) => void;
  query: string;
}) => {
  const { getFilteredTodos, todos } = useTodo();

  const optionsList = [
    {
      title: "All Todos",
      slug: "all",
    },
    {
      title: "Pending",
      slug: "pending",
    },
    {
      title: "Completed",
      slug: "completed",
    },
  ];

  return (
    <>
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
            count={option.slug === selectedOption ? todos.length : null}
            onClick={async () => {
              setSelectedOption(option.slug);
              let complete: boolean | null =
                option.slug === "pending"
                  ? false
                  : option.slug === "completed"
                  ? true
                  : null;
              await getFilteredTodos(query, complete);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default TabsHeader;
