const PoolTool = require('../pooltool.js');
const MessageManager = require('../message.manager');

const api = new PoolTool();

/**
 * handles the execution of the 'epoch <number>' command.
 *
 * @param guild in which the message occurred.
 * @param message that issued this command.
 * @param args expects one argument being the epoch number.
 */
function executeEpochCommand(guild, message, args) {
    const messageService = MessageManager.locale(guild.locale ? guild.locale : 'en');
    if (args.length > 0) {
        if (guild.stakepoolID) {
            api.getEpochHistoryInformation(guild.stakepoolID, args[0], (resp, err) => {
                if (err) {
                    message.channel.send(messageService.getCommandErrorMessage(err));
                } else if (resp) {
                    message.channel.send(messageService.getEpochInformationMessage(resp, {}));
                }
            });
        } else {
            message.channel.send(messageService.getCommandErrorMessage('command.error.default-stake-pool-not-set',
                {}));
        }
    } else {
        message.channel.send(messageService.getCommandErrorMessage('command.error.epoch-number-missing',
            {}));
    }
}

module.exports = executeEpochCommand;