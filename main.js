const { app, Tray, Menu } = require('electron')
const path = require('path')
const log = require('electron-log')
log.info("=== APP STARTED ===")

//THIS DOTENV CONFIG IS FOR DEV ONLY
// require('dotenv').config({
//   path: process.env.NODE_ENV === 'production'
//     ? '.env.production'
//     : '.env.development'
// })
//PROD DONTENV:

const isPackaged = app.isPackaged
console.log("DEBUG: app isPackaged: ", isPackaged)
require('dotenv').config({
  path: isPackaged ? '.env.production' : '.env.development'
})

let currentStatus = "chilling"
let emoji = '🌿'
let tray = null

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: "🎵 Making Music",
      type: "radio",
      checked: currentStatus === "music",
      click: () => updateStatus("music", '🎵')
    },
    {
      label: "🎨 Art",
      type: "radio",
      checked: currentStatus === "art",
      click: () => updateStatus("art", '🎨')
    },
    {
      label: "🎮 Gaming",
      type: "radio",
      checked: currentStatus === "gaming",
      click: () => updateStatus("gaming", '🎮')
    },
    {
      label: "💻 Coding",
      type: "radio",
      checked: currentStatus === "coding",
      click: () => updateStatus("coding", '💻')
    },
    {
      label: "🎹 FL Studio",
      type: "radio",
      checked: currentStatus === "flstudio",
      click: () => updateStatus("flstudio", '🎹')
    },
    {
      label: "🌿 Chilling",
      type: "radio",
      checked: currentStatus === "chilling",
      click: () => updateStatus("chilling", '🌿')
    },
    {
      label: "💤 AFK",
      type: "radio",
      checked: currentStatus === "afk",
      click: () => updateStatus("afk", '💤')
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() }
  ]);
}

async function sendPresence(){
    const payload = {
        status: currentStatus,
        emoji,
        timeStamp: Date.now()
    }

    console.log("sending presence: ", payload)
    log.info("sending presence to backend...");
    log.info("BACKEND_URL:", process.env.BACKEND_URL);
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
        if (!response.ok) {
            log.error("presence POST failed:", response.status);
        } else {
            log.info("yes gorl, presence sent successfully");
        }
    }
    catch(err){
    console.error("FAILED TO SEND PRESENCE:", err);
    log.error("FAILED TO SEND PRESENCE: ", err)
  }
}

async function updateStatus(newStatus, newEmoji){
    currentStatus = newStatus
    emoji = newEmoji
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