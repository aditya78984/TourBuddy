if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const  express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { syncBuiltinESMExports } = require("module");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



main()
.then(res => console.log("connection successful"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true ,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, // one week
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

// app.get("/", (req, res) => {
//     res.send("This is root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
} );

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })


app.use("/listings", listingRouter); 

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);

//Handling Page not found
app.all("*", (req, res, next) => {
    console.log("Handling error for unmatched route:", req.url);
    next(new ExpressError(404, "Page Not Found!!!"));
});


//Custom error handler
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log("server is listening at port 3000");
})