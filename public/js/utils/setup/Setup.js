// ? **************************************Set Up Section*********************************** ? //

const socket = io('/')
let peers = {}, currentPeer = [];
let userlist = [];

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
    } else { // ! If they provide the following - save it to web session - so when user reload - safe
        username = getFullname

        // save to local local storage
        sessionStorage.setItem('fullname', getFullname)
    }
}