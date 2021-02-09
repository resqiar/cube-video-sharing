/**
 * TODO: REFACTORING
 * ? A whole set-up code (peer, username, etc) => moved to /utils/setup/Setup.js
 * ? dragElement() => /utils/draggable/Draggable.js
 * ? setFullscreen() => /utils/fullscreen/Fullscreen.js
 * ? scrollToBottom() => /utils/scroll/Scroll.js
 * ? showToast() => /utils/toast/Toast.js
 */

//  **************************************Video Section***********************************  //

// TODO: Create global var for video stream
let myVideoStream // ? user's video stream
let screenStream // ? user's screen stream

// TODO: Save video grid element
const videoGrid = document.querySelector(".stream__video__grid")
const screenGrid = document.querySelector("#video__grid")

// TODO: Create new element <video> when video is connected
const myVideo = document.createElement('video')
myVideo.className = 'stream-video'
myVideo.muted = true

// TODO: Request user permission to access video and audio
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    myVideoStream = stream


    // TODO: Add user their own video stream
    addVideoStream(myVideo, stream)

    // TODO : When on call - answer a call then provide user's mediaStream - *to another user*
    peer.on('call', call => {

        // Answer the call, providing our mediaStream
        call.answer(stream);

        // create new element
        const newVideo = document.createElement('video')
        newVideo.className = 'stream-video'
        newVideo.controls = false
        currentPeer.push(call.peerConnection);

        // call everyone else to provide their video stream as well
        call.on('stream', userVideoStream => {
            addVideoStream(newVideo, userVideoStream)
        })
    })

    // TODO: When someone connected to the room - tell everyone to peer each other
    socket.on('someone-connected', (userId, fullname) => {
        showToast(`${fullname} has joined`)
        setFullscreen()

        // create a new element for other user's video
        const videoElement = document.createElement('video')
        videoElement.className = 'stream-video'
        videoElement.controls = false
        videoElement.muted = true

        setTimeout(() => {
            connectTheirVideo(userId, stream, videoElement) // ? this function will render other user video stream
        }, 2000) //! problem : stream is not available directly when event "someone-connected", so, need extra time to wait for stream
    })
}).catch(error => console.error(error));


peer.on('open', (id) => {
    // TODO: emit user and its id when joined the room
    socket.emit('join-room', ROOM_ID, id, username)
});



// ? This function wil handle someone else video stream and render it to view
const connectTheirVideo = (userId, stream, videoElement) => {
    videoElement.srcObject = stream
    videoElement.controls = false

    // Call a peer, providing our mediaStream
    const call = peer.call(userId, stream);

    // call them
    call.on('stream', userVideoStream => {
        addVideoStream(videoElement, userVideoStream)
    })

    // ? Whenever call closed, the element (video) will removed immediatelly
    call.on('close', () => {
        videoElement.remove()
    })

    peers[userId] = call;
    currentPeer.push(call.peerConnection);

    // TODO: When their stream is disconnected - remove their video element
    socket.on('someone-disconnected', (userId, fullname) => {
        showToast(`${fullname} has left`) // Toast.js
        setFullscreen() // Fullscreen.js

        videoElement.remove()
        if (peers[userId]) peers[userId].close();
    })
}

// TODO: Create function to handle video stream
const addVideoStream = (element, stream) => {
    element.srcObject = stream

    // play video
    element.addEventListener('loadedmetadata', () => {
        element.play()
    })

    // append video to html
    videoGrid.append(element)

    setFullscreen() // Fullscreen.js
}

//  **************************************Functionality Section***********************************  //

// TODO: Hide/Show Control
const btnHide = document.querySelector('.main__hide__control')
const btnShow = document.querySelector('.main__show__control')

btnHide.addEventListener('click', () => {
    hideControl()
})
btnShow.addEventListener('click', () => {
    showControl()
})

const hideControl = () => {
    document.querySelector('.main__control').style = 'display:none'
    document.querySelector('.main__control').className = 'main__control main__control__hidden'
    document.querySelector('.main__hide__control').style = 'display:none'
    document.querySelector('.main__show__control').style = 'display:flex'
}

