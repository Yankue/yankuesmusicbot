const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/handler");
const Discord = require(`discord.js`);

module.exports = {
    async play(song, message) {
        const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
        const queue = message.client.queue.get(message.guild.id);

        if (!song) {
            let VCLeave = new Discord.MessageEmbed()
                .setTitle(`Music queue ended`)
                .setColor("#11fc46")
                .setDescription(`I have left <#${queue.channel.id}> as the Music Queue ended`)
                .setTimestamp();

            queue.channel.leave();
            message.client.queue.delete(message.guild.id);
            return queue.textChannel.send(VCLeave).catch(console.error);
        }

        let stream = null;
        let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

        try {
            if (song.url.includes("youtube.com")) {
                stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
            } else if (song.url.includes("soundcloud.com")) {
                try {
                    stream = await scdl.downloadFormat(
                        song.url,
                        scdl.FORMATS.OPUS,
                        SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
                    );
                } catch (error) {
                    stream = await scdl.downloadFormat(
                        song.url,
                        scdl.FORMATS.MP3,
                        SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
                    );
                    streamType = "unknown";
                }
            }
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }

            console.error(error);
            return message.channel.send(`Error: ${error.message ? error.message : error}`);
        }

        queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on("finish", () => {
                if (collector && !collector.ended) collector.stop();

                if (queue.loop) {
                    // if loop is on, push the song back at the end of the queue
                    // so it can repeat endlessly
                    let lastSong = queue.songs.shift();
                    queue.songs.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                } else {
                    // Recursively play the next song
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                }
            })
            .on("error", (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        try {
            let NowPlaying = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle(`Now playing`)
                .setThumbnail(song.thumbnail)
                .setColor("#3b78e0")
                .setDescription(`__[${song.title}](${song.url})__`)
                .addField(`Song added by`, message.author);

            if (NowPlaying.description.length >= 75)
                NowPlaying.description = `${NowPlaying.description.substr(0, 75)}...`;

            var playingMessage = await queue.textChannel.send(NowPlaying);
        } catch (error) {
            console.error(error);
        }

        const filter = (reaction, user) => user.id !== message.client.user.id;
        var collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });

        collector.on("end", () => {
            playingMessage.reactions.removeAll().catch(console.error);
            if (PRUNING && playingMessage && !playingMessage.deleted) {
                playingMessage.delete({ timeout: 3000 }).catch(console.error);
            }
        });
    }
};
