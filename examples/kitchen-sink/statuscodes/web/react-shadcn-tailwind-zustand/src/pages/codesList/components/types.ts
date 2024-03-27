export interface StatusAccordianType {
  statusCodes: {
    code: string;
    message: string;
    description: string;
  }[];
  colorCode: string;
  description: string;
  title: string;
}

export interface StatusListType {
  [key: string]: StatusAccordianType;
}

export interface codesType {
  [key: string]: {
    category: string;
    description: string;
    statusCode: string;
    statusMessage: string;
  };
}
export interface colorCodeMappingType {
  [key: string]: string;
}
export interface categoryNumberMappingType {
  [key: string]: string;
}

export interface categoryDescriptionMappingType {
  [key: string]: string;
}
