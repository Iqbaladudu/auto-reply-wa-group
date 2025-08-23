import WhatsAppClient from "./src/whatsapp_client.js";

async function main() {
  try {
    console.log("Starting WhatsApp group joining process...");
    const client = new WhatsAppClient({ 
      enableReply: false, 
      instanceId: "group-joiner" 
    });
    
    console.log("Connecting to WhatsApp...");
    await client.connect();
    
    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("Starting to join groups...");
    await client.joinGroupsFromLinks();
    
    console.log("Group joining process completed!");
  } catch (error) {
    console.error("Error in main process:", error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
