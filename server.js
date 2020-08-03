const express = require("express")
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const Handlebars = require('handlebars')
const app = express();
const { connect } = require("mongoose")
const { PORT, MONGODB_URL } = require('./config')

/*=================================================Database Connection=========================================================*/
connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err
    console.log("Database connected successfully....")
})


/* =========================================Template middleware engine starts here============================================== */
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

/* =========================================Template middleware engine ends here============================================== */

Handlebars.registerHelper('removeFirst6Char', (str) => {
    let TrimValue = [...str].splice(6).join('');
    return new Handlebars.SafeString(TrimValue);
});
/*=========================================body parser incoming request starts here====================================*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*========================================server static assets======================================*/
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"))
/*=======================================load ROUTES assets======================================*/
app.get("/", (req, res) => {
    res.render('home.handlebars')
})
app.use('/profile/', require('./Routes/profiles/profile'))
app.use('/auth/', require('./Routes/auth/auth'))
app.use('/sports/', require('./Routes/products/sports'))


let port = 4000;
app.listen(PORT, (err) => {
    if (err) throw err
    console.log("mynthra server started at " + PORT)
})

