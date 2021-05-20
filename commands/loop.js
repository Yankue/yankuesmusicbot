const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    name: "loop",
    aliases: ['l'],
    description: "Toggle music loop",
    execute(message) {
        let NothingPlaying = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Nothing Playing!`)
            .setDescription(`The queue is empty!`);

        
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(NothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        // toggle from false to true and reverse
        let loopEmbed = new Discord.MessageEmbed()
            .setColor("#3b78e0")
            .setTitle(`Loop ${queue.loop ? "disabled" : "enabled"}!`)
            .setDescription(`The loop has been turned  ${queue.loop ? "**off**" : "**on**"}`)
        queue.loop = !queue.loop;
        return queue.textChannel
            .send(loopEmbed)
            .catch(console.error);
    }
};
