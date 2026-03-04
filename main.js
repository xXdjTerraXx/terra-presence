const { app, Tray, Menu } = require('electron')
const path = require('path')
require('dotenv').config()

let currentStatus = "chilling"
let tray = null

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: "🎵 Making Music",
      type: "radio",
      checked: currentStatus === "music",
      click: () => updateStatus("music")
    },
    {
      label: "🎨 Art",
      type: "radio",
      checked: currentStatus === "art",
      click: () => updateStatus("art")
    },
    {
      label: "🎮 Gaming",
      type: "radio",
      checked: currentStatus === "gaming",
      click: () => updateStatus("gaming")
    },
    {
      label: "💻 Coding",
      type: "radio",
      checked: currentStatus === "coding",
      click: () => updateStatus("coding")
    },
    {
      label: "🌿 Chilling",
      type: "radio",
      checked: currentStatus === "chilling",
      click: () => updateStatus("chilling")
    },
    {
      label: "💤 AFK",
      type: "radio",
      checked: currentStatus === "afk",
      click: () => updateStatus("afk")
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() }
  ]);
}

async function sendPresence(){
    const payload = {
        status: currentStatus,
        timeStamp: Date.now()
    }

    console.log("sending presence: ", payload)

    //backend post request 
    try{
        const response = await fetch(process.env.BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.AUTH_KEY
            },
            body: JSON.stringify(payload)
        })
    }
    catch(err){

    }
}

async function updateStatus(newStatus){
    currentStatus = newStatus
    console.log(`status updated to ${newStatus}`)
    tray.setContextMenu(buildMenu())
    await sendPresence()
}

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'icon.png'))
    //immediately send presence when app starts
    sendPresence()

    //heartbeat every 30 seconds
    setInterval(sendPresence, 30000)
    tray.setToolTip('Terra Presence')
    tray.setContextMenu(buildMenu()) 
})