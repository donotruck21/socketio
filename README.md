## Clone This Repo!
Open up your command line, navigate to your Desktop, and run the following command (may require sudo):

`git clone https://github.com/donotruck21/socketio.git`

Open your cloned folder in a text editor (Atom, Sublime, etc) and open up the file called **package.json**. Your application's dependencies (as well as some other metadata) live here. To actually install the dependencies listed, run the following command:

`npm install`

## Configuring Our Server
Our first step is to install socket.io. Since socket.io is just a node module we will install it using npm install.

`npm install socket.io --save`

Now let's configure the server side:

Open up your **server.js** file and add the following right after you instantiate your server variable

```
// this selects our port and listens
// note that we're now storing our app.listen within
// a variable called server. this is important!!
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
// this is a new line we're adding AFTER our server listener
// take special note how we're passing the server
// variable. unless we have the server variable, this line will not work!!
var io = require('socket.io').listen(server);Copy
This creates the io variable which we are going to use to control our sockets! After the line where we require socket.io we are going to set up the connection event. Remember the order! Server and our port listener come first, the io variable and require socket statement second, and last we'll have the io.sockets.on line as seen in the below snippet:

// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!
})
```


Perfect! Now we've got all the server side code configured.

Within the io.sockets.on() callback, we will put all of our code for anything socket-related! Easy huh?


## Configuring the Client:
Configuring the client is much easier.  Let's assume the app we're going to build is a single-page application, so we only need to serve one view, which will be served by the root route **(app.get('/')...etc )**.  To connect via socket connection, make your **index.ejs** look like this (note: the HTML syntax highlighting might be a little off.  Look closely for syntax!!):

```<html>
<head>
<title></title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type ="text/javascript" src="/socket.io/socket.io.js"></script>
    <script type ="text/javascript">
        $(document).ready(function (){
            // this triggers the connection event in our server!
            var socket = io.connect();
            // we'll write all the socket stuff after the above line!
        })
    </script>
</head>
<body>
    <button>I AM A BUTTON!</button>
    <!-- web page goes here -->
</body>
</html>
```

So, we did a couple of things here:

We used jQuery.  Not necessary, but totally useful.  Writing socket stuff without jQuery is like getting satellite radio in your car and then using the tape deck; you could do it, but why would you?

We required a file with a source of "/socket.io/socket.io.js".  This is the magic moment!  Requiring this file sets everything up for us.  The Express server is totally ready to handle that request, and as long as we have the socket.io module installed, we should be good!

Within our document.ready() method, we instantiated a variable called socket.  By requiring the js file in step 2, we were given an object called io, which has a method called connect().  Executing this method is what establishes the socket connection.  After we run this, we are totally connected!  This socket object will be our socket connection to our server. All emits and listeners will flow through this object. Remember this!

Congratulations, you are now working with web sockets. Welcome to web 2.0.

## Break it down
Start your server and pull up your app on a browser.  Now check your server terminal window.  You should see the message: "WE ARE USING SOCKETS" appear in your window.  This is good.  If this isn't happening, double and triple check your code for bugs. All of our code for web sockets on the server side will be written inside of the callback passed to the io.sockets.on('connection') method.  By default, when a client connects to a server, this code runs, so put that in the back of your mind because it could be useful for an assignment (hint).  Also, note in our console.log, we also logged something called socket.id.  This is a unique identifier that will allow you to associate extra data with the person via their socket connection (ie username, game number, it's up to you!).

On the client side, all we did was use the **io** object to create an object called **socket** that represented our socket connection to our server.  Let's see how we can flesh out some functionality.  After the line where we instantiated our socket connection in index.ejs, let's add the following:

In **index.ejs** (view file!) add:
```
$('button').click(function (){
    socket.emit("button_clicked", {reason: "because I want to learn about sockets!"});
});
socket.on('server_response', function (data){
    console.log('The server says: ' + data.response);
});
```
Now in **server.js** (server side code) let's add:

```
// If you don't know where this code is supposed to go reread the above info 
socket.on("button_clicked", function (data){
    console.log('Someone clicked a button!  Reason: ' + data.reason);
    socket.emit('server_response', {response: "sockets are the best!"});
})
```

Now things are heating up!  On the client, we emitted an event using socket.emit(). The first parameter we passed to that method was a string. This is the name of the event that will be emitted!!  This is how we define our custom events!  THIS IS CRUCIAL TO UNDERSTAND! The second parameter we passed to the method is a JSON object. This is the MEAN stack!  How else would we pass data?? The socket connection allows us to pass JSON objects back and forth between client and server. How sweet is that?

Next time you refresh your browser, when you click the button you made on your HTML page and the server should log:

Someone clicked a button!  Reason: because I want to learn about sockets!

Please take a moment to realize how we tied jQuery into this. The nice little callback attached to all jQuery event listeners is a great place to add code in! By doing this, we're able to emit our events when the user does something specific on our page. This is super important to understand. If you're rusty on your jQuery, you really might consider reviewing it!

Turning our attention to the server side, notice the callback on the server takes an object, and we call it data. This should be very straightforward. Also, notice the first parameter of the socket.on() method is a string that matches EXACTLY with the name of the event emitted by the server. In the callback of our "button_clicked" method, we added the line:

`socket.emit('server_response', {response: "sockets are the best!"})`

This is an example of emitting an event from the server to the client. The convention is very similar to the technique we just saw: we emit an event and pass a JSON object. Now we turn our attention to the client side!

Going back to the client side, let's check our browser's console. You should see something along the lines of: "The server says: sockets are the best!". That means our socket connection on the client side had the appropriate event triggered and the callback ran successfully and made use of the JSON object the server sent it.  Yay!

## Server-side emit syntax:
Remember we said the server has three different ways to communicate with sockets:

**Emit:** sends data from the server to the specific client who initiated contact.
**Broadcast:** sends data from the server to everyone BUT the client that initiated the contact.
**Full Broadcast:** sends data to all connected clients.

Here is sample code for each different method:
Note: we are just showing the emits, not any listeners.`

``
//  this is just the configuration code that we've already used
io.sockets.on('connection', function (socket) {
    //  EMIT:
    socket.emit('my_emit_event');
    //  BROADCAST:
    socket.broadcast.emit("my_broadcast_event");
    //  FULL BROADCAST:
    io.emit("my_full_broadcast_event");
})
```
