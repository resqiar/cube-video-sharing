
// TODO: Save video grid element
const videoGrid = document.getElementById("video-grid")

// TODO: Create new element <video> when video is connected
const videoElement = document.createElement('video')
videoElement.muted = true

// TODO: Create global var for video 
let myVideoStream

// TODO: Request user permission to access video and audio
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then( stream => {
    myVideoStream = stream

    // handle the stream
    addVideoStream(videoElement, stream)
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