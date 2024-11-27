const express = require("express");
const db = require("./config/db");
const multer = require("multer");
const adminModel = require("./model/adminModel");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Configure multer storage 
const fileUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Middleware for handling single image file upload
const uploadImage = multer({ storage: fileUpload }).single("Image");

// Route to render the form with existing data
app.get("/", (req, res) => {
    adminModel.find({ deleted: false })  
        .then((data) => {
            res.render("form", { record: data });
        }).catch((err) => {
            console.log(err);
        });
});


// Route to data insertion with image upload
app.post("/insertData", uploadImage, (req, res) => {
    let Image = "";
    if (req.file) {
        Image = req.file.path;
    }
    const { username, password,email,phone } = req.body;
    adminModel.create({
        username: username,
        password: password,
        phone:phone,
        Image: Image,
        email:email
        
    }).then((data) => {
        console.log("Data successfully created", data);
        res.redirect("/"); 
    }).catch((err) => {
        console.log(err);
    });
});

// Route to render the edit form with existing data
app.get("/editData", (req, res) => {
    const userid = req.query.userid;
    adminModel.findById(userid)
        .then((data) => {
            if (data && !data.deleted) { 
                res.render("edit", { record: data });
            } else {
                console.log("Record not found or is soft deleted");
                res.redirect("/"); 
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/"); 
        });
});


// Route to data update
app.post("/editData", (req, res) => {
    const { id, username, password,email,phone } = req.body; 
    adminModel.findByIdAndUpdate(id, {
        username: username,
        password: password,
        email:email,
        phone:phone
    }).then((data) => {
        console.log("Data successfully updated", data); 
        res.redirect("/"); 
    }).catch((err) => {
        console.log(err); 
    });
});

// Route to data deletion
// Route to soft delete data (mark as deleted)
app.get("/deleteData", (req, res) => {
    const userid = req.query.userid;
    
    adminModel.findById(userid)
        .then((record) => {
            if (record) {
                record.deleted = true;
                record.deletedAt = new Date();
                
                if (record.Image && fs.existsSync(record.Image)) {
                    fs.unlinkSync(record.Image);
                }
                return record.save(); 
            } else {
                throw new Error("Record not found");
            }
        })
        .then(() => {
            console.log("Data successfully soft deleted");
            res.redirect("/"); 
                })
        .catch((err) => {
            console.log(err);
            res.redirect("/");
        });
});


// Route to restore (undelete) soft-deleted record
app.get("/restoreData", (req, res) => {
    const userid = req.query.userid;
    
    adminModel.findById(userid)
        .then((record) => {
            if (record && record.deleted) {
                record.deleted = false;
                record.deletedAt = null;  
                return record.save();
            } else {
                throw new Error("Record not found or is not deleted");
            }
        })
        .then(() => {
            console.log("Data successfully restored");
            res.redirect("/"); 
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/"); 
        });
});

//  server port
app.listen(6988, () => {
    console.log("Server is running ");
});