const showControl = () => {
    document.querySelector('.main__show__control').style = 'display:none'
    document.querySelector('.main__control').style = 'display:flex'
    document.querySelector('.main__control').className = 'main__control'
    document.querySelector('.main__hide__control').style = 'display:flex'
}

//  TODO: Open Chat
const openIC = document.querySelector("#main__control__chat")

openIC.addEventListener('click', () => {
    const chat = document.querySelector('.main__right__hidden')
    if (chat) {
        chat.className = "main__right"

        // ? SET ICON COLOR
        const chatControlColor = document.querySelector('#main__control__chat')
        chatControlColor.style.color = '#fff'
    } else {
        const chat = document.querySelector('.main__right')
        chat.className = "main__right__hidden"

        // ? SET COLOR BACK TO WHITE
        const chatControlColor = document.querySelector('#main__control__chat')
        chatControlColor.style.color = 'gray'
    }
})

//  TODO: Close Chat from icon
const closeIC = document.querySelector("#close").addEventListener('click', () => {
    const chat = document.querySelector('.main__right')
    chat.className = "main__right__hidden"

    // ? SET COLOR BACK TO WHITE
    const chatControlColor = document.querySelector('#main__control__chat')
    chatControlColor.style.color = '#fff'
})


// TODO: Send message when user press enter
const input = document.querySelector('#chat__input')

// set event 
input.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) { // when user type "enter"
        e.preventDefault()

        // check if null - then return
        if (input.value.length <= 0) return;

        socket.emit('message', input.value, peer.id)

        // reset input
        input.value = ''
    }
})

// TODO: Retrive the message
socket.on('messaging', (message, userId, fullname) => {
    const column = document.querySelector('.chat__column')

    const li = `<li class="chat__container"><span class="chat__user">${fullname}</span><span class="chat__text">${message}</span></li>`

    column.insertAdjacentHTML("beforebegin", li)

    // TODO: Scroll automatically to the bottom
    scrollToBottom() // Scroll.js
})


// TODO: Mute or unmute the audio
const muteUnmute = () => {
    if (!myVideoStream) return;

    // first of all
    // check the audio - if enabled or not
    const audioEnabled = myVideoStream.getAudioTracks()[0].enabled

    // ? then simply enable/disable the audio => The icon should alse updated accordingly
    if (audioEnabled) {
        myVideoStream.getAudioTracks()[0].enabled = false

        iconMute(true) // set icon to muted
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true

        iconMute(false) // set icon to unmuted
    }
}

// TODO: Change icon based on audio conditions
const iconMute = (isMute) => {
    if (isMute) {
        const html = `
        <i class="fas fa-microphone-alt-slash active"></i>
        <span class="main__control__button__text active">Unmute</span>
        `

        document.querySelector('#main__control__audio').innerHTML = html
    } else {
        const html = `
        <i class="fas fa-microphone-alt"></i>
        <span class="main__control__button__text">Mute</span>
        `

        document.querySelector('#main__control__audio').innerHTML = html
    }
}

// TODO: Enable/disable video stream
const streamUnstream = () => {
    if (!myVideoStream) return;

    // first of all
    // check the video - if enabled or not
    const audioEnabled = myVideoStream.getVideoTracks()[0].enabled

    // ? then simply enable/disable the audio => The icon should alse updated accordingly
    if (audioEnabled) {
        myVideoStream.getVideoTracks()[0].enabled = false

        iconStream(false) // set icon to unstream
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true

        iconStream(true) // set icon to stream
    }
}

const iconStream = (isStream) => {
    if (!isStream) {
        const html = `
        <i class="fas fa-lg fa-video-slash active"></i>
        <span class="main__control__button__text active">Stream</span>
        `

        document.querySelector('#main__control__video').innerHTML = html
    } else {
        const html = `
        <i class="fas fa-lg fa-video"></i>
        <span class="main__control__button__text">Unstream</span>
        `

        document.querySelector('#main__control__video').innerHTML = html
    }
}


