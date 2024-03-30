import { PageContainer } from "@/layout";

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
import { useStatusCodeStore } from "@/store/statusCodes.store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";

export default function FindCode() {
  const { HTTPStatusCodesList } = useStatusCodeStore((state) => state);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const allCodes = [];
  if (!HTTPStatusCodesList) return null;
  for (const codeGroup in HTTPStatusCodesList) {
    const codes = HTTPStatusCodesList[codeGroup].statusCodes;
    const codeGroupCodes = codes.map((code) => ({
      label: code.code,
      code: code.description,
    }));
    allCodes.push(...codeGroupCodes);
  }

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? allCodes.find((code) => code.code === value)?.label
                : "Select framework..."}
              <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {allCodes.map((code) => (
                    <CommandItem
                      key={code.label}
                      onClick={() => {
                        setValue(code.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between px-4 py-2",
                        value === code.code && "bg-gray-100"
                      )}
                    >
                      <span>{code.label}</span>
                      {value === code.code && <Check />}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </PageContainer>
  );
}
