export class AddressClass {
  constructor(
    public __v: number,
    public _id: string,
    public addressLine1: string,
    public addressLine2: string,
    public city: string,
    public country: string,
    public createdAt: string,
    public owner: string,
    public pincode: string,
    public state: string,
    public updatedAt: string
  ) {}
}

export class AddressListClass {
  constructor(
    public addresses: Array<AddressClass>,
    public hasNextPage: boolean,
    public hasPrevPage: boolean,
    public limit: number,
    public nextPage: number,
    public page: number,
    public prevPage: number,
    public serialNumberStartFrom: number,
    public totalAddresses: number,
    public totalPages: number
  ){}
}
