const MessageManager = require('../message.manager');

/**
 * handles the execution of the 'set-default-locale <locale>'.
 *
 * @param guild in which the message occurred.
 * @param message that issued this command.
 * @param args expects one argument being the locale.
 */
function setDefaultLocale(guild, message, args) {
    const messageService = MessageManager.locale(guild.locale ? guild.locale : 'en');
    if (args.length > 0) {
        if (MessageManager.getSupportedLocales().includes(args[0])) {
            guild.setLocale(args[0]);
            message.channel.send(messageService.getCommandSuccessfulMessage('command.success.title', {},
                'command.success.default-locale', {locale: args[0]}));
        } else {
            message.channel.send(messageService.getCommandErrorMessage('command.error.locale-unknown',
                {locale: args[0]}));
        }
    } else {
        message.channel.send(messageService.getCommandErrorMessage('command.error.locale-missing',
            {}));
    }
}

module.exports = setDefaultLocale;