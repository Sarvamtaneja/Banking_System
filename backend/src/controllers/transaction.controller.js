const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");


async function createTransaction(req,res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    /**
     * -Validating Request
     */
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "Missing required fields"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
        user: req.user._id
    })
    
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount){
        return res.status(403).json({
            message: "You are not authorized to perform transaction from this account"
        })
    }
    if(!toUserAccount){
        return res.status(400).josn({
            message:"the reciever account is invalid"
        })
    }

    /**
     * -Validating idempotencyKey
     */

    const doesTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(doesTransactionAlreadyExist){
        if(doesTransactionAlreadyExist.status == "COMPLETED"){
            return res.status(200).json({
                message:"Transaction has already been completed",
                transaction: doesTransactionAlreadyExist
            })
        }

        if(doesTransactionAlreadyExist.status == "FAILED"){
            return res.status(500).json({
                message:"Transaction has failed, please try again"
            })
        }

        if(doesTransactionAlreadyExist.status == "PENDING"){
            return res.status(200).json({
                message:"Transaction is under process, please wait"
            })
        }

        if(doesTransactionAlreadyExist.status == "REVERSED"){
            return res.status(500).json({
                message:"Transaction has been reversed, please retry"
            })
        }
    }

    /**
     * -Checking account status
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Both sender and reciever accounts need to be ACTIVE"
        })
    }

    /**
     * -Derive Sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient Balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    /**
     * -Create transaction 
     */

    const session = await mongoose.startSession();
    session.startTransaction();  
        
    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    });

    /**
     * -Create debit ledger entry
     */

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }],{ session });

    /**
     * -Create credit ledger entry
     */

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    /**
     * -Change status to completed
     */

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    /**
     * Commit changes in MongoDB
     */

    await session.commitTransaction()
    session.endSession();

    /**
     * -Send an email
     */

    //await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

    return res.status(201).json({
        message: "Transaction completed Successfully",
        transaction: transaction
    })

   
}

async function createInitialFundsTransaction(req, res){
    const { toAccount, amount, idempotencyKey } = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: " To account, amount and idempotancy key are required."
        })
    };

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid Account"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message: "System user account not found."
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }],{ session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    } ],{ session })

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession()

    return res.status(201).json({
        message: "Initial transaction completed successfully",
        transaction: transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}