import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";

export interface optionsTypes {
  [key: string]: {
    groupList: {
      label: string;
      value: string;
    }[];
  };
}
interface ComboBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  options: optionsTypes;
  emptyMessage: string;
  placeholder: string;
}
export default function ComboBox(props: ComboBoxProps) {
  const { open, setOpen, value, setValue, options, emptyMessage, placeholder } =
    props;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-black"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {Object.keys(options)?.map((codeGroup) => {
            const codes = options[codeGroup]?.groupList;
            return (
              <CommandGroup key={codeGroup} heading={codeGroup}>
                <CommandList>
                  {codes?.map((code) => {
                    return (
                      <CommandItem
                        key={code.value}
                        value={code.value}
                        onSelect={(value) => {
                          setValue(value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            `${value}` === `${code.value}`
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {code.value}
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </CommandGroup>
            );
          })}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
