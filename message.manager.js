const i18n = require('./i18n.config.js');
const Discord = require('discord.js');

/**
 * A service to format human friendly messages for a certain locale.
 */
class MessageLocalizationService {

    constructor(i18n, locale) {
        this.i18n = i18n.cloneInstance({
            lng: locale,
        });
    }

    getCommandErrorMessage(error, args) {
        return new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(this.i18n.t('command.error.title'))
            .setDescription(this.i18n.t(error, args))
    };

    getCommandSuccessfulMessage(title, titleArgs, message, messageArgs) {
        return new Discord.MessageEmbed()
            .setColor(0x00ff00)
            .setTitle(this.i18n.t(title, titleArgs))
            .setDescription(this.i18n.t(message, messageArgs))
    }

    getEpochInformationMessage(poolToolResponse) {
        const message = new Discord.MessageEmbed()
            .setColor(0x0000ff)
            .setThumbnail("https://staking.cardano.org/static/cardano-c938b7a7daa2089500048ce74f3bdb71.png")
            .setTitle(this.i18n.t('pool.epoch-update.title', {epoch: poolToolResponse.epoch}));

        // minted blocks
        if (poolToolResponse.blocks) {
            if (poolToolResponse.epochSlots) {
                message.addField(this.i18n.t('pool.epoch-update.minted-blocks.title'),
                    this.i18n.t('pool.epoch-update.minted-blocks.value',
                        {minted: poolToolResponse.blocks}), true)
            } else {
                message.addField(this.i18n.t('pool.epoch-update.minted-blocks.title'),
                    `${poolToolResponse.blocks}`, true);
            }
        }

        // delegator rewards
        if (poolToolResponse.value_for_stakers) {
            message.addField(this.i18n.t('pool.epoch-update.delegator-rewards.title'),
                this.i18n.t('pool.epoch-update.delegator-rewards.value',
                    {reward: (poolToolResponse.value_for_stakers / 1000000).toFixed(0)}), true);
        }

        // ros
        if (poolToolResponse.blockstake && poolToolResponse.value_for_stakers) {
            const ros = (365.5 * poolToolResponse.value_for_stakers / poolToolResponse.blockstake);
            message.addField(this.i18n.t('pool.epoch-update.ros.title'),
                this.i18n.t('pool.epoch-update.ros.value', {ros: ros}), true);
        } else {
            message.addField(this.i18n.t('pool.epoch-update.ros.title'), '/', true);
        }

        // stake
        if (poolToolResponse.blockstake) {
            message.addField(this.i18n.t('pool.epoch-update.block-stake.title'),
                this.i18n.t('pool.epoch-update.block-stake.value',
                    {stake: (poolToolResponse.blockstake / 1000000).toFixed(0)}), true);
        }

        return message;
    };
}

/**
 * A manager of MessageLocalizationServices for a number of supported languages.
 */
class MessageManager {

    constructor() {
        this.services = {
            en: new MessageLocalizationService(i18n, 'en'),
            de: new MessageLocalizationService(i18n, 'de'),
        }
    }

    /**
     * gets the MessageLocalizationService for the given locale, or undefined, if not supported.
     *
     * @param locale for which the corresponding MessageLocalizationService shall be returned.
     * @returns {*} the corresponding MessageLocalizationService.
     */
    locale(locale) {
        return this.services[locale];
    }

    /**
     * gets a list of the supported locales.
     *
     * @returns {string[]} a list of the supported locales.
     */
    getSupportedLocales() {
        return ['en', 'de'];
    }

}

module.exports = new MessageManager();