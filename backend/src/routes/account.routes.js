const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller"); 


const router = express.Router();

/**
 * - POST /api/accounts/create
 * - Create a new account
 */
router.post("/create", authMiddleware.authMiddleware, accountController.createAccount)




module.exports = router