import { Router } from "express";
import { cartController } from "../../../controllers/apps/ecommerce/index.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { addItemOrUpdateItemQuantityValidator } from "../../../validators/apps/ecommerce/cart.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(cartController.getUserCart);

router.route("/clear").delete(cartController.clearCart);

router
  .route("/item/:productId")
  .post(
    mongoIdPathVariableValidator("productId"),
    addItemOrUpdateItemQuantityValidator(),
    validate,
    cartController.addItemOrUpdateItemQuantity
  )
  .delete(
    mongoIdPathVariableValidator("productId"),
    validate,
    cartController.removeItemFromCart
  );

export default router;
