const express = require('express'); /* importing the "express" library,
saving a function into the "express" constant so later it is possible to use
this function like this: "express()" */
const app = express(); // creating an express application
const server = require('http').Server(app); // creating a HTTP server
const io = require('socket.io')(server); /* importing the "socket.io" library,
creating a socket.io server by using a function that is returned as a result
of "require('socket.io')", saving the server into the "io" constant */
const {v4: uuidV4} = require('uuid'); /* to import only a certain element from
a package you can type a name of a package in a curly braces,
additionally, to add an alias add a colon after a name of this element and
type an alias, in this case the imported element is the "v4" function */

app.set('view engine','ejs'); /* "app.set" is used for setting things in an
express application, in this case we set the view engine property using 'ejs'
module, the "view engine" fragment is a property that is already defined by
the "Express" framework, the "ejs" fragment is a String that says a name of
a library that was installed before by a software developer */
app.use(express.static('public')); /* "app.use" mounts a function at the specified
path, this function is executed when the base of a path requested by a user
matches the specified path, the "path" argument is optional so there's only
a callback function defined, this callback function sets a location for static
files such as JS files */

app.get('/', (req, res) => { // sets the route for a GET method for a homepage
    
    res.redirect(`/${uuidV4()}`); // redirecting to a page with a generated uuid
});

app.get('/:room', (req, res) => { /* sets the route for a GET method for a room
address, in this case ":room" is a parameter in the URL that is created by
a software developer */

    res.render('room', {roomId: req.params.room}); /* renders a view for a client,
in this case "room" is a name of the "room.ejs" file that is about to be executed
as a result of going to the "/:room" address, it also passes an object as a second
argument, in this case this object has a "roomId" property whose value is set
to the parameter in the URL, it was possible by accessing the "express" library
property called "req.params" */
});

io.on('connection', socket => {  /* specifies behaviour of a program when socket
connection with a client is established, is executed on a socket.io server, returns
a server, "connection" is a property already defined by the socket.io library */

    socket.on('join-room', (roomId, userId) => { /* specifies behaviour of
a program for a given event, the "join-room" event is created by a software
developer */

        /* console.log(roomId,userId); /* "alert()" works on the "window" object
on the client side, here we are on the server side so we are using
"console.log" */
        socket.join(roomId); /* adds a client to a room which is specified by
a String */
        socket.to(roomId).emit('user-connected', userId); /* makes sure that
the event is emitted to all clients in the room except the sender */
        socket.on('disconnect', () => { /* "disconnect" is an event already
defined by the socket.io library */

            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
});

server.listen(3000); /* starts the HTTP server, "server.listen()" is placed in the
end of a file because first there have to be other things defined like GET methods
so that after running the server it knows what to do */

/*
command "npm install -g":

Install globally if the package provides command-line tools
Install locally if you're using the package as part of your application
Install globally and locally if both use-cases apply

Error "File C:\Program Files\nodejs\peerjs.ps1 cannot be loaded because       
running scripts is disabled on this system."":

use command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted"
*/