# Cube Video Sharing Application
Video sharing application with real-time data communication. Powered by Socket.io and Peer to Peer data stream.

## Screenshot
![screenshot-image](https://i.imgur.com/Ut5zGo0.png)

### Live Preview
> You can live preview it on heroku hosting [here](https://guarded-harbor-56339.herokuapp.com/)
https://guarded-harbor-56339.herokuapp.com/

### Current Feature on Development
- Share Screen

### Developed using
- Node.js
- Express.js
- Socket.io
- PeerJs

## How to install

Make sure you have Node.js installed in your system.

Clone this repo

    git clone https://github.com/resqiar/cube-video-sharing

Install PeerJS (global installation is recommended)

    npm i -g peerjs

Now to install all required node modules

    npm install

## How to use

### Run Server

    node run dev

Server Started on Port 3030.

### Run PeerJS Server in separate terminal.

    peerjs --port 443
    
> If you encountered an error => change port: 443 to port 3030 in script.js and skip step above

PeerJS Server Started on Port 443.

### Open a browser

Open browser and goto http://localhost:3030/

### Allow permission

Allow camera and audio access requested.

### Enter username

Username will stored in web session, meaning that it won't be changed or prompted again unless you close the tab

> if you dont specify any name => default name is 'Anonymous'

### Share the link

Share the link to your friends to start video sharing
