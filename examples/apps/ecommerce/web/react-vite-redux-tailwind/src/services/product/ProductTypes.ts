import { DEFAULT_CURRENCY } from "../../data/applicationData";

export class ImageClass {
  constructor(
    public url: string,
    public localPath: string,
    public _id: string
  ) {}
}
export class Product {
  constructor(
    public _id: string,
    public category: string /* Category Id */,
    public description: string,
    public mainImage: ImageClass,
    public name: string,
    public owner: string /* User ID */,
    public price: number,
    public stock: number,
    public subImages: Array<ImageClass>,
    public __v: number,
    public createdAt: string,
    public updatedAt: string,
    public previousPrice?: number,
    public currency: string = DEFAULT_CURRENCY

  ) {}
}

export class Products {
    constructor(
        public products: Array<Product>,
        public totalProducts: number,
        public limit: number,
        public page: number,
        public totalPages: number,
        public serialNumberStartFrom: number,
        public hasPrevPage: boolean,
        public hasNextPage: boolean,
        public prevPage: number,
        public nextPage: number,
        public category?: {_id: string, name: string}
    ){

    }
 
}
