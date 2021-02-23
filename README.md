# Cube Video Sharing Application
Video sharing application with real-time data communication. Powered by Socket.io and Peer to Peer data stream.

# 📷 Screenshot
![screenshot-image](https://i.imgur.com/Ut5zGo0.png)

### 🌐 Live Preview (Demo)
> You can live preview it on heroku hosting [HERE](https://guarded-harbor-56339.herokuapp.com/)

# 🎉 New Features
- Share Screen
- Click to Fullscreen
- Keyboard Binding Controls
- UI Improvement

### ⚙️ Developed using
- Node.js
- Express.js
- Socket.io
- PeerJs

# 📥 How to install

Make sure you have Node.js installed in your system.

### Clone this repo

    git clone https://github.com/resqiar/cube-video-sharing

### Install PeerJS (global installation is recommended)

    npm i -g peerjs

### Install all required modules

    npm install

# 📥 How to use

### Run Server

    npm run dev

Server Started on Port 3000.

### Run PeerJS Server in separate terminal.

    peerjs --port 443
    
PeerJS Server Started on Port 443.
> If you encountered an error => change port: "443" to port "3000" in public/js/utils/setup/Setup.js and skip step above

### Open a browser

Open browser and goto http://localhost:3000/

### Allow permission

Allow camera and audio access requested.

### Enter username (Optional)

Username will be stored in the web session, meaning that it won't be changed or prompted again unless you close the tab

> if you don't specify any, the default is 'Anonymous'

### Share the link

Share the link to your friends to start video sharing

# 🐞 Issue
If you encountered bugs please make a new issue [here](https://github.com/resqiar/cube-video-sharing/issues)
