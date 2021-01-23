// ? **************************************Set Up Section*********************************** ? //

const socket = io('/')

// TODO: Setup new peer connection
var peer = new Peer(undefined, {
    host: '/',
    port: '3030',
    path: '/peerjs'
})

peer.on('open', (id) => {
    // emit user and its id when joined the room
    socket.emit('join-room', ROOM_ID, id)
});



// ? **************************************Video Section*********************************** ? //

// TODO: Save video grid element
const videoGrid = document.getElementById("video-grid")

// TODO: Create new element <video> when video is connected
const videoElement = document.createElement('video')
videoElement.muted = true

// TODO: Create global var for video 
let myVideoStream

// TODO: Request user permission to access video and audio
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
    myVideoStream = stream

    // TODO: Add user their own video stream
    addVideoStream(videoElement, stream)

    // TODO : When on call - answer a call then provide user's mediaStream - *to another user*
    peer.on('call', (call) => {
        // Answer the call, providing our mediaStream
        call.answer(stream);

        // create new element
        const newVideo = document.createElement('video')

        // call everyone else to provide their video stream as well
        call.on('stream', (userVideoStream) => {
            addVideoStream(newVideo, userVideoStream)
        })
    })

    // TODO: When someone connected to the room - tell everyone to peer each other
    socket.on('someone-connected', (userId) => {
        connectTheirVideo(userId, stream) // ? this function will render other user video stream
    })
})

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


// ? This function wil handle someone else video stream and render it to view
const connectTheirVideo = (userId, dataStream) => {
    console.log(`${userId} has connected `)

    // Call a peer, providing our mediaStream
    var call = peer.call(userId, dataStream);

    // create a new element for other user's video
    const videoElement = document.createElement('video')

    // call them
    call.on('stream', (userVideoStream) => {
        addVideoStream(videoElement, userVideoStream)
    })
}