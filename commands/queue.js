const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Show the music queue and now playing.",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);

        let NothingPlaying = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);

        if (!queue) return message.reply(NothingPlaying).catch(console.error);

        
        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        let queueEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name} Music Queue`)
            .setDescription(description)
            .setColor("#3b78e0");

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed);
        });
    }
};
