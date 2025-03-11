import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    WAMessage,
    WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import * as NodeCache from "node-cache";

export default class WhatsAppClient {
    private custom_data4: string;
    private msgRetryCounterCache: NodeCache;
    private sock: WASocket | undefined;

    constructor() {
        this.custom_data4 = fs.readFileSync("./data/iklan.txt", "utf-8");
        this.msgRetryCounterCache = new NodeCache();
    }

    private async handleConnectionUpdate(update: {
        connection?: string;
        lastDisconnect?: { error: any };
    }) {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut;

            console.log(
                "connection closed due to ",
                lastDisconnect?.error,
                ", reconnecting ",
                shouldReconnect
            );

            if (
                shouldReconnect ||
                (lastDisconnect?.error as Boom)?.output?.statusCode ===
                DisconnectReason.timedOut
            ) {
                await this.connect();
            } else if (
                (lastDisconnect?.error as Boom)?.output?.statusCode ===
                DisconnectReason.loggedOut
            ) {
                fs.rmSync("./auth_info_baileys", { recursive: true });
            }
        } else if (connection === "open") {
            fs.writeFile("./qrdata.txt", "", (err) => {
                if (err) {
                    console.error("An error occurred while creating the file:", err);
                    return;
                }
                console.log("File created successfully!");
            });
        }
    }

    private async handleMessagesUpsert(upsert: {
        messages: WAMessage[];
        type: string;
    }) {
        if (upsert.type === "notify") {
            for (const msg of upsert.messages) {
                console.log(msg)
                if (!msg.key.fromMe && msg.key.remoteJid?.endsWith("s.whatsapp.net")) {
                    console.log("replying to", msg.key.remoteJid);
                    await this.sock!.readMessages([msg.key]);
                    await this.sock!.sendMessage(msg.key.remoteJid!, {
                        text: `${this.custom_data4}`,
                    });
                }
            }
        }
    }

    public async connect(): Promise<WASocket> {
        const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
        this.sock = makeWASocket({
            version: [2, 3000, 1015901307],
            printQRInTerminal: true,
            auth: state,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache: this.msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
        });

        this.sock.ev.process(async (events) => {
            if (events["connection.update"]) {
                await this.handleConnectionUpdate(events["connection.update"]);
                await saveCreds();
            }

            if (events["messages.upsert"]) {
                await this.handleMessagesUpsert(events["messages.upsert"]);
            }
        });

        return this.sock;
    }

    public getSocket(): WASocket | undefined {
        return this.sock;
    }
}