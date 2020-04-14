const logger = require('../logger.js');
const blockchainSetting = require('../cardano/settings');
const PoolTool = require('../pooltool.js');
const DB = require('../db/storage');
const GuildManager = require('../db/guild.manager');
const MessageManager = require('../message.manager');

const api = new PoolTool();

/**
 * This class provides logic to post updates at each epoch turn over
 * for discord servers (i.e. guilds) that did set an update channel.
 */
class EpochUpdater {

    constructor(client) {
        this.client = client;
        this.db = DB.epochUpdatesDB;
    }

    start() {
        const currentEpoch = blockchainSetting.getCurrentEpoch();
        logger.log({
            level: 'info',
            message: `Epoch updater detected that we are in epoch ${currentEpoch}!`
        });
        this.db.get(currentEpoch - 1, (err) => {
            if (err) {
                logger.log({
                    level: 'info',
                    message: `No epoch updates have been performed for epoch ${currentEpoch - 1}.`
                });
                this.update(currentEpoch - 1);
            }
        });
        const nextEpochDate = blockchainSetting.getTimeFor(currentEpoch + 1, 100);
        const diff = nextEpochDate - new Date();
        logger.log({
            level: 'info',
            message: `Waiting ${diff} ms for the next epoch til ${nextEpochDate}.`
        });
        setTimeout(this.start, diff);
    }

    update(epoch) {
        const guildIDs = Object.keys(GuildManager.guilds);
        for (let i = 0; i < guildIDs.length; i++) {
            const guildID = guildIDs[i];
            const guild = GuildManager.guilds[guildID];
            api.getEpochHistoryInformation(guild.stakepoolID, epoch, (resp, err) => {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Could not fetch epoch statistics for epoch ${epoch} and stake pool with ID '${guild.stakepoolID}'.`,
                        error: err,
                    });
                } else if (resp) {
                    if (guild.updateChannels) {
                        const channelIDs = Object.keys(guild.updateChannels);
                        for (let c = 0; c < channelIDs.length; c++) {
                            const channelID = channelIDs[c];
                            this.client.channels.fetch(channelID).then(channel => {
                                const locales = guild.updateChannels[channelID];
                                for (let l = 0; l < locales.length; l++) {
                                    channel.send(MessageManager.locale(locales[l]).getEpochInformationMessage(resp));
                                }
                            }).catch(error => {
                                logger.log({
                                    level: 'error',
                                    message: `Could not find channel ${channelID} for guild ${guildID}.`,
                                    error: error,
                                    channelID: channelID,
                                    guildID: guildID,
                                });
                            });
                        }
                    }
                }
            });
        }
        this.db.put(epoch, true);
    }
}

module.exports = EpochUpdater;