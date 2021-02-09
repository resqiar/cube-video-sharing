// 
// TODO: use screenfull to generate fullscreenable element
// 
const setFullscreen = () => {
    const v = document.querySelectorAll('.stream-video').forEach(function (item) {
        item.addEventListener('click', () => {
            if (screenfull.isEnabled) {
                screenfull.toggle(item, {navigationUI: 'hide'})
            }
        })
    })
}