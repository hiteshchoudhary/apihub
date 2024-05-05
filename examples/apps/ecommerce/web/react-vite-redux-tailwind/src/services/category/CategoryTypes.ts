export class Category {
  constructor(
    public _id: string,
    public name: string,
    public owner: string,
    public __v: number,
    public createdAt: string,
    public updatedAt: string
  ) {}
}

export class Categories {
  constructor(
    public categories: Array<Category>,
    public totalCategories: number,
    public limit: number,
    public page: number,
    public totalPages: number,
    public serialNumberStartFrom: number,
    public hasPrevPage: boolean,
    public hasNextPage: boolean,
    public prevPage: number,
    public nextPage: number
  ) {}
}
