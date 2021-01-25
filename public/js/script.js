// ? **************************************Set Up Section*********************************** ? //

const socket = io('/')

// TODO: Setup new peer connection
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: "/",
    port: "3030"
})


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
    socket.on('someone-connected', (userId) => {
        showToast(`${userId} has joined`)

        setTimeout(() => {
            connectTheirVideo(userId, stream) // ? this function will render other user video stream
        }, 2000) //! problem : stream is not available directly when event "someone-connected", so, need extra time to wait for stream
    })
}).catch(error => console.error(error));

peer.on('open', (id) => {
    // emit user and its id when joined the room
    socket.emit('join-room', ROOM_ID, id)
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
    socket.on('someone-disconnected', userId => {
        showToast(`${userId} has left`)
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

//  TODO: Open Chat
const openIC = document.querySelector("#main__control__chat").addEventListener('click', () => {
    const chat = document.querySelector('.main__right__hidden')
    if (chat) {
        chat.className = "main__right"

        // ? SET ICON COLOR
        const chatControlColor = document.querySelector('#main__control__chat')
        chatControlColor.style.color = 'slategray'
    } else {
        const chat = document.querySelector('.main__right')
        chat.className = "main__right__hidden"

        // ? SET COLOR BACK TO WHITE
        const chatControlColor = document.querySelector('#main__control__chat')
        chatControlColor.style.color = '#fff'
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
