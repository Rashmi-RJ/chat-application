const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const {Server} = require('socket.io');

const { join } = require('node:path');


app.use(cors({
    origin: 'http://localhost:7000/',
    methods:["GET","POST"]
}))
const PORT = process.env.PORT || 7000;

const io = new Server(http);

const path=require('path')
app.get('/', (req, res) => {
    res.sendFile(join(path.resolve(__dirname,'client','index.html')));
    
  });
  
app.use(express.static(path.resolve(__dirname, 'client')))
app.use(express.static('../public'))

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

});