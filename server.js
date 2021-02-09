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
    res.redirect(`/sharing/${uuidv4()}`)
})

// TODO: Get room id
app.get('/sharing/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

app.get('/thankyou', (req, res) => {
    res.render('finish')
})

// TODO: Set Socket.io con
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId, fullname) => {
        // Join user to the room
        socket.join(roomId)

        // broadcast to everyone in the specific room that someone has joined
        socket.to(roomId).broadcast.emit('someone-connected', userId, fullname)
        
        // broadcast to everyone in the specific room that someone has send a message
        socket.on('message', message => {
            io.to(roomId).emit('messaging', message, userId, fullname)
        })

        socket.on('sharing', (id, fullname) => {
            io.to(roomId).emit('someone-sharing', id, fullname)
        })

        socket.on('stop-sharing', (id, fullname) => {
            io.to(roomId).emit('someone-unshare', id, fullname)
        })

        // broadcast to everyone in the specific room that someone has left
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('someone-disconnected', userId, fullname)
        })
    })
})


const PORT = process.env.PORT || 3000
server.listen(PORT, console.log(`Server running on ${PORT}`))