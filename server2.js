const express = require('express');
const app = express();
const users = []; // array of objects
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');

initializePassport(passport, email => {

    users.find(user => user.email === email);
});

app.set('view-engine','ejs');
app.use(express.urlencoded({extended: false})); /* express.urlencoded() parses
incoming requests with urlencoded payloads, "extended" set to "true" enables
parsing encoded data with the qs library and "extended" set to "false" will
cause parsing the encoded data with the query-string library, qs allows creating
a nested object from query string and query-string does not, allows for
accessing form elements such as name inside a request variable inside a POST
method like this: "req.body.name" */

app.get('/', (req,res) => {

    res.render('index.ejs',{name:'Kyle'});
});

app.get('/login', (req,res) => {

    res.render('login.ejs');
});

app.get('/register', (req,res) => {

    res.render('register.ejs');
});

app.post('/register', async (req,res) => { /* an async function returns
a promise, it is a kind of function that waits for one operation to finish
while executing the rest of the code */

    try{

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
/* 10 is a number of rounds to create salt which a string added to password before
hashing, "await" can only be use inside a asynchronous function, "await" makes
the function pause the execution and wait for fullfilment or rejection of
the promise returned by bcrypt.hash() */
        users.push({ /* The push() method of Array instances adds the specified
elements to the end of an array and returns the new length of the array. */
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    }
    catch{

        res.redirect('/register');
    }
});

app.post('/login', (req,res) => {

    
});

app.listen(3000);

/*
passport is a middleware for authentication, it uses strategies such as
passport-local, express-session is a module that allows to create sessions,
express flash is for displaying messages without redirecting the request
i.e. during login failure
*/