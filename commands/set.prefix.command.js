const MessageManager = require('../message.manager');

/**
 * handles the execution of the 'set-prefix <prefix>' command.
 *
 * @param guild in which the message occurred.
 * @param message that issued this command.
 * @param args expects one argument being the prefix.
 */
function executePrefixCommand(guild, message, args) {
    const messageService = MessageManager.locale(guild.locale ? guild.locale : 'en');
    if (args.length > 0) {
        guild.setPrefix(args[0]);
        message.channel.send(messageService.getCommandSuccessfulMessage('command.success.title', {},
            'command.success.prefix-update', {prefix: args[0]}));
    } else {
        message.channel.send(messageService.getCommandErrorMessage('command.error.prefix-missing',
            {}));
    }
}

module.exports = executePrefixCommand;