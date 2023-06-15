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
  addressPathVariableValidator,
  createAddressValidator,
  updateAddressValidator,
} from "../../../validators/apps/ecommerce/address.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router
  .route("/")
  .post(createAddressValidator(), validate, createAddress)
  .get(getAllAddresses);

router
  .route("/:addressId")
  .get(addressPathVariableValidator(), validate, getAddressById)
  .delete(addressPathVariableValidator(), validate, deleteAddress)
  .patch(
    updateAddressValidator(),
    addressPathVariableValidator(),
    validate,
    updateAddress
  );

export default router;
