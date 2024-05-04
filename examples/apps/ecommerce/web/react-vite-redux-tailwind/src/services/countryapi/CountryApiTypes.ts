export class CountryApiErrorResponse {
  constructor(public error: boolean, public msg: string) {}
}
export class CountryApiResponse<T> {
  constructor(public error: boolean, public msg: string, public data: T) {}
}

export type STATE_TYPE = {
  name: string,
  state_code: string
}
export class StatesOfACountryResponse {
  constructor(
    public name: string,
    public iso3: string,
    public iso2: string,
    public states: Array<STATE_TYPE>
  ) {}
}

