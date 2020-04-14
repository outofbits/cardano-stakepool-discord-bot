const Discord = require('discord.js');
const logger = require('./logger.js');
const DB = require('./db/storage.js');
const Guild = require('./db/guild.js');
const GuildManager = require('./db/guild.manager');
const EpochUpdater = require('./cardano/epoch.updater.js');
const commandListening = require('./command.listener.js');

const client = new Discord.Client();
const epochUpdater = new EpochUpdater(client);

client.on('ready', () => {
    logger.log({
        level: 'info',
        message: `Logged in as ${client.user.tag}!`
    });
    epochUpdater.start();
});

client.on('message', msg => {
    commandListening(msg);
});

const guilds = {};

DB.guildDB.createReadStream()
    .on('data', (data => {
        guilds[data.key] = Guild.restore(data.value);
    }))
    .on('end', () => {
        GuildManager.register(guilds);
        if (process.env.TOKEN) {
            client.login(process.env.TOKEN);
        } else {
            console.error('You must specify the token for your Discord bot.');
            process.exit(1);
        }
    });



