const express = require('express');

const app = express()
const { v4: uuidv4 } = require('uuid');
const server = require('http').Server(app)

// ! Set to render .ejs
app.set('view engine', 'ejs')

// ! Set static resources
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

// TODO: Get room id
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})



const PORT = process.env.PORT || 3030
server.listen(PORT , console.log(`Server running on ${PORT}`))