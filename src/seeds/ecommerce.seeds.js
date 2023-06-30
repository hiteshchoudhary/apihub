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
import {
  ADDRESSES_COUNT,
  CATEGORIES_COUNT,
  COUPONS_COUNT,
  ORDERS_COUNT,
  ORDERS_RANDOM_ITEMS_COUNT,
  PRODUCTS_COUNT,
  PRODUCTS_SUB_IMAGES_COUNT,
} from "./_constants.js";

// Generate fake categories
const categories = new Array(CATEGORIES_COUNT).fill("_").map(() => ({
  name: faker.commerce.productAdjective().toLowerCase(),
}));

// Generate fake addresses
const addresses = new Array(ADDRESSES_COUNT).fill("_").map(() => ({
  addressLine1: faker.location.streetAddress(),
  addressLine2: faker.location.street(),
  city: faker.location.city(),
  country: faker.location.country(),
  pincode: faker.location.zipCode("######"),
  state: faker.location.state(),
}));

// Generate fake coupons
const coupons = new Array(COUPONS_COUNT).fill("_").map(() => {
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

// Generate fake products
const products = new Array(PRODUCTS_COUNT).fill("_").map(() => {
  return {
    // Add other fields which are connected to other models later
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    mainImage: {
      url: faker.image.urlLoremFlickr({
        category: "product",
      }),
      localPath: "",
    },
    price: +faker.commerce.price({ dec: 0, min: 200, max: 500 }),
    stock: +faker.commerce.price({ dec: 0, min: 10, max: 200 }),
    subImages: new Array(PRODUCTS_SUB_IMAGES_COUNT).fill("_").map(() => ({
      url: faker.image.urlLoremFlickr({
        category: "product",
      }),
      localPath: "",
    })),
  };
});

const orders = new Array(ORDERS_COUNT).fill("_").map(() => {
  const paymentProvider =
    AvailablePaymentProviders[
      getRandomNumber(AvailablePaymentProviders.length)
    ];
  return {
    // Add other fields which are connected to other models later
    status:
      AvailableOrderStatuses[getRandomNumber(AvailableOrderStatuses.length)],
    paymentProvider: paymentProvider === "UNKNOWN" ? "PAYPAL" : paymentProvider, // Avoid setting UNKNOWN payment provider
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
      owner: users[getRandomNumber(users.length)], // set random user as a owner
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
      owner: users[getRandomNumber(users.length)], // set random user as a owner
      category: categories[getRandomNumber(categories.length)], // set random category
    }))
  );
};

const seedOrders = async () => {
  const customers = await User.find();
  const coupons = await Coupon.find();
  const products = await Product.find();
  const addresses = await Address.find();

  /**
   * @type {{orderItems: {productId: string; quantity: number}[], orderPrice: number, discountedOrderPrice: number; coupon: Coupon | null}[]}
   * @description this variable holds array of random order items array, coupon, calculated total and discounted price
   */
  const orderPayload = new Array(ORDERS_RANDOM_ITEMS_COUNT)
    .fill("_")
    .map(() => {
      const totalOrderProducts = getRandomNumber(5); // get total products to be included in the order items

      // map through the available products
      const orderItems = products
        .slice(0, totalOrderProducts > 1 ? totalOrderProducts : 2) // We need at least 1 product in the items array
        .map((prod) => ({
          productId: prod._id, // this field we need to add while creating the order
          quantity: +faker.commerce.price({ dec: 0, min: 1, max: 5 }), // this field we need to add while creating the order
          price: prod.price, // this field we need to calculate total order price
        }));

      // calculate total order price based on product price and it's quantity
      const orderPrice = orderItems.reduce(
        (prev, curr) => prev + curr.price * curr.quantity,
        0
      );

      // Randomly assign or ignore coupon
      // If we find any coupon we set it, if the index is out of range (we are intentionally adding 20 to the length) we keep coupon null
      let coupon = coupons[getRandomNumber(coupons.length + 20)] ?? null;
      let discountedOrderPrice = orderPrice; // by default discountedOrderPrice is orderPrice if there is no coupon
      if (coupon && coupon.minimumCartValue <= orderPrice) {
        // Check if there is coupon selected and the minimumCartValue is less than current order price
        discountedOrderPrice -= coupon.discountValue;
      } else {
        coupon = null;
      }
      // return the required metadata
      return {
        orderItems: orderItems.map((prod) => ({
          productId: prod.productId,
          quantity: prod.quantity,
        })),
        orderPrice,
        discountedOrderPrice,
        coupon,
      };
    });

  await EcomOrder.deleteMany({});
  await EcomOrder.insertMany(
    orders.map((order) => {
      const customer = customers[getRandomNumber(customers.length)];
      const orderInstance = orderPayload[getRandomNumber(orderPayload.length)]; // pick any random order instance to include
      return {
        ...order,
        customer, // set random user as a customer
        address:
          // Find address which is of order's customer
          // In rare cases if it does not exist. Select a random one
          addresses.find(
            (add) => add.owner?.toString() === customer?._id.toString()
          )?._id ?? addresses[getRandomNumber(addresses.length)],
        items: orderInstance.orderItems, // set order items
        coupon: orderInstance.coupon,
        orderPrice: orderInstance.orderPrice,
        discountedOrderPrice: orderInstance.discountedOrderPrice,
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
