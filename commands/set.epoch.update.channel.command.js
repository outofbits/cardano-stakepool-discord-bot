const MessageManager = require('../message.manager');

/**
 * handles the execution of the 'set-epoch-update <channel-id> <locale>'.
 *
 * @param guild in which the message occurred.
 * @param message that issued this command.
 * @param args expects two arguments, namely the channel ID and optionally locale.
 */
function setEpochUpdateChannel(guild, message, args) {
    const messageService = MessageManager.locale(guild.locale ? guild.locale : 'en');
    if (args.length >= 1) {
        const channelTxt = args[0];
        if (channelTxt.startsWith('<#') && channelTxt.endsWith('>')) {
            const channelID = channelTxt.substring(2, channelTxt.length - 1);
            const locale = args[1] ? args[1] : 'en';
            if (MessageManager.getSupportedLocales().includes(locale)) {
                guild.addUpdateChannel(channelID, locale);
                message.channel.send(messageService.getCommandSuccessfulMessage('command.success.title', {},
                    'command.success.epoch-update-channel', {locale: locale}));
            } else {
                message.channel.send(messageService.getCommandErrorMessage('command.error.locale-unknown',
                    {locale: locale}));
            }
        } else {
            message.channel.send(messageService.getCommandErrorMessage('command.error.channel-wrong',
                {}));
        }
    } else {
        message.channel.send(messageService.getCommandErrorMessage('command.error.channel-missing',
            {}));
    }
}

module.exports = setEpochUpdateChannel;