import WhatsAppClient from "./src/whatsapp_client.js";

try {
  console.log("Initializing WhatsApp Auto-Reply Bot...");
  const whatsapp = new WhatsAppClient({ 
    enableReply: true, 
    instanceId: "auto-reply-bot" 
  });
  
  whatsapp.connect().then(() => {
    console.log("✅ WhatsApp bot connected successfully!");
    console.log("🤖 Auto-reply is now active for group messages.");
  }).catch((error) => {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  });
} catch (error) {
  console.error("❌ Failed to initialize bot:", error.message);
  process.exit(1);
}
