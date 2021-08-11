const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core-discord");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const Discord = require(`discord.js`);

module.exports = {
    name: "play",
    cooldown: 3,
    aliases: ["p"],
    description: "Plays audio from YouTube or Soundcloud",
    async execute(message, args, client) {
        /*
        Embeds
        */
        let musicHelp = new Discord.MessageEmbed()
            .setTitle(this.name.toUpperCase) 
            .setColor(`#3b78e0`)
            .setDescription(`Plays audio from YouTube or Soundcloud`)
            .addField(`Usage`, '`' + message.client.prefix + this.name + ` <YouTube URL | Video Name | Soundcloud URL>`);
        
        let ConnectPermMissing = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Permissions missing!")
            .setDescription("Cannot connect to voice channel, missing permissions");
        
        let VoicePermMissing = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Permissions missing!")
            .setDescription("I cannot speak in this voice channel, make sure I have the proper permissions!");
            
        let FetchSoundcloudErr = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Error")
            .setDescription("Could not find that Soundcloud track");

        let PlaySoundcloudErr = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Error")
            .setDescription("There was an error playing that Soundcloud track.");
            
        let NoVideoFound = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Error")
            .setDescription(`No video was found with a matching title`);
            
        let JoinChannelBot = new Discord.MessageEmbed()
            .setTitle(`Error`)
            .setDescription(`You need to be in the same Voice Channel as ${message.client.user} to use this command!`);
            


        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(JoinChannelBot).catch(console.error);

        if (!args.length)
            return message
                .reply(musicHelp)
                .catch(console.error);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply(ConnectPermMissing);
        if (!permissions.has("SPEAK"))
            return message.reply(VoicePermMissing);

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get("playlist").execute(message, args);
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                let videoThumbnail = songInfo.videoDetails.thumbnails[0];
                let videoThumbnailURL = videoThumbnail.url;
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    thumbnail: videoThumbnailURL,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].id);
                let videoThumbnail = songInfo.videoDetails.thumbnails[0];
                let videoThumbnailURL = videoThumbnail.url;
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    thumbnail: videoThumbnailURL
                };
            } catch (error) {
                console.error(error);
                return message.reply(NoVideoFound).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            let QueueSongAdd = new Discord.MessageEmbed()
                .setTitle(`Now playing`)
                .setThumbnail(song.thumbnail)
                .setColor("#3b78e0")
                .setDescription(`__[${song.title}](${song.url})__`)
                .addField(`Song added by`, message.author);
            
            if (QueueSongAdd.description.length >= 75)
                QueueSongAdd.description = `${QueueSongAdd.description.substr(0, 75)}...`;
            
            return serverQueue.textChannel
                .send(QueueSongAdd)
                .catch(console.error);
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
        }
    }
};
