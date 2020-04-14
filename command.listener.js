const logger = require('./logger.js');
const GuildManager = require('./db/guild.manager');
const epochCommand = require('./commands/epoch.command');
const setEpochUpdateChannelCommand = require('./commands/set.epoch.update.channel.command');
const setDefaultStakePool = require('./commands/set.default.stakepool.command');
const setDefaultLocale = require('./commands/set.default.locale.command');
const setPrefix = require('./commands/set.prefix.command');

const defaultPrefix = '!';

const commandMap = {
    'epoch': epochCommand,
    'set-update-channel': setEpochUpdateChannelCommand,
    'set-default-stakepool': setDefaultStakePool,
    'set-default-locale': setDefaultLocale,
    'set-prefix': setPrefix,
};

/**
 * listens for messages and checks whether they are intending
 * to start a command.
 *
 * @param message which this method is listening for.
 */
function listen(message) {
    const guild = GuildManager.getOrCreateGuild(message.channel.guild.id);
    const split = message.content.replace(/\s+/g, ' ').split(' ');
    if (split && split.length > 0 && split[0].startsWith(guild.prefix ? guild.prefix : defaultPrefix)) {
        let command = split[0];
        command = command.substring(1, command.length);
        if (command in commandMap) {
            const arguments = split.slice(1, split.length);
            logger.log({
                level: 'debug',
                message: `Command '${command}' detected.`,
                arguments: arguments
            });
            commandMap[command](guild, message, arguments);
        }
    }
}

module.exports = listen;