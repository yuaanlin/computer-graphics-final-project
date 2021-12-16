function sendPopMessage(title: string, message: string, duration: number) {
  const ele = document.getElementById("pop-message")
  const t = document.getElementById("pop-message-title")
  const c = document.getElementById("pop-message-content")

  if (!ele || !t || !c) {
    return
  }

  t.innerText = title;
  c.innerText = message;

  setTimeout(() => {
    ele.className = 'pop-message'
  }, 10)

  setTimeout(() => {
    ele.className = 'pop-message hide'
  }, duration * 1000)

}

export default sendPopMessage;