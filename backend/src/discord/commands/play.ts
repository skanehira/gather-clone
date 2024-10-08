import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'
import { supabase } from '../../supabase'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('join the realm!'),
  async execute(interaction: ChatInputCommandInteraction) {

    if (!(interaction.channel instanceof GuildChannel)) return
    if (!interaction.channel.isTextBased()) {
        return await interaction.reply({ content: 'this command can only be run in text channels!', ephemeral: true })
    }

    const guildId = interaction.guildId
    const { data: realms, error: getRealmError } = await supabase.from('realms').select('share_id, id').eq('discord_server_id', guildId)
    if (getRealmError) {
        await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
        return
    }
    if (realms.length === 0) {
        await interaction.reply({ content: "This server is not linked to a realm! Link it with the `/link` command!", ephemeral: true })
        return
    }

    const realm = realms[0]
    const link = new URL(process.env.FRONTEND_URL! + `/play/${realm.id}`)
    const params = new URLSearchParams({
        shareId: realm.share_id,
    })
    link.search = params.toString()

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('🕹️ PLAY!')
          .setStyle(ButtonStyle.Link)
          .setURL(link.toString())
      )

    await interaction.reply({ content: '​\n\n**click the button below to join the realm.**\n​', components: [row], ephemeral: true })
  },
}

export default command
