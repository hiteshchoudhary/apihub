import { PageContainer } from "@/layout";
import { StatusAccordian } from "./components";
import {
  StatusListType,
  categoryDescriptionMappingType,
  categoryNumberMappingType,
  codesType,
  colorCodeMappingType,
} from "./components/types";
import { useEffect, useState } from "react";

const colorCodeMapping: colorCodeMappingType = {
  Informational: "#F2C94C",
  Success: "#6FCF97",
  Redirection: "#56CCF2",
  "Client Error": "#EB5757",
  "Server Error": "#F2994A",
  Unofficial: "#C1C1C1",
};

const categoryNumberMapping: categoryNumberMappingType = {
  Informational: "1xx",
  Success: "2xx",
  Redirection: "3xx",
  "Client Error": "4xx",
  "Server Error": "5xx",
};

const categoryDescriptionMapping: categoryDescriptionMappingType = {
  Informational:
    "An informational response code informs the client that the request is continuing",
  Success:
    "A successful response was received, interpreted corrected, and has been accepted",
  Redirection:
    "A redirection indicates that further action needs to take place before the request is completed",
  "Client Error":
    "A client error indicates that the request cannot be completed because of an issue with the client, or the syntax of the request",
  "Server Error":
    "An informational response code informs the client that the request is continuing",
};
async function processCodes(): Promise<StatusListType> {
  const HTTPStatusCodesList: StatusListType = {};
  try {
    const result = await fetch(
      "https://api.freeapi.app/api/v1/kitchen-sink/status-codes"
    ).then((res) => res.json());
    const codes: codesType = result.data;
    for (const key in codes) {
      const code = codes[key];
      if (HTTPStatusCodesList[code.category]) {
        HTTPStatusCodesList[code.category].statusCodes.push({
          code: code.statusCode,
          message: code.statusMessage,
          description: code.description,
        });
      } else {
        const categoryNumber = categoryNumberMapping[code.category] ?? "";
        const categoryDescription =
          categoryDescriptionMapping[code.category] ?? "";
        HTTPStatusCodesList[code.category] = {
          statusCodes: [
            {
              code: code.statusCode,
              message: code.statusMessage,
              description: code.description,
            },
          ],
          colorCode: colorCodeMapping[code.category],
          description: categoryDescription,
          title: `${categoryNumber !== "" ? `${categoryNumber}:` : ""} ${code.category}`,
        };
      }
    }

    return HTTPStatusCodesList;
  } catch (error) {
    console.error({ error });
  }

  return HTTPStatusCodesList;
}
export default function CodesList() {
  const [statusCodesList, setStatusCodesList] = useState<StatusListType>({});

  useEffect(() => {
    processCodes().then((data) => {
      setStatusCodesList(data);
    });
  }, []);
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <h1 className="text-4xl">HTTP STATUS Codes</h1>
        <div className="flex flex-col w-full gap-8">
          {Object.keys(statusCodesList)
            .sort((a, b) =>
              a === "Unofficial" ? 1 : b === "Unofficial" ? -1 : 0
            )
            .map((status) => {
              const statusData = statusCodesList[status];
              return <StatusAccordian {...statusData} key={statusData.title} />;
            })}
        </div>
      </div>
    </PageContainer>
  );
}
