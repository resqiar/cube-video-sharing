
///
/// TODO: This method will automatically scroll chat to the bottom (latest)
/// 
const scrollToBottom = () => {
    const container = document.querySelector(".main__chat")
    container.scrollTop = container.scrollHeight
}