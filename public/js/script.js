// ? **************************************Set Up Section*********************************** ? //

const socket = io('/')

// TODO: Setup new peer connection
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: "/",
    port: "3000"
})

// TODO: Get username from cache
let username = sessionStorage.getItem('fullname')

// ! If null then ask user if they wanna have a username?
if (sessionStorage.getItem('fullname') === null) {
    const getFullname = prompt("Looks like you dont have username yet?", "")

    if (getFullname === null || getFullname === "") { // ! If they dont want - set to default username
        username = 'Anonymous'
    } else {  // ! If they provide the following - save it to web session - so when user reload - safe
        username = getFullname

        // save to local local storage
        sessionStorage.setItem('fullname', getFullname)
    }
}


// ? **************************************Video Section*********************************** ? //

// TODO: Create global var for video stream
let myVideoStream // ? user's video stream

// TODO: Save video grid element
const videoGrid = document.getElementById("video__grid")

// TODO: Create new element <video> when video is connected
const myVideo = document.createElement('video')

myVideo.muted = true

// TODO: Request user permission to access video and audio
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
    myVideoStream = stream

    // TODO: Add user their own video stream
    addVideoStream(myVideo, stream)

    // TODO : When on call - answer a call then provide user's mediaStream - *to another user*
    peer.on('call', call => {
        // Answer the call, providing our mediaStream
        call.answer(stream);

        // create new element
        const newVideo = document.createElement('video')

        // call everyone else to provide their video stream as well
        call.on('stream', userVideoStream => {
            addVideoStream(newVideo, userVideoStream)
        })
    })

    // TODO: When someone connected to the room - tell everyone to peer each other
    socket.on('someone-connected', (userId, fullname) => {
        showToast(`${fullname} has joined`)

        setTimeout(() => {
            connectTheirVideo(userId, stream) // ? this function will render other user video stream
        }, 2000) //! problem : stream is not available directly when event "someone-connected", so, need extra time to wait for stream
    })
}).catch(error => console.error(error));

peer.on('open', (id) => {
    // emit user and its id when joined the room
    socket.emit('join-room', ROOM_ID, id, username)
});



// ? This function wil handle someone else video stream and render it to view
const connectTheirVideo = (userId, stream) => {

    // Call a peer, providing our mediaStream
    const call = peer.call(userId, stream);

    // create a new element for other user's video
    const videoElement = document.createElement('video')

    // call them
    call.on('stream', userVideoStream => {
        addVideoStream(videoElement, userVideoStream)
    })

    call.on('close', () => {
        videoElement.remove()
    })

    // TODO: When their stream is disconnected - remove their video element
    socket.on('someone-disconnected', (userId , fullname) => {
        showToast(`${fullname} has left`)
        videoElement.remove()
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
}

// TODO: Show bottom toast
const showToast = (message) => {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
    // Add the "show" class to DIV
    x.className = "show"
    x.innerHTML = message

    // After 3 seconds, remove the show class from DIV
    setTimeout(() => { x.className = x.className.replace("show", "") }, 3000)
}

// ? **************************************Functionality Section*********************************** ? //


//  TODO: Open Chat
const openIC = document.querySelector("#main__control__chat").addEventListener('click', () => {
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
    scrollToBottom()
})

const scrollToBottom = () => {
    const container = document.querySelector(".main__chat")
    container.scrollTop = container.scrollHeight
}

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

