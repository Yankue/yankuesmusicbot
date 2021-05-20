const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    name: "remove",
    description: "Remove song from the queue",
    execute(message, args, client) {
        const queue = message.client.queue.get(message.guild.id);
        let removeHelp = new Discord.MessageEmbed()
            .setColor("#11fc46")
            .setTitle(this.name.toUpperCase)
            .setDescription('Removes the provided song from the queue')
            .addField(`Usage`, '`' + client.prefix + this.name + ` <Queue Number>` + '`');

        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);

        if (!queue) return message.channel.send(NothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!args.length) return message.reply(removeHelp);
        if (isNaN(args[0])) return message.reply(removeHelp);

        let SongRemoved = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`Song Removed`)
            .setColor("#3b78e0")
            .setDescription(`**${song[0].title}** has been removed from the queue`)
            .addField(`Removed by`, message.author);

        const song = queue.songs.splice(args[0] - 1, 1);
        queue.textChannel.send(SongRemoved);
    }
};
