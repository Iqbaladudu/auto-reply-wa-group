import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import * as fs from 'fs'

const NodeCache = require("node-cache")

const data_tour = fs.readFileSync("./data/tour.txt", "utf-8");
const data_services = fs.readFileSync("./data/services.txt", "utf-8")

const msgRetryCounterCache = new NodeCache()

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
    })
    sock.ev.process(
        async (events) => {
          if(events["connection.update"]) {
            const update = events["connection.update"]
			const { connection, lastDisconnect } = update
            if(connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
                // reconnect if not logged out
                if(shouldReconnect) {
                    connectToWhatsApp()
                }
            } else if(connection === 'open') {
                console.log('opened connection')
                update.receivedPendingNotifications = false
            }
          }
          if(events["connection.update"]) {
            await saveCreds()
          }

          if(events["labels.association"]) {
            console.log(events["labels.association"])
          }

          if(events['messages.upsert']) {
            const upsert = events['messages.upsert']
            console.log('recv messages ', upsert)

            if(upsert.type === 'notify') {
                for(const msg of upsert.messages) {
                    if(!msg.key.fromMe) {
                        console.log('replying to', msg.key.remoteJid)
                        await sock!.readMessages([msg.key])
                        await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_tour}`})
                        await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_services}`})
                    }
                }
            }
        }
        }
    )
    // sock.ev.on('messages.upsert', async m => {
    //     console.log("Sending Message")
    //     await sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_services}`,})
    // })

    // sock.ev.on('messages.upsert', m => {
    //     console.log(m.messages[0].message?.senderKeyDistributionMessage?.groupId)
        // console.log("Pesan dikirim")
        // sock.sendMessage(m.messages[0].key.remoteJid!, { image: { url: "./data/tour.png"}, caption: `${data_tour}`})
        // sock.sendMessage(m.messages[0].key.remoteJid!, { image: { url: "./data/services.png"}, caption: `${data_services}`})
        // sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_tour}`, });
        // sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_services}`, });
        // console.log(m.messages[0])
        // sock.sendMessage(m.messages[0].key.remoteJid!, buttonMessage)
    // })

    // sock.ev.on('chats.upsert', c => {
    //     console.log(c[0])
    // })
    // sock.ev.on("labels.association", async l => {
    //     await sock.sendMessage(l.association.chatId, { text: `${data_tour}`, });
    // })

    // sock.ev.on("groups.update", g => {
    //     console.log(g[0])
    // })
    // sock.ev.on("groups.upsert", g => {
    //     console.log(g[0])
    // })
    return sock
}
// run in main file
connectToWhatsApp()
