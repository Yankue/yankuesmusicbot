const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`)

module.exports = {
    name: "pause",
    description: "Pause the currently playing music",
    execute(message) {
        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);


        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(NothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (queue.playing) {
            let PausedEmbed = new Discord.MessageEmbed()
                .setColor("#3b78e0")
                .setTitle("Player paused")
                .setDescription(`The player has been paused`)
                .addField(`Paused by`, message.author)

            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(PausedEmbed).catch(console.error);
        }
    }
};
