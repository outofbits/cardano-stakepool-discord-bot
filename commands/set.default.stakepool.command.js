const MessageManager = require('../message.manager');

/**
 * handles the execution of the 'set-default-stakepool <id>'.
 *
 * @param guild in which the message occurred.
 * @param message that issued this command.
 * @param args expects one argument being the stake pool ID.
 */
function setDefaultStakePool(guild, message, args) {
    const messageService = MessageManager.locale(guild.locale ? guild.locale : 'en');
    if (args.length > 0) {
        if (args[0].length === 64) {
            guild.setStakePoolID(args[0]);
            message.channel.send(messageService.getCommandSuccessfulMessage('command.success.title', {},
                'command.success.default-stake-pool-id', {id: args[0]}));
        } else {
            message.channel.send(messageService.getCommandErrorMessage('command.error.stake-pool-id-wrong',
                {}));
        }
    } else {
        message.channel.send(messageService.getCommandErrorMessage('command.error.stake-pool-id-missing',
            {}));
    }
}

module.exports = setDefaultStakePool;