const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");


const router = express.Router();

/**
 * - POST /api/accounts/create
 * - Create a new account
 */
router.post("/create", authMiddleware.authMiddleware)




module.exports = router