import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import dotenv from "dotenv";
dotenv.config();


let token = process.env.BOT_TOKEN;
let clientId = process.env.DIS_CLIENT_ID;
let guildId = process.env.DIS_GUILD_ID

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = join(process.cwd(), 'commands');
console.log('commandPath:', commandsPath)
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log('commandFiles:', commandFiles)
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})()