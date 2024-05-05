export enum COUPON_TYPES {
    FLAT = "FLAT"
}

export class CouponClass {
    constructor(
        public _id: string,
        public __v: number,
        public couponCode: string,
        public createdAt: string,
        public discountValue: number,
        public expiryDate: string,
        public isActive: boolean,
        public minimumCartValue: number,
        public name: string,
        public owner: string,
        public startDate: string,
        public type: COUPON_TYPES,
        public updatedAt: string
    ){

    }
}

export class CouponListClass {
    constructor(
        public coupons: Array<CouponClass>,
        public hasNextPage: boolean,
        public hasPrevPage: boolean,
        public limit: number,
        public nextPage: number,
        public prevPage: number,
        public serialNumberStartFrom: number,
        public page: number,
        public totalCoupons: number,
        public totalPages: number
    ){}
}
