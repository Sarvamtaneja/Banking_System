const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");


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
        _id: fromAccount
    })
    
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Either the Sender or the reciever account is INVALID"
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

        /**
         * -Checking account status
         */

        if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
            return res.status(400).json({
                message: "Both sender and reciever account need to be ACTIVE"
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
        
        const transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            statu: "PENDING"
        }, { session });

        /**
         * -Create debit ledger entry
         */

        const debitLedgerEntry = await ledgerModel.create({
            ccount: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        },{ session });

        /**
         * -Create credit ledger entry
         */

        const creditLedgerEntry = await ledgerModel.create({
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }, { session });

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

        await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

        return res.status(201).json({
            message: "Transaction completed Successfully",
            transaction: transaction
        })


    }
}

module.exports = {
    createTransaction
}