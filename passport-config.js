const LocalStrategy = require('passport-local').Strategy; /* creating LocalStrategy
for authentication */
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail) {

    const authenticateUser = async (email,password,done) => { /* this function is
a verify callback function, "done" is a function you call when you're done
authenticating a user, email and password parameters here are those provided
by the login form */

        const user = getUserByEmail(email);
        if(user == null){ /* if there's no such user */

            /* "return" is for stopping execution of a function, done() has
three parameters: error, user, additional info, remember that "error"
has to be an actual error from the application */
            return done(null,false,{message: "No user with that email."});
        }
        try{

            if(await bcrypt.compare(password, user.password)){ /* checking if
user's input matches the actual password */

                return done(null,user);
            }
            else{

                return done(null,false,{message: "Incorrect password."});
            }
        }
        catch(error){

            return done(error);
        }
    }
    /* configuration of a strategy below */
    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser));
    passport.serializeUser((user,done) => { /* Passport will maintain persistent
login sessions. In order for persistent sessions to work, the authenticated
user must be serialized to the session, and deserialized when subsequent
requests are made.*/

        
    });
    passport.deserializeUser((id,done) => {


    })
}

module.exports = initialize;

/*
Materials for passport-local and passport:

https://github.com/jaredhanson/passport-local
https://github.com/jaredhanson/passport
https://www.wlaurance.com/2018/09/async-await-passportjs-local-strategy
*/