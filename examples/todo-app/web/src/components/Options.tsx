import { classNames } from "../utils";

const Options = ({
  title,
  count,
  isActive,
  onClick,
}: {
  title: string;
  count: number | null;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "p-2 hover:bg-zinc-700 text-sm md:text-base transition rounded-md cursor-pointer",
        isActive ? "bg-zinc-700" : ""
      )}
    >
      {title} {count && `(${count})`}
    </div>
  );
};

export default Options;
