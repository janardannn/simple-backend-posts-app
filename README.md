# BASIC BACKEND APP USING MONGODB, NODEJS, EXPRESSJS

// create a http server with /register route 
// take username, password as input 
// store username, password, hash password before storing

// create /login route to authenticate user
// create JWT and return token if user exists

// let user post a text post, only if authenticated in /post route
// store all posts in mongodb

// let user access all previous posts using /all-posts route
// only if authenticated

app runs at localhost:7777/

approutes:

/ -> GET

/register -> POST expects username, password in request header

/login -> POST expects username, password in request header
returns a JWT token for futher interaction and authentication

/post -> POST expects username, token in request header and post title, post body in request body

/all-posts -> GET expects username, token in request header

practice for the ongoing cohort, 100xDevs Cohort2.0, week 3
