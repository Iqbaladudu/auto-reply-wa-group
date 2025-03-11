import WhatsAppClient from "./src/whatsapp_client";

const whatsapp = new WhatsAppClient()

whatsapp.connect().then(() => {
  console.log("Connected");
}).catch((error) => {
  console.error("Connection failed:", error);
});