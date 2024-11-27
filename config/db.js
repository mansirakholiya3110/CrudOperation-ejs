const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://mansirakholiya570:mansi9099@cluster0.2qahvag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect('mongodb://127.0.0.1:27017/product');

const db = mongoose.connection

db.on("connected", () => {
    console.log("data base is connect")
})

