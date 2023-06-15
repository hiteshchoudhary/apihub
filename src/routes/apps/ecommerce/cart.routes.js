import { Router } from "express";
import {
  addItemOrUpdateItemQuantity,
  clearCart,
  getUserCart,
  removeItemFromCart,
} from "../../../controllers/apps/ecommerce/cart.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { addItemOrUpdateItemQuantityValidator } from "../../../validators/apps/ecommerce/cart.validators.js";
import { validate } from "../../../validators/validate.js";
import { Cart } from "../../../models/apps/ecommerce/cart.models.js";
import { productPathVariableValidator } from "../../../validators/apps/ecommerce/product.validators.js";

const router = Router();

router.use(verifyJWT);

// Check if user cart exists or not
// If not create one
router.use(async (req, _, next) => {
  const cart = await Cart.findOne({
    owner: req.user._id,
  });
  if (!cart) {
    await Cart.create({
      owner: req.user._id,
      items: [],
    });
  }
  next();
});

router.route("/").get(getUserCart);

router.route("/clear").delete(clearCart);

router
  .route("/item/:productId")
  .post(
    productPathVariableValidator(),
    addItemOrUpdateItemQuantityValidator(),
    validate,
    addItemOrUpdateItemQuantity
  )
  .delete(productPathVariableValidator(), validate, removeItemFromCart);

export default router;
