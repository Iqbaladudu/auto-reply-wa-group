import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import * as fs from 'fs'
const NodeCache = require("node-cache")

const custom_data1 = fs.readFileSync("./data/random_satu.txt", "utf-8")
const custom_data2 = fs.readFileSync("./data/random_dua.txt", "utf-8")
const custom_data3 = fs.readFileSync("./data/random_tiga.txt", "utf-8")

const msgRetryCounterCache = new NodeCache()

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
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
                if(shouldReconnect || (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.timedOut) {
                  connectToWhatsApp()
                } else if((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut) {
                  fs.rmSync('./auth_info_baileys', { recursive: true })
                  // this.connectToWhatsApp()
                  // this.sock.printQRIfNecessaryListener()
                }
              } else if(connection === 'open') {
                fs.writeFile('./qrdata.txt', '', (err) => {
                  if (err) {
                    console.error('An error occurred while creating the file:', err)
                    return
                  }
                  console.log('File created successfully!')
                })
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
            console.log('recv messages ', upsert);

            if(upsert.type === 'notify') {
                for(const msg of upsert.messages) {
                    if(!msg.key.fromMe && msg.key.remoteJid?.endsWith("g.us") ) {
			const custom_data4 = fs.readFileSync("./data/random_empat.txt", "utf-8")
			const custom_data5 = fs.readFileSync("./data/random_lima.txt", "utf-8")
                        console.log('replying to', msg.key.remoteJid)
                        await sock!.readMessages([msg.key])
                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data1}`})
                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data5}`})
                        await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data4}`})
                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_tour}`})
                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_services}`})
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
