import { PageContainer } from "@/layout";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStatusCodeStore } from "@/store/statusCodes.store";

export default function FindCode() {
  const { HTTPStatusCodesList } = useStatusCodeStore((state) => state);
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a code" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(HTTPStatusCodesList).map((key) => {
              const { title, statusCodes } = HTTPStatusCodesList[key];
              return (
                <SelectGroup key={key}>
                  <SelectLabel>{title}</SelectLabel>
                  {statusCodes.map(({ code, message }) => (
                    <SelectItem key={code} value={code}>
                      {message}
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </PageContainer>
  );
}
