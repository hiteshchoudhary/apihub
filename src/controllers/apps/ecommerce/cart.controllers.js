import { Cart } from "../../../models/apps/ecommerce/cart.models.js";
import { Product } from "../../../models/apps/ecommerce/product.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

// TODO: add coupon service for ecom and incorporate it with the cart model to manage total order cost

/**
 *
 * @param {string} userId
 * @description A utility function, which querys the {@link Cart} model and returns the cart in `Promise<{_id: string, items: {_id: string, product: Product, quantity: number}[], cartTotal: number}>` format
 *  @returns {Promise<{_id: string, items: {_id: string, product: Product, quantity: number}[], cartTotal: number}>}
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
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT",
        },
        cartTotal: {
          $sum: {
            $multiply: ["$product.price", "$quantity"],
          },
        },
      },
    },
  ]);

  return cartAggregation[0] ?? { _id: null, items: [], cartTotal: 0 };
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

  await Cart.findOneAndUpdate(
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

  const cart = await getCart(req.user._id);
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
