class ApiResponse<T> {
  constructor(
    public statusCode: number,
    public data: T,
    public message: string,
    public success: boolean
  ) {}
}

export default ApiResponse;
