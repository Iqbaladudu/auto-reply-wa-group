import WhatsAppClient from "./src/whatsapp_client.js";


const whatsapp = new WhatsAppClient()

whatsapp.connect().then(() => {
  console.log("Connected");
}).catch((error) => {
  console.error("Connection failed:", error);
});