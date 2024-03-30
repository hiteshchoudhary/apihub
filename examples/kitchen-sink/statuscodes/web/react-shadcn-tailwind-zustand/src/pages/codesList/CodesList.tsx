import { PageContainer } from "@/layout";
import { StatusAccordian } from "./components";
import { useAppStore } from "@/store/store";

export default function CodesList() {
  const { HTTPStatusCodesList } = useAppStore((state) => state);
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <h1 className="text-4xl">HTTP STATUS Codes</h1>
        <div className="flex flex-col w-full gap-8">
          {Object.keys(HTTPStatusCodesList)
            .sort((a, b) =>
              a === "Unofficial" ? 1 : b === "Unofficial" ? -1 : 0
            )
            .map((status) => {
              const statusData = HTTPStatusCodesList[status];
              return <StatusAccordian {...statusData} key={statusData.title} />;
            })}
        </div>
      </div>
    </PageContainer>
  );
}
