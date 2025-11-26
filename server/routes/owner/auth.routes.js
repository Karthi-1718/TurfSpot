import { Router } from "express";
import {
  registerOwner,
  loginOwner,
  ownerRequest,
} from "../../controllers/owner/auth.controller.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateOwnerRequestInput,
} from "../../middleware/validators/owner/authValidator.js";

const authRouter = Router();

// FIX: Every validator must send "message" instead of whole object
authRouter.post("/register", validateRegisterInput, registerOwner);

authRouter.post("/login", validateLoginInput, loginOwner);

authRouter.post("/ownerRequest", validateOwnerRequestInput, ownerRequest);

export default authRouter;
