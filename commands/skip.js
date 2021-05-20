const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skip the currently playing song",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);

        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing`)
            .setDescription(`The queue is empty!`);


        if (!queue)
            return message.reply(NothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        let SkippedEmbed = new Discord.MessageEmbed()
            .setColor("#3b78e0")
            .setTitle("Song Skipped")
            .setDescription(`The song has been skipped`)
            .addField(`Skipped by`, message.author);

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(SkippedEmbed).catch(console.error);
    }
};
