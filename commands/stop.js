const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    name: "destroy",
    aliases: ["stop", "fs"],
    description: "Stops the music",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);

        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);

        if (!queue) return message.reply(NothingPlaying).catch(console.error);

        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        let StoppedEmbed = new Discord.MessageEmbed()
            .setColor("#3b78e0")
            .setTitle("Player Stopped")
            .setThumbnail(`https://cdn.discordapp.com/emojis/830034712650317825.png?v=1`)
            .setDescription(`The player has been stopped `)
            .addField(`Stopped by`, message.author);

        queue.textChannel.send(StoppedEmbed).catch(console.error);
    }
};
