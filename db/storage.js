const level = require('level');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.DB_DIR ? process.env.DB_DIR : path.join('./', 'data');
const guildDir = path.join(dbDir, 'guild');
const epochUpdatesDir = path.join(dbDir, 'epoch_updates');

fs.mkdirSync(guildDir, {recursive: true});
fs.mkdirSync(epochUpdatesDir, {recursive: true});

module.exports = {
    guildDB: level(guildDir),
    epochUpdatesDB: level(epochUpdatesDir),
};