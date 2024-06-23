const  express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = { secret: "mysupersecretstring", resave: false, saveUninitialized: true }

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
} )

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    console.log(req.session);
    req.session.name = name;
    // res.send(req.session.name);
    if(name === "anonymous"){
        req.flash("error", "user not registered!");
    }else{
        req.flash("success", "user registered successfully!");
    }
    // console.log(req.session);
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    // console.log(req.flash("success"));
    // res.locals.messages = req.flash("success");
    res.render("page.ejs", {name : req.session.name});
})

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })
 
// app.get("/test", (req, res) => {
//     res.send("test successfull !");
// })

// app.use(cookieParser("secretcode"));

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "Bharat");
//     res.send("sent you some cookies");
// })

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "Bharat", {signed : true});
//     res.send("sent signed cookies");
// })

// app.get("/verify", (req, res) => {
//     console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send("verify");
// })

// app.get("/greet", (req, res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name} `);
// })

// app.use("/users", users);

// app.use("/posts", posts);

// app.get("/", (req, res) => {
//     res.send("Hi, I'm root");
//     console.dir(req.cookies);
// });





app.listen(8080, () => {
    console.log("server is listening at port 8080");
})