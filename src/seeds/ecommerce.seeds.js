import { faker } from "@faker-js/faker";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/apps/ecommerce/category.models.js";
import { User } from "../models/apps/auth/user.models.js";
import {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  UserRolesEnum,
} from "../constants.js";
import { Address } from "../models/apps/ecommerce/address.models.js";
import { getRandomNumber } from "../utils/helpers.js";
import { Coupon } from "../models/apps/ecommerce/coupon.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/apps/ecommerce/product.models.js";
import { EcomOrder } from "../models/apps/ecommerce/order.models.js";

const categories = new Array(20).fill("_").map(() => ({
  name: faker.commerce.productAdjective().toLowerCase(),
}));

const addresses = new Array(100).fill("_").map(() => ({
  addressLine1: faker.location.streetAddress(),
  addressLine2: faker.location.street(),
  city: faker.location.city(),
  country: faker.location.country(),
  pincode: faker.location.zipCode("######"),
  state: faker.location.state(),
}));

const coupons = new Array(15).fill("_").map(() => {
  const discountValue = faker.number.int({
    max: 1000,
    min: 100,
  });

  return {
    name: faker.lorem.word({
      length: {
        max: 15,
        min: 8,
      },
    }),
    couponCode:
      faker.lorem.word({
        length: {
          max: 8,
          min: 5,
        },
      }) + `${discountValue}`,
    discountValue: discountValue,
    isActive: faker.datatype.boolean(),
    minimumCartValue: discountValue + 300,
    startDate: faker.date.anytime(),
    expiryDate: faker.date.future({
      years: 3,
    }),
  };
});

const products = new Array(50).fill("_").map(() => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    mainImage: {
      url: faker.image.urlLoremFlickr({
        category: "product",
      }),
      localPath: "",
    },
    price: +faker.commerce.price({ dec: 0, min: 200, max: 2000 }),
    stock: +faker.commerce.price({ dec: 0, min: 10, max: 200 }),
    subImages: new Array(4).fill("_").map(() => ({
      url: faker.image.urlLoremFlickr({
        category: "product",
      }),
      localPath: "",
    })),
  };
});

const orders = new Array(15).fill("_").map(() => {
  const paymentProvider =
    AvailablePaymentProviders[
      getRandomNumber(AvailablePaymentProviders.length)
    ];
  return {
    status:
      AvailableOrderStatuses[getRandomNumber(AvailableOrderStatuses.length)],
    paymentProvider: paymentProvider === "UNKNOWN" ? "PAYPAL" : paymentProvider,
    paymentId: faker.string.alphanumeric({
      casing: "mixed",
      length: 24,
    }),
    isPaymentDone: true,
  };
});

const seedCategories = async (owner) => {
  await Category.deleteMany({});
  await Category.insertMany(
    categories.map((cat) => ({ ...cat, owner: owner }))
  );
};

const seedAddresses = async () => {
  const users = await User.find();
  await Address.deleteMany({});
  await Address.insertMany(
    addresses.map((add) => ({
      ...add,
      owner: users[getRandomNumber(users.length)],
    }))
  );
};

const seedCoupons = async (owner) => {
  await Coupon.deleteMany({});
  await Coupon.insertMany(
    coupons.map((coupon) => ({ ...coupon, owner: owner }))
  );
};

const seedProducts = async () => {
  const users = await User.find();
  const categories = await Category.find();

  await Product.deleteMany({});
  await Product.insertMany(
    products.map((product) => ({
      ...product,
      owner: users[getRandomNumber(users.length)],
      category: categories[getRandomNumber(categories.length)],
    }))
  );
};

const seedOrders = async () => {
  const customers = await User.find();
  const coupons = await Coupon.find();
  const products = await Product.find();
  const addresses = await Address.find();

  const orderItems = products
    .slice(0, getRandomNumber(products.length - 10))
    .map((prod) => {
      const orderItem = {
        productId: prod._id,
        quantity: +faker.commerce.price({ dec: 0, min: 1, max: 5 }),
      };
      const orderPrice = prod.price * orderItem.quantity;
      let coupon = coupons[getRandomNumber(coupons.length + 20)] ?? null;
      let discountedOrderPrice = orderPrice;
      if (coupon && coupon.minimumCartValue <= orderPrice) {
        discountedOrderPrice -= coupon.discountValue;
      } else {
        coupon = null;
      }
      return {
        items: [orderItem],
        orderPrice,
        discountedOrderPrice,
        coupon,
      };
    });

  await EcomOrder.deleteMany({});
  await EcomOrder.insertMany(
    orders.map((order) => {
      const customer = customers[getRandomNumber(customers.length)];
      const orderData = orderItems[getRandomNumber(orderItems.length)];
      return {
        ...order,
        customer,
        address:
          addresses.find(
            (add) => add.owner?.toString() === customer?._id.toString()
          )?._id ?? addresses[getRandomNumber(addresses.length)],
        items: orderData.items,
        coupon: orderData.coupon,
        orderPrice: orderData.orderPrice,
        discountedOrderPrice: orderData.discountedOrderPrice,
      };
    })
  );
};

const seedEcommerce = asyncHandler(async (req, res) => {
  const owner = await User.findOne({
    role: UserRolesEnum.ADMIN,
  });

  if (!owner) {
    throw new ApiError(
      500,
      "Something went wrong while seeding the data. Please try again once"
    );
  }

  await seedCategories(owner._id);
  await seedAddresses();
  await seedCoupons(owner._id);
  await seedProducts();
  await seedOrders();
  return res
    .status(201)
    .json(
      new ApiResponse(201, {}, "Database populated for ecommerce successfully")
    );
});

export { seedEcommerce };
