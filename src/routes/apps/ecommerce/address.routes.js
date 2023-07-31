import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddresses,
  updateAddress,
} from "../../../controllers/apps/ecommerce/address.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createAddressValidator,
  updateAddressValidator,
} from "../../../validators/apps/ecommerce/address.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router
  .route("/")
  .post(createAddressValidator(), validate, createAddress)
  .get(getAllAddresses);

router
  .route("/:addressId")
  .get(mongoIdPathVariableValidator("addressId"), validate, getAddressById)
  .delete(mongoIdPathVariableValidator("addressId"), validate, deleteAddress)
  .patch(
    updateAddressValidator(),
    mongoIdPathVariableValidator("addressId"),
    validate,
    updateAddress
  );

export default router;
