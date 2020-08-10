const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require("../../Model/Auth");

/*========================================Login get route======================================*/
router.get("/login", (req, res) => {
    res.render("./auth/login")
})

/*========================================Register get route======================================*/
router.get("/register", (req, res) => {
    res.render("./auth/register")
})
/*========================================Login post route======================================*/

/*========================================Register post route======================================*/
router.post("/register", (req, res) => {
    const errors = [];
    let { username, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        errors.push({ text: "password should be match" });

    }
    if (password.length < 6) {
        errors.push({ text: "password should be minimum 6 charecters" })
    }
    if (errors.length > 0) {
        res.render("./auth/register", {
            errors,
            username,
            email,
            password,
            confirm_password,
        });


    } else {
        User.findOne({ email }).then((user) => {
            if (user) {
                req.flash(
                    "errors_msg",
                    "Email already Registered please use another email address.."
                );
                res.redirect("/auth/register", 401, {});
            } else {
                let newUser = new User({
                    username,
                    email,
                    password,
                });
                bcrypt.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash("ravi", salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(userdata => {
                            req.flash("success_msg", "Successfully User Registered..");
                            res.redirect("/auth/login", 201, { userdata });
                        }).catch(err => console.log(err))
                    })
                })
            }
        }).catch(err => console.log(err))
    }
})


module.exports = router;