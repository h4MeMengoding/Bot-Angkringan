const Discord = require('discord.js')
const simplydjs = require('simply-djs')
module.exports = {
    name: 'rr',
    category: "info",
    run : async (client, message, args, interaction) => {
      let embed = new Discord.MessageEmbed()
      .setTitle("AMBIL ROLE")
      .setDescription("React role untuk dapat mengakses ke semua room")
      .setFooter("ANGKRINGAN PAK WAHYUDI")
      .setColor("GREEN")
simplydjs.btnrole(client, message, {
    embed: embed,
    data: [
      {
        role: '950992417123860520',
        label: 'WARLOK', // default: *role name*
        color: 'SUCCESS', // default: SECONDARY
        emoji: '',
      }, // etc..
      {
        role: '952124343696126032',
        label: 'ANAK SMA', // default: *role name*
        color: 'PRIMARY', // default: SECONDARY
        emoji: '',
      }
      //Keep adding here more
    ],
  })
    }
}
