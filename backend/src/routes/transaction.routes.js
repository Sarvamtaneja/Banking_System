const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


/**
 * - POST /api/transaction/
 * - Create a transaction
 */
router.post("/", authMiddleware.authMiddleware)


module.exports = router;