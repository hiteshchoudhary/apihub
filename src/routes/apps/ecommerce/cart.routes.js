import { Router } from "express";
import {
  addItemOrUpdateItemQuantity,
  clearCart,
  getUserCart,
  removeItemFromCart,
} from "../../../controllers/apps/ecommerce/cart.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { addItemOrUpdateItemQuantityValidator } from "../../../validators/apps/ecommerce/cart.validators.js";
import { productPathVariableValidator } from "../../../validators/apps/ecommerce/product.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

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
