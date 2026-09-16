const env = require('../config/env');
const fileDriver = require('./drivers/fileDriver');

const driver = env.supabase.enabled ? require('./drivers/supabaseDriver') : fileDriver;

module.exports = { driver, fileDriver };
