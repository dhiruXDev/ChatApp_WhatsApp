const { Router } = require("express");
const { checkUser, onBoardUser ,getAllUsers, generateToken } = require("../controllers/AuthController");
const { editProfileDetails, editProfileImage } = require("../controllers/EditProfile");

const router = Router();

router.post("/check-user",checkUser);
router.post("/onboard-user",onBoardUser);
router.get("/get-contacts",getAllUsers)
router.get("/generate-token/:userId", generateToken);

// Edit Profile Details
router.post("/edit-profile-details/:userId",editProfileDetails);
router.post("/edit-profile-image/:userId",editProfileImage);

module.exports = router;

/**
 *  Use ESM syntax --> import { Router } from "express"; 
 *  Use CommonJS syntax   --> const { Router } = require("express");
 * In this project im using the commonjs Syntax
 */