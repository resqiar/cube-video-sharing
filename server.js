const express = require('express');

const app = express()
const { v4: uuidv4 } = require('uuid');
const server = require('http').Server(app)
// SOCKET.IO
const io = require('socket.io')(server)
// PEER SERVER
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use('/peerjs', peerServer);

// ! Set to render .ejs
app.set('view engine', 'ejs')

// ! Set static resources
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

// TODO: Get room id
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

// TODO: Set Socket.io con
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        // Join user to the room
        socket.join(roomId)

        // broadcast to everyone in the specific room that someone has joined
        socket.to(roomId).emit('someone-connected', userId)
    })
})


const PORT = process.env.PORT || 3030
server.listen(PORT, console.log(`Server running on ${PORT}`))