const myScreen = document.createElement('video')
myScreen.className = 'screen-video'
let screenPermission = true

const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: "always"
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true
        }
    }).then(stream => {
        screenStream = stream
        let screenTrack = stream.getVideoTracks()[0]
        screenTrack.onended = () => {
            shareUnshare()
        }

        iconShareScreen(true) // set icon

        // TODO: Search All Available Peer => 
        for (let i = 0; i < currentPeer.length; i++) {

            let sender = currentPeer[i].getSenders().find((sender) => {
                return sender.track.kind == screenTrack.kind
            })

            sender.replaceTrack(screenTrack)
        }

        // THIS WILL HIDE VIDEO STREAM FOR NOW
        document.querySelector('.stream__video__grid').className = 'onsharing__grid'
        document.querySelectorAll('.stream-video').forEach((item) => {
            item.className = 'onsharing-video'
        })

        // TODO: Emit to server that someone is sharing his screen
        socket.emit('sharing', peer.id, username)

        // Make the DIV element draggable:
        // dragElement(document.querySelector(".onsharing__grid"))

        addScreenStream(myScreen, stream)
    }).catch((e) => {
        console.log(e)
    })
}

// TODO: Create function to handle screen stream
const addScreenStream = (element, stream) => {
    element.srcObject = stream

    // play video
    element.addEventListener('loadedmetadata', () => {
        element.play()
    })

    // append video to html
    screenGrid.append(element)
}

// TODO: Create function to handle stop/enable screen sharing
const shareUnshare = () => {
    if (!screenPermission) {
        return;
    }

    if (!screenStream) {
        shareScreen()
    } else {
        const tracks = myScreen.srcObject.getTracks()

        tracks.forEach(track => track.stop());
        myScreen.srcObject = null;
        myScreen.remove()
        screenStream = null

        let videoTrack = myVideoStream.getVideoTracks()[0];
        for (let i = 0; i < currentPeer.length; i++) {
            let sender = currentPeer[i].getSenders().find(function (sender) {
                return sender.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack);
        }

        document.querySelector('.onsharing__grid').className = 'stream__video__grid'
        const v = document.querySelectorAll('.onsharing-video').forEach(function (item) {
            item.className = 'stream-video';
        })

        // TODO: Show everyone that share screen is just stopped
        socket.emit('stop-sharing', peer.id, username)

        iconShareScreen(false) // set icon 
    }
}


const iconShareScreen = (isSharing) => {
    if (!isSharing) {
        const html = `
        <i class="fas fa-lg fa-external-link-square-alt text-warning"></i>
            <span class="main__control__button__text text-warning">Share Screen</span>
        `

        document.querySelector('#main__control__shareScreen').innerHTML = html
    } else {
        const html = `
        <i class="fas fa-lg fa-ban text-warning"></i>
            <span class="main__control__button__text text-warning">Stop Sharing</span>
        `

        document.querySelector('#main__control__shareScreen').innerHTML = html
    }
}


// TODO: When someone is sharing ? what todo ?
socket.on('someone-sharing', (id, fullname) => {
    setFullscreen() // Fullscreen.js

    // when current user is sharing => do nothing except show toast
    if (peer.id === id) {
        showToast(`You are now sharing screen`)
    } else { // when another user is sharing => bind the stream
        showToast(`${fullname} is sharing screen`)

        // HIDE SHARE SCREEN
        screenPermission = false
        document.querySelector('#main__control__shareScreen').style = 'display:none'
    }

})

// TODO: When someone is stop sharing ? what todo ?
socket.on('someone-unshare', (id, fullname) => {
    setFullscreen()
    // when current user is sharing => do nothing except show toast
    if (peer.id === id) {
        showToast(`You are now stop share screen`)
    } else { // when another user is sharing => bind the stream
        showToast(`${fullname} stop share screen`)

        // SHOW SHARE SCREEN
        screenPermission = true
        document.querySelector('#main__control__shareScreen').style = 'display:flex'
    }
})