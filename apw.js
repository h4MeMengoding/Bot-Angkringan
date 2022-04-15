const express = require('express')
const app = express()
const chalk = require("chalk")


app.get('/', (req, res) => {
  res.send(`Hello world.`);
});

app.listen(3000, () => {
  console.log(chalk.green("Success!"));
});

const { Discord, Client, Collection, MessageEmbed, Intents } = require("discord.js");
require("dotenv").config();
const client = new Client({intents: '32767'});
const { prefix } = require("./config.json")
const Timeout = new Set();
const ms = require('ms')
const rhs = process.env['TOKEN'];
const simplydjs = require("simply-djs")
client.commands = new Collection();
client.aliases = new Collection();
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.on("ready", async () => {
  console.log(chalk.gray("Connected To"), chalk.yellow(`${client.user.tag}`))
  console.log(chalk.white("Watching"), chalk.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),chalk.white("Users,"),chalk.red(`${client.guilds.cache.size}`),chalk.white("Servers."))

})
// messageCreate Event
let db = require('quick.db')
client.on('messageCreate', message => { 
  if(message.author.bot) return;
  if(!message.guild) return;
const args = message.content.split(" ").slice(1)

if(message.content.toLowerCase().startsWith("w?ghostpingdetector")) {
  //=====
 let embedon = new MessageEmbed()
 .setDescription(":green_square: | Turned On GhostPingDetector")
 .setTimestamp()

 //===
  let embedoff = new MessageEmbed()
 .setDescription(":red_square: | Turned Off GhostPingDetector")
 .setTimestamp()
 //====
   if(!args[0]) return message.reply('Do You Want To Turn On or Off ghostpingdetector? Please Type \`w?ghostpingdetector true/false\` or \`on/off\`');
     if(args[0] === "on" || args[0] === "true") {
   message.reply({embeds: [embedon]})
   db.set(`gp_${message.author.id}`, true)
     } else if(args[0] === "off" || args[0] === "false") {
     db.delete(`gp_${message.author.id}`)
     message.reply({embeds: [embedoff]})
   }
   }
})

client.on("interactionCreate", interaction => {
    simplydjs.clickBtn(interaction)
})

client.on('messageDelete', message => {
message.mentions.users.forEach(m => {
  if(db.has(`gp_${m.id}`) && m.id !== message.author.id && !message.author.bot){
    
    let emb = new MessageEmbed()
    emb.setTitle('GhostPingDetector')
    emb.setDescription(`<@${m.id}>, You've Been Ghost Pinged.\nUserName: \`${message.author.username}\`\nUserID: \`${message.author.id}\`\nServerName: ${message.guild.name}\nChannel: <#${message.channel.id}>\nContent: ${message.content}`)
    emb.setColor("GREEN")
    emb.setFooter(`Code By DrakeZee#5223`)
    m.send({embeds: [emb]})
    message.channel.send({embeds: [emb]})
    }
  
})
})


client.on("messageCreate", async message => {
 
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) {
    if (command.timeout) {
      if (Timeout.has(`${message.author.id}${command.name}`)) {
        let timecommand = ms(command.timeout) / 1000
        return message.channel.send(new MessageEmbed().setColor("RED").setTitle(`**Slow down, you can only use this command every ${timecommand}! seconds**`))
      } else {
        command.run(client, message, args);
        Timeout.add(`${message.author.id}${command.name}`)
        setTimeout(() => {
          Timeout.delete(`${message.author.id}${command.name}`)
        }, command.timeout);
      }
    } else {
      command.run(client, message, args)
    }
  }
});
client.login(rhs);