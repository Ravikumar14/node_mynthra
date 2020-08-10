const express = require("express");
const router = express.Router();
const multer = require("multer");

const Profile = require("../../Model/Profile");
const { storage } = require('../../config/multer')
const upload = multer({ storage })

//@ router/http method GET
router.get("/create-profile", (req, res) => {
    res.render("./profiles/create-profile")
})
router.get('/all-profiles', (req, res) => {
    //find profile collections from database
    Profile.find({}).sort({ data: 'desc' }).lean().then((profile) => {
        res.render("./profiles/all-profiles", { profile });
    }).catch((err) => console.log(err));
});

/*===========================get profile details====================================*/
router.get("/user-profile/:id", (req, res) => {
    Profile.findOne({ _id: req.params.id }).lean().then(profile_detail => {
        res.render("./profiles/user-profile", { profile_detail })
    }).catch(err => console.log(err))
})
/*===========================edit profile==========================*/
router.get("/edit-profile/:id", (req, res) => {
    Profile.findOne({ _id: req.params.id }).lean().then(edit_profile => {
        res.render("./profiles/edit-profile", { edit_profile })
    }).catch(err => console.log(err))
})

router.post('/create-profile', upload.single('photo'), (req, res) => {
    let {
        firstname,
        lastname,
        designation,
        phone,
        email,
        skills,
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
        designation,
        phone,
        email,
        skills,
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
            req.flash("success_msg", "successfully profile created...")
            res.redirect("/profile/all-profiles", 201, { profile });
        })
        .catch((err) => console.log(err));


})

//@http method PUT
//@description Updating Profile Data
//@access Private

router.put("/edit-profile/:id", upload.single("photo"), (req, res) => {
    let {
        firstname,
        lastname,
        designation,
        phone,
        email,
        skills,
        address,
        alt_address,
        gender,
        country,
        pincode,
        landmark,
    } = req.body;
    //If you want to update a profile or informaion first should be find a data in the database by using findOne method
    Profile.findOne({ _id: req.params.id }).then((updateProfile) => {
        updateProfile.photo = req.file;
        updateProfile.firstname = firstname;
        updateProfile.lastname = lastname;
        updateProfile.designation = designation;
        updateProfile.phone = phone;
        updateProfile.email = email;
        updateProfile.address = address;
        updateProfile.alt_address = alt_address;
        updateProfile.skills = skills;
        updateProfile.gender = gender;
        updateProfile.country = country;
        updateProfile.landmark = landmark;
        updateProfile.pincode = pincode;


        updateProfile.save().then((update) => {
            req.flash("success_msg", "successfully profile updated...")
            res.redirect("/profile/all-profiles", 201, { update });
        }).catch(err => console.log(err));

    }).catch(err => console.log(err))
})
/*===========================================Http delete method for deleting data==================================*/
router.delete("/profile-delete/:id", (req, res) => {
    Profile.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "successfully profile deleted...")
            res.redirect("/profile/all-profiles", 201, {});
        })
        .catch((err) => console.log(err));
});

module.exports = router;