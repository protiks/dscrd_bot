import fs from 'fs';
import { join } from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

import dotenv from "dotenv";
dotenv.config();

let token = process.env.BOT_TOKEN;

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	] 
});
client.commands = new Collection();

const commandsPath = join(process.cwd(), "commands");
const commandFiles = fs.readdirSync(commandsPath)
.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  import(filePath)
  .then((module) => {
    client.commands.set(module.data.name, module);
  })
  .catch((error) => {
    console.error(error);
  });
}

const eventsPath = join(process.cwd(), 'events');
// console.log('eventsPath:', eventsPath)
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
// console.log('eventFiles:', eventFiles)
	
for (const file of eventFiles) {
	// console.log(file)
	const filePath = join(eventsPath, file);
	const event = await import(filePath)
	if (event.once) {
		client.once(event.name, (...args) => {
			event.execute(...args)
		})
	} else {
		client.on(event.name, (...args) => {
			event.execute(...args)
		})
	}
}

client.login(token);