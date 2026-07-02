const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller"); 


const router = express.Router();

/**
 * - POST /api/accounts/create
 * - Create a new account
 */
router.post("/create", authMiddleware.authMiddleware, accountController.createAccount)


/**
 * -GET /api/accounts/get-balance
 * -get all accounts of the logged-in user
 * -protected route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getAccountController)


/**
 * - GET /api/account/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)


module.exports = router