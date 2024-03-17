import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusAccordianType } from "./types";

export default function StatusAccordian(props: StatusAccordianType) {
  const { statusCodes, colorCode, title, description } = props;
  return (
    <div
      className={`flex flex-col h-full p-4 text-black rounded-md gap-3 w-full`}
      style={{ backgroundColor: colorCode }}
    >
      <h1 className="text-2xl leading-5">{title}</h1>
      <p className="text-xl">{description}</p>
      <div className="flex flex-col p-6 bg-[rgba(255,255,255,0.3)] rounded-md gap-3 w-full">
        {statusCodes.map((status) => (
          <Accordion type="single" collapsible key={status.code}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {`${status.code} ${status.message}`}{" "}
              </AccordionTrigger>
              <AccordionContent>
                <p>{status.description}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
