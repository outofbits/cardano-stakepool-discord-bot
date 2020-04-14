const axios = require('axios');
const logger = require('./logger.js');
const blockchainSetting = require('./cardano/settings');

/**
 * A wrapper for the Pool Tool API.
 *
 * @type {PoolTool}
 */
module.exports = (class PoolTool {

    constructor() {
        this.apiURL = 'https://pooltool.s3-us-west-2.amazonaws.com/'
            + blockchainSetting.genesisBlockHash.substring(0, 7);
    }

    /**
     * fetches the history details for the given stake pool and epoch.
     *
     * @param stakePoolID ID of the stakepool for which the details shall be fetched.
     * @param epoch for which the epoch details shall be fetched.
     * @param callback function handling the result, first argument is the response
     * and second the error.
     */
    getEpochHistoryInformation = (stakePoolID, epoch, callback) => {
        axios.get(this.apiURL + '/pools/' + stakePoolID + '/epochstats.json').then(response => {
            logger.log({
                level: 'debug',
                message: 'getEpochHistoryInformation',
                stakePoolID,
                epoch,
                response: response.data,
            });
            const value = response.data[`${epoch}`];
            if (value) {
                callback(value, null);
            } else {
                callback(null, 'pooltool.error.epoch-unknown-error');
            }
        }).catch(error => {
            logger.log({
                level: 'error',
                message: 'Could not fetch epoch history from Pool Tool.',
                error,
                stakePoolID,
                epoch,
            });
            callback(null, 'pooltool.error.connection-error');
        })
    };
});