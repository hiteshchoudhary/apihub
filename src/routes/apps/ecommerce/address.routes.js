import { Router } from "express";
import { addressController } from "../../../controllers/apps/ecommerce/index.js";
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
  .post(createAddressValidator(), validate, addressController.createAddress)
  .get(addressController.getAllAddresses);

router
  .route("/:addressId")
  .get(
    mongoIdPathVariableValidator("addressId"),
    validate,
    addressController.getAddressById
  )
  .delete(
    mongoIdPathVariableValidator("addressId"),
    validate,
    addressController.deleteAddress
  )
  .patch(
    updateAddressValidator(),
    mongoIdPathVariableValidator("addressId"),
    validate,
    addressController.updateAddress
  );

export default router;
