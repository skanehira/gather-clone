require('dotenv').config()
import { REST, Routes } from 'discord.js'
import { commands } from './commands'

const token = process.env.BOT_TOKEN!
const clientId = process.env.CLIENT_ID!
const guildId = process.env.SERVER_ID!

const commandJson = []

for (const command of commands) {
    commandJson.push(command.data.toJSON())
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commandJson.length} application (/) commands.`)
		// The put method is used to fully refresh all commands in the guild with the current set
		const data: any = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commandJson },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
})()