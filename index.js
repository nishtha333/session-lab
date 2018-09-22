const express = require('express');
const session = require('express-session');
const app = express();

/* This session middleware will assign an object to the Express request object named session 
(i.e. req.session) for each incoming request. The req.session object will store any data that 
we have assigned to it for any previous requests made by the same client. That means any middleware 
downstream of the session middleware will be able to access req.session to get and/or set 
client-specific data. Express-session handles all of the cookie reading and writing for us. If a new 
has no cookie, it makes a session, a new cookie, and updates the response to include information 
to set the cookie on the client. If a subsequent request has a cookie, it uses the embedded ID in 
that cookie to look up the server-side session object associated with that client. It is important 
to understand that nothing we add to req.session is ever sent back to the client (side note, 
some metadata about the cookie is made visible in req.session.cookie
    */
app.use(session ({
    // this mandatory configuration ensures that session IDs are not predictable (can be anything)
    secret: 'SunnyB3aches', 
    // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
    resave: false,
    // this option says if I am new but not modified still save
    saveUninitialized: true
}));

// Session Logging Middleware - place right after the session setup middleware
app.use((req, res, next) => {
    console.log('SESSION: ', req.session)
    next()
});

// make sure to put this AFTER your session middleware, but BEFORE you send your response!
app.use((req, res, next) => {
    if (!req.session.counter) req.session.counter = 0
    console.log('counter', ++req.session.counter) // increment THEN log
    next() // needed to continue through express middleware
});

app.get('/', (req, res, next) => {
    res.send('Hello')
});
  
app.listen(8080, () => console.log('Listening at http://localhost:8080'))