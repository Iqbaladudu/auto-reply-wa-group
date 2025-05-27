import WhatsAppClient from "./src/whatsapp_client.js";

async function main() {
  const client = new WhatsAppClient({ enableReply: false });
  await client.connect();
  await client.joinGroupsFromLinks();
  process.exit(0);
}

main();
