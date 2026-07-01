const mongoose = require("mongoose");
const { findOneAndUpdate } = require("./user.model");

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true,"Ledger must be associated with an account"],
        index: true,
        immutable: true        
    },
    amount:{
        type: Number,
        required: [true,"Amount is required for ledger entry"],
        immutable: true
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions",
        required: [true,"Ledger must be associated with a transaction"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum:{
            values: ["CREDIT", "DEBIT"],
            message: "Type can either be CREDIT or DEBIT"
        },
        required:[true, "Ledger type is required"],
        immutable: true
    }
});

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;