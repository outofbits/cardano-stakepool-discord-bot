const settings = require('../blockchain.json');

/**
 * checks the given argument, and if not true, then the given error message is
 * printed to the stderr console and this application is terminated.
 *
 * @param argument that shall be checked.
 * @param message which shall be printed, if the argument is not true.
 */
function checkArgument(argument, message) {
    if (!argument) {
        console.error(message);
        process.exit(1)
    }
}

/**
 * This class encapsulates relevant settings of the Cardano blockchain.
 *
 * @param genesisBlockHash hash of the genesis block.
 * @param genesisBlockTime creation time of the genesis block.
 * @param slotsPerEpoch the number of slots an epoch is divided into
 * @param slotDuration a slot has fixed duration, and thus has a start and end date.
 */
class BlockchainSetting {

    constructor(genesisBlockHash, genesisBlockTime, slotsPerEpoch, slotDuration) {
        checkArgument(genesisBlockHash, "Genesis Block Hash must be specified.");
        this.genesisBlockHash = genesisBlockHash;
        checkArgument(genesisBlockHash, "Genesis Block Time must be specified.");
        this.genesisBlockTime = Date.parse(genesisBlockTime);
        checkArgument(genesisBlockHash, "Slots Per Epoch must be specified.");
        this.slotsPerEpoch = slotsPerEpoch;
        checkArgument(genesisBlockHash, "Slots Duration must be specified in milliseconds.");
        this.slotDuration = slotDuration;
    };

    getCurrentEpoch() {
        const slots = ((new Date() - this.genesisBlockTime) / this.slotDuration);
        return Math.floor(slots / this.slotsPerEpoch);
    };

    getTimeFor(epoch, slots) {
        return new Date(this.genesisBlockTime + (this.slotDuration * (slots + epoch * this.slotsPerEpoch)));
    }
}

module.exports = new BlockchainSetting(settings.GENESIS_BLOCK_HASH, settings.GENESIS_BLOCK_TIME,
    settings.SLOTS_PER_EPOCH, settings.SLOT_DURATION);