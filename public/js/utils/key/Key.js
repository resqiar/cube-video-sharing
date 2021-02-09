
// 
// TODO: Bind some keyboard controls
// ? It will be changed by the user in the future
// 

window.addEventListener('keydown', (e) => {

    // ? HIDE / UNHIDE CONTROL TAB
    if (e.altKey && e.key === 'h') {
        const hiddenTab = document.querySelector('.main__control__hidden') 
        if (hiddenTab) {
            showControl()
        }else {
            hideControl()
        }
    }

    // ? MUTE AUDIO / UNMUTE KEY
    else if (e.altKey && e.key === 'a'){
        muteUnmute()
    } 
    
    // ? STREAM VIDEO / UNSTREAM KEY
    else if (e.altKey && e.key === 'v'){
        streamUnstream()
    } 

    // ? SHARE / UNSHARE SCREEN KEY
    else if (e.altKey && e.key === 's'){
        shareUnshare()
    }
    
    // ? OPEN / CLOSE CHAT KEY
    else if (e.altKey && e.key === 'c') {
        openIC.click()
    }
})