import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { classNames } from "../utils";

const Select: React.FC<{
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: { value: string; label: string }) => void;
  placeholder: string;
}> = ({ options, value, placeholder, onChange }) => {
  const [localOptions, setLocalOptions] = useState<typeof options>([]);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <Combobox
      className={"w-full"}
      as="div"
      value={options.find((o) => o.value === value)}
      onChange={(val: any) => onChange(val)}
    >
      <div className="relative mt-2">
        <Combobox.Button className="w-full">
          <Combobox.Input
            placeholder={placeholder}
            className="block w-full rounded-xl border-0 py-4 px-5 bg-secondary outline outline-[1px] outline-zinc-400 text-white font-light placeholder:text-white/70 focus:ring-[1px] focus:ring-white"
            onChange={(e) => {
              setLocalOptions(
                options.filter((op) => op.label.includes(e.target.value))
              );
            }}
            displayValue={(option: (typeof options)[0]) => option?.label}
          />
        </Combobox.Button>
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {localOptions.length > 0 && (
          <Combobox.Options className="outline outline-[1px] outline-zinc-400 absolute z-10 mt-2 p-2 max-h-60 w-full overflow-auto rounded-2xl bg-secondary text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
            {localOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  classNames(
                    "cursor-pointer relative rounded-2xl select-none py-4 pl-3 pr-9",
                    active ? "bg-dark text-white" : "text-white"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {option.label}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Select;
