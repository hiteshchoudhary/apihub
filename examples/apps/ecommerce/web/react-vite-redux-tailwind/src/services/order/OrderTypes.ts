import { PAYMENT_TYPES } from "../../data/applicationData";
import { AddressClass } from "../address/AddressTypes";
import { Product } from "../product/ProductTypes";

export class GeneratePayPalOrderResponseClass {
  constructor(
    public id: string,
    public links: Array<{
      href: string;
      method: string;
      rel: string;
    }>,
    public status: string
  ) {}
}

export class OrderClass {
  constructor(
    public __v:number,
    public _id:string,
    public address: AddressClass,
    public coupon: string,
    public createdAt: string,
    public customer: {
      _id: string,
      email: string,
      username: string
    },
    public discountedOrderPrice: number,
    public isPaymentDone: boolean,
    public orderPrice: number,
    public paymentId: string,
    public paymentProvider: PAYMENT_TYPES.PAYPAL,
    public status: string,
    public totalOrderItems: number,
    public updatedAt: string
  ){

  }
}

export class OrderListClass {
  constructor(
    public hasNextPage: boolean,
    public hasPrevPage: boolean,
    public limit: number,
    public nextPage: number,
    public orders: Array<OrderClass>,
    public page: number,
    public prevPage: number,
    public serialNumberStartFrom: number,
    public totalOrders: number,
    public totalPages: number
  ){

  }
}

export class OrderItemClass {
  constructor(
    public _id: string,
    public product: Product,
    public quantity: number
  ){

  }
}
export class OrderDetailClass {
  constructor(
    public _id: string,
    public order: {
      __v: number,
      _id: string,
      address: AddressClass,
      coupon: {
        _id: string,
        couponCode: string,
        name: string
      },
      createdAt: string,
      customer: {
        _id: string,
        email: string,
        username: string
      },
      discountedOrderPrice: number,
      isPaymentDone: boolean,
      items: Array<OrderItemClass>,
      orderPrice: number,
      paymentId: string,
      paymentProvider: string,
      status: string,
      updatedAt: string
    }

  )  {

  }
}

