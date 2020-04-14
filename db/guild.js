const DB = require('./storage');
const logger = require('../logger.js');

/**
 * A class that encapsulates kes details for a discord server.
 */
class Guild {

    constructor(id, prefix, stakepoolID, locale, updateChannels) {
        this.id = id;
        this.prefix = prefix;
        this.stakepoolID = stakepoolID;
        this.locale = locale;
        this.updateChannels = updateChannels ? updateChannels : {};
    }

    setPrefix(prefix) {
        this.prefix = prefix;
        this.save();
    }

    setStakePoolID(id) {
        this.stakepoolID = id;
        this.save();
    }

    setLocale(locale) {
        this.locale = locale;
        this.save();
    }

    addUpdateChannel(channelID, locale) {
        let changed = false;
        if (!(channelID in this.updateChannels)) {
            this.updateChannels[channelID] = [];
            changed = true;
        }
        if (!(this.updateChannels[channelID].includes(locale))) {
            this.updateChannels[channelID].push(locale);
            changed = true;
        }
        if (changed) {
            this.save();
        }
    }

    static restore(json) {
        const obj = JSON.parse(json);
        return new Guild(obj.id, obj.prefix, obj.stakepoolID, obj.locale, obj.updateChannels);
    }

    save() {
        DB.guildDB.put(this.id, JSON.stringify(this), (err) => {
            if (err) {
                logger.log({
                    level: 'error',
                    error: err,
                });
            }
        });
    }
}

module.exports = Guild;