const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
        Image: {
            type: String
        },
        deleted: {
            type: Boolean,
            default: false, 
          },
          deletedAt: {
            type: Date,
            default: null, 
          },
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
