// create a http server with /register route 
// take username, password as input 
// store username, password, hash password before storing

// create /login route to authenticate user
// create JWT and return token if user exists

// let user post a text post, only if authenticated in /post route
// store all posts in mongodb

// let user access all previous posts using /all-posts route
// only if authenticated

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();
app.use(express.json());


const JWT_SECRET = "JWT_Secret_very_secret";


try {
    mongoose.connect("mongodb+srv://username:password?mongodb_url/1-mongo-app");
} catch (err) {
    console.log(err)
};

const UserSchema = mongoose.Schema({
    username: String,
    hashedPassword: String
})
const PostSchema = mongoose.Schema({
    username: String,
    title: String,
    body: String
})

const Users = mongoose.model("users", UserSchema);
const Posts = mongoose.model("user_posts", PostSchema);

let count = 0;
function countRequests(req, res, next) {
    count++;
    console.log("User at: " + req.originalUrl)
    console.log("requests: " + count)
    next();
}
app.use(countRequests);

function authenticateUser(req, res, next) {
    const username = req.headers.username;
    const token = req.headers.auth;
    // console.log(token);
    // console.log(username, token);
    if (token) {
        const decode = jwt.verify(token, JWT_SECRET);
        // console.log(decode);
        if (decode === username) {
            next()
        }
    }
    else {
        res.status(403).json({
            msg: "Authentication failed!"
        })
    }
}

async function checkIfUserExists(req, res, next) {
    const username = req.headers.username;
    let user = await Users.findOne({ username });
    if (user !== null && user.username === username) {
        res.status(409).json({
            msg: "User already exists!"
        })
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send("Welcome to the website! pls proceed to /register to register yourself, or /login if already registered.")
})

app.post("/register", checkIfUserExists, (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const hashedPassword = md5(password);

    //check  if user already exists
    console.log("Registering user: " + username)
    const user = new Users({
        username,
        hashedPassword,
    });

    let saveUser = async function () {
        await user.save();
    }
    saveUser();

    res.status(200).json({
        msg: "User registration successfull!"
    })

    console.log("Registration successfull!");
})

app.post("/login", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const hashedPassword = md5(password)
    // console.log(hashedPassword)

    console.log("Logging in user: " + username)

    async function getUserFromDB() {
        let user = await Users.findOne({ username }).exec();
        if (user !== undefined) {
            // console.log("here")
            // console.log(user);
            return user;
        }
        else {
            res.status(404).json({
                msg: "User not found!"
            })
        }
    }
    getUserFromDB().then(user => {
        if (user !== null && (user.username === username && user.hashedPassword === hashedPassword)) {
            const token = jwt.sign(username, JWT_SECRET);
            res.json({
                msg: "User login successfull!",
                accessToken: token
            })
            console.log("Logged in successfully!")
        }
        else {
            console.log("Login failed!")
            res.status(403).json({
                msg: "Invalid credentials!"
            })
        }
    })

})

app.post("/post", authenticateUser, (req, res) => {
    const username = req.headers.username;
    const title = req.body.title;
    const body = req.body.body;

    const post = new Posts({
        username,
        title,
        body
    })
    console.log(post);

    let savePost = async function () {
        await post.save()
    }
    savePost();

    console.log("Post: " + `\"${title}\"` + ", from user: " + username + ", submitted!")
    res.json({
        msg: "Post submitted!"
    })
})

app.get("/all-posts", authenticateUser, (req, res) => {
    let getAllPosts = async function () {
        const posts = await Posts.find();
        console.log(posts);
        res.json(posts);
    }
    console.log("Retrieving all posts...");
    getAllPosts();
})

app.listen(7777);

// console.log(hashPassword("diksha"))
