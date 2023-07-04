import { Cart } from "../../../models/apps/ecommerce/cart.models.js";
import { Coupon } from "../../../models/apps/ecommerce/coupon.models.js";
import { Product } from "../../../models/apps/ecommerce/product.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

/**
 *
 * @param {string} userId
 * @description A utility function, which querys the {@link Cart} model and returns the cart in `Promise<{_id: string, items: {_id: string, product: Product, quantity: number}[], cartTotal: number}>` format
 *  @returns {Promise<{_id: string, items: {_id: string, product: Product, quantity: number}[], cartTotal: number, discountedTotal: number, coupon: Coupon}>}
 */
export const getCart = async (userId) => {
  const cartAggregation = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        // _id: 0,
        product: { $first: "$product" },
        quantity: "$items.quantity",
        coupon: 1, // also project coupon field
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT",
        },
        coupon: { $first: "$coupon" }, // get first value of coupon after grouping
        cartTotal: {
          $sum: {
            $multiply: ["$product.price", "$quantity"], // calculate the cart total based on product price * total quantity
          },
        },
      },
    },
    {
      $lookup: {
        // lookup for the coupon
        from: "coupons",
        localField: "coupon",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $addFields: {
        // As lookup returns an array we access the first item in the lookup array
        coupon: { $first: "$coupon" },
      },
    },
    {
      $addFields: {
        discountedTotal: {
          // Final total is the total we get once user applies any coupon
          // final total is total cart value - coupon's discount value
          $ifNull: [
            {
              $subtract: ["$cartTotal", "$coupon.discountValue"],
            },
            "$cartTotal", // if there is no coupon applied we will set cart total as out final total
            ,
          ],
        },
      },
    },
  ]);

  return (
    cartAggregation[0] ?? {
      _id: null,
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
    }
  );
};

const getUserCart = asyncHandler(async (req, res) => {
  let cart = await getCart(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addItemOrUpdateItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  // fetch user cart
  const cart = await Cart.findOne({
    owner: req.user._id,
  });

  // See if product that user is adding exist in the db
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  // If product is there check if the quantity that user is adding is less than or equal to the product's stock
  if (quantity > product.stock) {
    // if quantity is greater throw an error
    throw new ApiError(
      400,
      product.stock > 0
        ? "Only " +
          product.stock +
          " products are remaining. But you are adding " +
          quantity
        : "Product is out of stock"
    );
  }

  // See if the product that user is adding already exists in the cart
  const addedProduct = cart.items?.find(
    (item) => item.productId.toString() === productId
  );

  if (addedProduct) {
    // If product already exist assign a new quantity to it
    // ! We are not adding or subtracting quantity to keep it dynamic. Frontend will send us updated quantity here
    addedProduct.quantity = quantity;
    // if user updates the cart remove the coupon associated with the cart to avoid misuse
    // Do this only if quantity changes because if user adds a new project the cart total will increase anyways
    if (cart.coupon) {
      cart.coupon = null;
    }
  } else {
    // if its a new product being added in the cart push it to the cart items
    cart.items.push({
      productId,
      quantity,
    });
  }

  // Finally save the cart
  await cart.save({ validateBeforeSave: true });

  const newCart = await getCart(req.user._id); // structure the user cart

  return res
    .status(200)
    .json(new ApiResponse(200, newCart, "Item added successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  // check for product existence
  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  const updatedCart = await Cart.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      // Pull the product inside the cart items
      // ! We are not handling decrement logic here that's we are doing in addItemOrUpdateItemQuantity method
      // ! this controller is responsible to remove the cart item entirely
      $pull: {
        items: {
          productId: productId,
        },
      },
    },
    { new: true }
  );

  let cart = await getCart(req.user._id);

  // check if the cart's new total is greater than the minimum cart total requirement of the coupon
  if (cart.coupon && cart.cartTotal < cart.coupon.minimumCartValue) {
    // if it is less than minimum cart value remove the coupon code which is applied
    updatedCart.coupon = null;
    await updatedCart.save({ validateBeforeSave: false });
    // fetch the latest updated cart
    cart = await getCart(req.user._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item removed successfully"));
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        items: [],
        coupon: null,
      },
    },
    { new: true }
  );
  const cart = await getCart(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart has been cleared"));
});

export {
  getUserCart,
  addItemOrUpdateItemQuantity,
  removeItemFromCart,
  clearCart,
};
