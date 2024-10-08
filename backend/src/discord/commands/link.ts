import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('link your server to a realm.'),
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

    const link = new URL(process.env.FRONTEND_URL! + '/link')
    const params = new URLSearchParams({
        id: guild.id,
        name: guild.name,
    })
    link.search = params.toString()

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Click Here')
          .setStyle(ButtonStyle.Link)
          .setURL(link.toString())
      )

    await interaction.reply({ content: '​\n\n**🚀 click the button below to link this server to a realm! 🚀**\n​', components: [row], ephemeral: true })
  },
}

export default command
