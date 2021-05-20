  
﻿const { canModifyQueue } = require("../util/handler");

module.exports = {
    name: "resume",
    aliases: ["r"],
    description: "Resume currently playing music",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);

        if (!queue) return message.reply(NothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!queue.playing) {
            let ResumedEmbed = new Discord.MessageEmbed()
            .setColor("#3b78e0")
            .setTitle("Player Resumed!")
            .setThumbnail(`https://cdn.discordapp.com/emojis/830034712650317825.png?v=1`)
            .setDescription(`The player has been resumed.`)
            .addField(`Resumed by`, message.author);

            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(ResumedEmbed).catch(console.error);
        }

        return message.reply("The queue is not paused.").catch(console.error);
    }
};
