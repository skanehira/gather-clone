import { SlashCommandBuilder, ChatInputCommandInteraction, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'
import { getRoomFromName, getRoomNamesWithChannelId } from '../../utils'
import { supabase } from '../../supabase'

const command: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('disconnect this channel from a room in your realm.')
    .addStringOption(option => 
        option
            .setName('room_name')
            .setDescription('the name of the room you want to disconnect with.')
            .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild
    if (interaction.user.id !== guild.ownerId) {
      return await interaction.reply({ content: 'only the owner of this server can run this command. sorry!', ephemeral: true })
    }
    if (!(interaction.channel instanceof GuildChannel)) return
    if (!interaction.channel.isTextBased()) {
        return await interaction.reply({ content: 'this command can only be run in text channels!', ephemeral: true })
    }

    const { data: realms, error: getRealmError } = await supabase.from('realms').select('map_data').eq('discord_server_id', guild.id)
    if (getRealmError) {
        await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
        return
    }
    if (realms.length === 0) {
        await interaction.reply({ content: "This server is not linked to a realm! Link it with the `/link` command!", ephemeral: true })
        return
    }

    const realm = realms[0]

    const roomName = interaction.options.getString('room_name')!

    const mapData = realm.map_data
    const room = getRoomFromName(mapData, roomName)

    if (!room) {
        const roomNames = getRoomNamesWithChannelId(mapData, interaction.channelId)
        let message = ''
        if (roomNames.length === 0) {
            message = `This channel is not connected to any rooms, no need to disconnect anything!`
        } else {
            message = `No room with that name is connected to this channel. Here are the rooms this channel is connected to: ${roomNames.map(name => '`' + name + '`').join(', ')}`
        }
        return await interaction.reply({ content: message, ephemeral: true })
    }

    delete room.channelId 

    const { error: updateError } = await supabase.from('realms').update({ map_data: mapData }).eq('discord_server_id', guild.id)
    if (updateError) {
        return await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
    }

    await interaction.reply({ content: `${interaction.channel} has been disconnected from ` + '`' + room.name + '`' + '!', ephemeral: true })
  },
}

export default command
