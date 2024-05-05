import { AxiosError } from "axios";

export class ApiErrorResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: [],
    public stack: string
  ) {}
}
class ApiError {
  public error: boolean = true;
  constructor(
    public errorMessage: string,
    public errorData?: AxiosError,
    public errorResponse?: ApiErrorResponse
  ) {}
}

export default ApiError;
