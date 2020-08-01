const express = require("express");
const router = express.Router();
const Profile = require("../../Model/Profile");
//@ router/http method GET
router.get('/', (req, res) => {
    res.send("I am profile router")
})
router.get('/create-profile', (req, res) => {
    res.render("./profiles/create-profile")
})
router.post('/create-profile', (req, res) => {
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
            res.redirect("/profile", 201, { profile });
        })
        .catch((err) => console.log(err));


})

module.exports = router;