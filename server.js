const express = require('express');

const app = express()
const { v4: uuidv4 } = require('uuid');
const server = require('http').Server(app)
const cors = require('cors');
// SOCKET.IO
const io = require('socket.io')(server)
// PEER SERVER
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

// ! Set to render .ejs
app.set('view engine', 'ejs')

// ! Set static resources
app.use(express.static('public'))

// ! peerjs
app.use('/peerjs', peerServer);

app.use(cors())

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
        socket.to(roomId).broadcast.emit('someone-connected', userId)
        
        // broadcast to everyone in the specific room that someone has send a message
        socket.on('message', message => {
            io.to(roomId).emit('messaging', message, userId)
        })

        // broadcast to everyone in the specific room that someone has left
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('someone-disconnected', userId)
        })
    })
})


const PORT = process.env.PORT || 3030
server.listen(PORT, console.log(`Server running on ${PORT}`))