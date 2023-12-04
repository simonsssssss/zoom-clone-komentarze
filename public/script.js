const socket = io('/'); /* creates a socket for a client, on a server side we had
to create a server called "io" and on a client side we have to create a socket,
both front and server are served on different domains so the URL of the server
is needed to create a socket properly, "io" object comes from the "socket.io.js"
file that is downloaded in the "room.ejs" file */

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video'); /* creates a "<video>" element in
an ".ejs" file */
myVideo.muted = true; /* the "<video>" element has a defined property called
"muted" */
const peers = {};

navigator.mediaDevices.getUserMedia({ /* getUserMedia() gets an object as
a parameter and it returns a promise */

    video: true,
    audio: true
}).then(stream => { // "stream" is both video and audio here

    addVideoStream(myVideo,stream); /* adding my own stream to the page */
    myPeer.on('call', call => { /* when an other peer is calling me */

        call.answer(stream); /* answering other peer's call and sending him
my stream */
        const video = document.createElement('video');
        call.on('stream', otherPeerStream => { /* this parameter is other peer's
stream */

            addVideoStream(video,otherPeerStream);
        });
    });
    socket.on('user-connected', userId => {

        connectoToNewUser(userId,stream); /* connecting to other peers */
    });
});

const myPeer = new Peer(undefined,{ // peer ID set to "undefined"

    host: '/',
    port: '3001'
});

socket.on('user-disconnected', userId => {

    alert("disconnected: "+userId);
    if(peers[userId]){ /* if such a peer exists */

        peers[userId].close(); /* closing a peerjs call */
    }
});

myPeer.on('open', function(id){ /* the "open" event is emitted when a connection
to the PeerServer is established. */

    socket.emit('join-room',ROOM_ID,id); /* initiates an event on the socket,
    any random parameters in any quantity can be included too so in this case we
    typed "ROOM_ID" and a number "10" which will be treated by us as a user ID */
});

function addVideoStream(video, stream) {

    video.srcObject = stream;  /* setting source material for our video,
srcObject is a property of the HTMLMediaElement such as "video",  */
    video.addEventListener('loadedmetadata', () => { /* sets up a function that
will be called when the specified event happens on the "video", "loadedmetadata"
is an event for a situation when the metadata has been loaded for "video" */

        video.play(); // attempts to begin playback of the media
    });
    videoGrid.append(video); /* "append" in nodejs is used for DOM elements, not
arrays */
}

function connectoToNewUser(userId,stream){

    const call = myPeer.call(userId,stream); /* calling a peer with a specific
ID and sending him my video and audio, "call()" provide a MediaConnection object
that itself emits a "stream" event whose callback includes the video/audio stream
of the other peer. */
    const video = document.createElement('video'); /* creates a "<video>" element
in an ".ejs" file */
    call.on('stream', userVideoStream => { /* "userVideoStream" is a stream from
another peer */

        addVideoStream(video,userVideoStream); /* adds another peer's stream
to my page */
    });
    call.on('close', () => { /* when a peer leaves a call */

        video.remove(); /* removes a DOM element from a page which is "video"
in this case */
    });
    peers[userId] = call; /* adding a new property "userId" and a value of this
property which is "call", in JavaScript it is possible to add properties to an
object in a way that looks like we're using an array */
}

/*
defining a peer for a client to connect with a peerjs server:

const peer = new Peer("someid", {
    host: "localhost",
    port: 9000,
    path: "/myapp",
});

to start a peerjs server: peerjs --port 3001

peerjs docs:
https://github.com/peers/peerjs-server#connecting-to-the-server-from-client-peerjs
https://peerjs.com/
https://peerjs.com/docs/#start
*/