const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    name: "shuffle",
    description: "Shuffle queue",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);

        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing`)
            .setDescription(`The queue is empty!`);


        if (!queue) return message.channel.send(NothingPlaying).catch(console.error);

        if (!canModifyQueue(message.member)) return;

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        const successEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`Queue Shuffled`)
            .setColor(`#3b78e0`)
            .setDescription(`The queue has been shuffled`)
            .addField(`Shuffled by`, message.author)
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(successEmbed).catch(console.error);
    }
};
