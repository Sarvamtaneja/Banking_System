const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();


/**
 * - POST /api/transaction/
 * - Create a transaction
 */
router.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)

/**
 * -POST /api/transaction/system/initial-funds
 * -create Initial funds transaction from user
 */
router.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)


module.exports = router;