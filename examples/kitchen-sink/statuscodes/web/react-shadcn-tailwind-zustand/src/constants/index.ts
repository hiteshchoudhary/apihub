import { MappingType } from "./types";

const colorCodeMapping: MappingType = {
  Informational: "#F2C94C",
  Success: "#6FCF97",
  Redirection: "#56CCF2",
  "Client Error": "#EB5757",
  "Server Error": "#F2994A",
  Unofficial: "#C1C1C1",
};

const categoryNumberMapping: MappingType = {
  Informational: "1xx",
  Success: "2xx",
  Redirection: "3xx",
  "Client Error": "4xx",
  "Server Error": "5xx",
};

const categoryDescriptionMapping: MappingType = {
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

export { colorCodeMapping, categoryNumberMapping, categoryDescriptionMapping };
