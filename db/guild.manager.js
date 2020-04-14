const Guild = require('./guild');

/**
 * A manager that maintains discord servers in memory.
 */
class GuildManager {

    constructor() {
        this.guilds = {};
    }

    register(newGuilds) {
        return Object.assign(this.guilds, newGuilds)
    }

    getOrCreateGuild(id) {
        if (!(id in this.guilds)) {
            this.guilds[id] = new Guild(id);
            this.guilds[id].save();
        }
        return this.guilds[id];
    }

}

module.exports = new GuildManager();