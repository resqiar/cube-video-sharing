const express = require('express');

const app = express()

const server = require('http').Server(app)




app.get('/', (req, res) => {
    res.send('Hello World')
})




const PORT = process.env.PORT || 3030
server.listen(PORT , console.log(`Server running on ${PORT}`))