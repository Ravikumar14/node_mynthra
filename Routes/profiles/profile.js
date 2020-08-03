const express = require("express");
const router = express.Router();
const multer = require("multer");

const Profile = require("../../Model/Profile");
const { storage } = require('../../config/multer')
const upload = multer({ storage })

//@ router/http method GET
router.get('/', (req, res) => {
    res.send("I am profile router")
})
router.get('/create-profile', (req, res) => {
    res.render("./profiles/create-profile")
})
router.get('/all-profiles', (req, res) => {
    //find profile collections from database
    Profile.find({}).sort({ data: 'desc' }).lean().then((profile) => {
        res.render("./profiles/all-profiles", { profile });
    }).catch((err) => console.log(err));
})
router.post('/create-profile', upload.single('photo'), (req, res) => {
    let {
        firstname,
        lastname,
        phone,
        address,
        alt_address,
        gender,
        country,
        pincode,
        landmark,
    } = req.body;
    let newProfile = {
        photo: req.file,
        firstname,
        lastname,
        phone,
        address,
        alt_address,
        gender,
        country,
        pincode,
        landmark,
    };

    new Profile(newProfile)
        .save()
        .then((profile) => {
            res.redirect("/profile/all-profiles", 201, { profile });
        })
        .catch((err) => console.log(err));


})

module.exports = router;