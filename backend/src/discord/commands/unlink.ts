import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'
import { supabase } from '../../supabase'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('unlink your server from the realm.'),
  async execute(interaction: ChatInputCommandInteraction) {

    const guild = interaction.guild as Guild
    if (interaction.user.id !== guild.ownerId) {
      await interaction.reply({ content: 'only the owner of this server can link it to a realm. sorry!', ephemeral: true })
      return
    }
    if (!(interaction.channel instanceof GuildChannel)) return
    if (!interaction.channel.isTextBased()) {
        return await interaction.reply({ content: 'this command can only be run in text channels!', ephemeral: true })
    }

    const { error: updateError } = await supabase.from('realms').update({ discord_server_id: null }).eq('discord_server_id', guild.id)
    if (updateError) {
        return await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
    }

    await interaction.reply({ content: 'This server has been unlinked from the realm!', ephemeral: true })
  },
}

export default command
