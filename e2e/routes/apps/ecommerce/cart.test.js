import { test, expect } from "@playwright/test";
import { getApiContext } from "../../../common.js";
import { clearDB } from "../../../db.js";

let apiContext;
let headers = {};

let expensiveProduct = null; // price: 1000
let cheapProduct = null; // price: 100

const COUPON = {
  name: "Flat 500 off",
  couponCode: "FLAT500",
  discountValue: 500,
  minimumCartValue: 800,
};

// 1x1 transparent png used as the product's main image
const PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

const createProduct = async (name, price, categoryId) => {
  const res = await apiContext.post("/api/v1/ecommerce/products", {
    headers,
    multipart: {
      name,
      description: `${name} description`,
      price: String(price),
      stock: "10",
      category: categoryId,
      mainImage: {
        name: "product.png",
        mimeType: "image/png",
        buffer: PNG_BUFFER,
      },
    },
  });
  expect(res.status()).toEqual(201);
  return (await res.json()).data;
};

const addToCart = async (productId, quantity = 1) => {
  const res = await apiContext.post(
    `/api/v1/ecommerce/cart/item/${productId}`,
    {
      headers,
      data: { quantity },
    }
  );
  expect(res.status()).toEqual(200);
  return (await res.json()).data;
};

const removeFromCart = async (productId) => {
  const res = await apiContext.delete(
    `/api/v1/ecommerce/cart/item/${productId}`,
    { headers }
  );
  expect(res.status()).toEqual(200);
  return (await res.json()).data;
};

const applyCoupon = async () => {
  const res = await apiContext.post("/api/v1/ecommerce/coupons/c/apply", {
    headers,
    data: { couponCode: COUPON.couponCode },
  });
  expect(res.status()).toEqual(200);
  return (await res.json()).data;
};

const clearCart = async () => {
  const res = await apiContext.delete("/api/v1/ecommerce/cart/clear", {
    headers,
  });
  expect(res.status()).toEqual(200);
};

test.describe("Ecommerce Cart", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();

    const user = {
      email: "cart-admin@freeapi.app",
      username: "cartadmin",
      password: "cart-admin-password",
      role: "ADMIN",
    };
    const registerRes = await apiContext.post("/api/v1/users/register", {
      data: user,
    });
    expect(registerRes.status()).toEqual(201);

    const loginRes = await apiContext.post("/api/v1/users/login", {
      data: { username: user.username, password: user.password },
    });
    expect(loginRes.status()).toEqual(200);
    const { accessToken } = (await loginRes.json()).data;
    headers = { Authorization: `Bearer ${accessToken}` };

    const categoryRes = await apiContext.post("/api/v1/ecommerce/categories", {
      headers,
      data: { name: "cart-test-category" },
    });
    expect(categoryRes.status()).toEqual(201);
    const category = (await categoryRes.json()).data;

    expensiveProduct = await createProduct(
      "expensive-product",
      1000,
      category._id
    );
    cheapProduct = await createProduct("cheap-product", 100, category._id);

    const couponRes = await apiContext.post("/api/v1/ecommerce/coupons", {
      headers,
      data: {
        ...COUPON,
        startDate: new Date(Date.now() - 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    expect(couponRes.status()).toEqual(201);
  });

  test.afterAll(async () => {
    // delete the products to remove the uploaded images from public/images
    for (const product of [expensiveProduct, cheapProduct]) {
      if (product?._id) {
        await apiContext.delete(`/api/v1/ecommerce/products/${product._id}`, {
          headers,
        });
      }
    }
    await apiContext.dispose();
  });

  test.describe("DELETE:/api/v1/ecommerce/cart/item/:productId - Remove item from cart with a coupon applied", () => {
    test.afterEach(async () => {
      await clearCart();
    });

    test("should apply the coupon when cart total meets the minimum cart value", async () => {
      await addToCart(expensiveProduct._id);
      const cart = await applyCoupon();
      expect(cart.cartTotal).toEqual(1000);
      expect(cart.discountedTotal).toEqual(500);
      expect(cart.coupon.couponCode).toEqual(COUPON.couponCode);
    });

    test("should remove the coupon when the last item is removed from the cart", async () => {
      await addToCart(expensiveProduct._id);
      await applyCoupon();
      const emptyCart = await removeFromCart(expensiveProduct._id);
      expect(emptyCart.items.length).toEqual(0);
      expect(emptyCart.cartTotal).toEqual(0);

      // adding an item worth less than the minimum cart value must not bring the coupon back
      const cart = await addToCart(cheapProduct._id);
      expect(cart.cartTotal).toEqual(100);
      expect(cart.coupon).toBeFalsy();
      expect(cart.discountedTotal).toEqual(100);
    });

    test("should remove the coupon when cart total drops below the minimum cart value", async () => {
      await addToCart(expensiveProduct._id);
      await addToCart(cheapProduct._id);
      await applyCoupon();
      const cart = await removeFromCart(expensiveProduct._id);
      expect(cart.cartTotal).toEqual(100);
      expect(cart.coupon).toBeFalsy();
      expect(cart.discountedTotal).toEqual(100);
    });

    test("should keep the coupon when cart total still meets the minimum cart value", async () => {
      await addToCart(expensiveProduct._id);
      await addToCart(cheapProduct._id);
      await applyCoupon();
      const cart = await removeFromCart(cheapProduct._id);
      expect(cart.cartTotal).toEqual(1000);
      expect(cart.coupon.couponCode).toEqual(COUPON.couponCode);
      expect(cart.discountedTotal).toEqual(500);
    });
  });
});
