import { PageContainer } from "@/layout";
import { useAppStore } from "@/store/store";
import { useEffect, useState } from "react";

import ComboBox, { optionsTypes } from "./components/ComboBox";
import { Card } from "@/components/ui/card";
import { colorCodeMapping } from "@/constants";

export default function FindCode() {
  const { HTTPStatusCodesList } = useAppStore((state) => state);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<{
    [key: string]: string;
  }>({});

  const options: optionsTypes = {};

  Object.keys(HTTPStatusCodesList)?.map((codeGroup) => {
    options[codeGroup] = {
      groupList: HTTPStatusCodesList[codeGroup].statusCodes.map((code) => {
        return {
          label: code.code,
          value: code.code,
        };
      }),
    };
  });

  useEffect(() => {
    if (value) {
      const _selectedOption: {
        [key: string]: string;
      } = {};
      Object.keys(HTTPStatusCodesList)?.forEach((codeGroup) => {
        HTTPStatusCodesList[codeGroup].statusCodes.map((code) => {
          if (value && `${code.code}` === `${value}`) {
            _selectedOption.codeGroup = codeGroup;
            _selectedOption.code = code.code;
            _selectedOption.message = code.message;
            _selectedOption.description = code.description;
          }
        });
      });
      setSelectedOption(_selectedOption);
    }
  }, [HTTPStatusCodesList, value]);

  const color = colorCodeMapping[selectedOption.codeGroup];
  return (
    <PageContainer>
      <div className="flex flex-col justify-center w-full gap-8">
        <ComboBox
          open={open}
          setOpen={setOpen}
          options={options}
          value={value}
          setValue={setValue}
          emptyMessage="No code selected.."
          placeholder="Search Code.."
        />
        {!!value && (
          <Card className="w-full p-4 mt-8" style={{ backgroundColor: color }}>
            <div
              className="flex flex-col gap-4 bg-[rgba(255,255,255,0.1)] p-4"
              style={{ borderRadius: "8px" }}
            >
              <div>
                <strong>Category:</strong> {selectedOption.codeGroup}
              </div>
              <div>
                <strong>Code:</strong> {selectedOption.code}
              </div>
              <div>
                <strong>Message:</strong> {selectedOption.message}
              </div>
              <div>
                <strong>Description:</strong> {selectedOption.description}
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
