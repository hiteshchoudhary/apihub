import {
  categoryDescriptionMapping,
  categoryNumberMapping,
  colorCodeMapping,
} from "@/constants";
import { StatusListType, codesType } from "./types";

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

export { processCodes };
