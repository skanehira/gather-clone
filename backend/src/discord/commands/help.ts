import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('learn the Realms commands'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!(interaction.channel instanceof GuildChannel)) return
    if (!interaction.channel.isTextBased()) {
        return await interaction.reply({ content: 'this command can only be run in text channels!', ephemeral: true })
    }

    const commandInstructions = [
        '​\n`/link` - link this server to a realm.',
        '`/play` - join the realm.',
        '`/connect <room_name>` - connect this channel to a specific room.',
        '`/disconnect <room_name>` - disconnect this channel from a room.',
        '`/rooms` - see which rooms are connected to this channel.',
    ]

    await interaction.reply({ content: commandInstructions.join('\n'), ephemeral: true })
  },
}

export default command
